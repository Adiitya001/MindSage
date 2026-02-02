// Firebase Admin SDK (for server-side use)
// Supports loading credentials from:
// 1. Environment variable FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
// 2. mindsage-firebase.json file (development fallback)
import { initializeApp, getApps, cert, App } from "firebase-admin/app"
import { getFirestore, Firestore } from "firebase-admin/firestore"
import { getAuth, Auth } from "firebase-admin/auth"
import * as fs from "fs"
import * as path from "path"

let app: App
let adminDb: Firestore
let adminAuth: Auth

if (!getApps().length) {
  try {
    let serviceAccount: any = null

    // Try to load from environment variable first (production/preferred)
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (serviceAccountKey) {
      try {
        serviceAccount = typeof serviceAccountKey === "string"
          ? JSON.parse(serviceAccountKey)
          : serviceAccountKey
      } catch (parseError) {
        console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY from env, trying file...")
      }
    }

    // Fallback to JSON file if env var not set (development)
    if (!serviceAccount) {
      try {
        const credentialsPath = path.join(process.cwd(), "mindsage-firebase.json")
        if (fs.existsSync(credentialsPath)) {
          const fileContent = fs.readFileSync(credentialsPath, "utf8")
          serviceAccount = JSON.parse(fileContent)
          console.log("Loaded Firebase credentials from mindsage-firebase.json")
        }
      } catch (fileError) {
        console.warn("Could not load Firebase credentials from file:", fileError)
      }
    }

    // Initialize Firebase Admin
    if (serviceAccount) {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    } else {
      // Fallback: Initialize with project ID only (for emulator or testing)
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      if (!projectId) {
        throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required when Firebase service account is not configured")
      }
      console.warn(`Firebase Admin initialized without credentials. Using project ID from env`)
      app = initializeApp({
        projectId,
      })
    }

    adminDb = getFirestore(app)
    adminAuth = getAuth(app)
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (!projectId) throw error
    app = initializeApp({
      projectId,
    })
    adminDb = getFirestore(app)
    adminAuth = getAuth(app)
  }
} else {
  app = getApps()[0]
  adminDb = getFirestore(app)
  adminAuth = getAuth(app)
}

export { adminDb, adminAuth }
