import { initializeApp, getApps, getApp, cert, type AppOptions, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseConfig as clientConfig } from "./config";

// Note: The service account credentials are not available in this environment
// for direct use. We will use the client-side config for server-side initialization
// in this specific setup, which is acceptable for environments where server-side
// and client-side code run in a trusted context. For production deployments with
// separate backends, a service account is recommended.

const firebaseConfig: AppOptions = {
    projectId: clientConfig.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    // Service account is not used here, auth is handled via client SDK credentials
};

let app;

try {
    const rawCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
    const credentialOptions: AppOptions = rawCredentials
      ? (() => {
          const parsed = JSON.parse(rawCredentials) as any;
          const serviceAccount: ServiceAccount = {
            projectId: parsed.project_id ?? parsed.projectId,
            clientEmail: parsed.client_email ?? parsed.clientEmail,
            privateKey: (parsed.private_key ?? parsed.privateKey)?.replace(/\\n/g, "\n"),
          };
          return {
            credential: cert({
              ...serviceAccount,
            }),
          };
        })()
      : {};

    const mergedConfig: AppOptions = { ...firebaseConfig, ...credentialOptions };

    // Check if the app is already initialized to prevent errors
    app = !getApps().length ? initializeApp(mergedConfig) : getApp();
} catch (e) {
    // Check if the app is already initialized to prevent errors
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);