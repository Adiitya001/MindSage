const fs = require('fs');
const path = require('path');

const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const serviceAccountPath = path.join(process.cwd(), 'mindsage-firebase.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (clientProjectId && serviceAccount.project_id) {
      if (clientProjectId === serviceAccount.project_id) {
        console.log('✅ Project IDs MATCH');
      } else {
        console.log('❌ Project IDs DO NOT MATCH');
      }
    }
  } catch (error) {
    console.error('Error reading service account file:', error.message);
  }
} else {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = typeof serviceAccountKey === 'string' ? JSON.parse(serviceAccountKey) : serviceAccountKey;
      if (clientProjectId && serviceAccount.project_id && clientProjectId === serviceAccount.project_id) {
        console.log('✅ Project IDs MATCH');
      }
    } catch (error) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    }
  }
}
