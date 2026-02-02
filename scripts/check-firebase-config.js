/**
 * Script to verify Firebase project configuration matches
 * Run: node scripts/check-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Project Configuration...\n');

// Check client config from env vars
const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
console.log('Client Project ID (from env):', clientProjectId || '❌ NOT SET');

// Check service account file
const serviceAccountPath = path.join(process.cwd(), 'mindsage-firebase.json');
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('Service Account Project ID:', serviceAccount.project_id || '❌ NOT FOUND');
    console.log('Service Account Project Number:', serviceAccount.project_number || '❌ NOT FOUND');
    
    // Compare
    if (clientProjectId && serviceAccount.project_id) {
      if (clientProjectId === serviceAccount.project_id) {
        console.log('\n✅ Project IDs MATCH');
      } else {
        console.log('\n❌ Project IDs DO NOT MATCH');
        console.log('   Client:', clientProjectId);
        console.log('   Service Account:', serviceAccount.project_id);
      }
    } else {
      console.log('\n⚠️  Cannot compare - missing values');
    }
  } catch (error) {
    console.log('❌ Error reading service account file:', error.message);
  }
} else {
  console.log('⚠️  Service account file not found at:', serviceAccountPath);
  console.log('   Checking environment variable FIREBASE_SERVICE_ACCOUNT_KEY...');
  
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = typeof serviceAccountKey === 'string' 
        ? JSON.parse(serviceAccountKey) 
        : serviceAccountKey;
      console.log('Service Account Project ID (from env):', serviceAccount.project_id || '❌ NOT FOUND');
      
      if (clientProjectId && serviceAccount.project_id) {
        if (clientProjectId === serviceAccount.project_id) {
          console.log('\n✅ Project IDs MATCH');
        } else {
          console.log('\n❌ Project IDs DO NOT MATCH');
        }
      }
    } catch (error) {
      console.log('❌ Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    }
  } else {
    console.log('❌ FIREBASE_SERVICE_ACCOUNT_KEY not set');
  }
}

console.log('\n📋 Summary:');
console.log('   - Client config uses: NEXT_PUBLIC_FIREBASE_PROJECT_ID');
console.log('   - Admin SDK uses: service account project_id');
console.log('   - These MUST match for auth to work correctly');
