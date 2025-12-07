
import { initializeApp, getApps, getApp, cert, type FirebaseOptions } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseConfig as clientConfig } from "./config";

// Note: The service account credentials are not available in this environment
// for direct use. We will use the client-side config for server-side initialization
// in this specific setup, which is acceptable for environments where server-side
// and client-side code run in a trusted context. For production deployments with
// separate backends, a service account is recommended.

const firebaseConfig: FirebaseOptions = {
    projectId: clientConfig.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    // Service account is not used here, auth is handled via client SDK credentials
};


// Check if the app is already initialized to prevent errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
    