import {
    initializeApp,
    cert,
    getApps,
    ServiceAccount,
    AppOptions,
    App,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

/**
 * Retrieves Firebase configuration from environment variables
 *
 * @returns {AppOptions} Firebase application configuration object
 * @throws {Error} If any required environment variables are missing
 */
const getFirebaseConfig = (): AppOptions => {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
        process.env;

    if (
        !FIREBASE_PROJECT_ID ||
        !FIREBASE_CLIENT_EMAIL ||
        !FIREBASE_PRIVATE_KEY
    ) {
        throw new Error(
            "Missing Firebase configuration. Please check your environment variables"
        );
    }

    const serviceAccount: ServiceAccount = {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };

    return {
        credential: cert(serviceAccount),
    };
};

/**
 * Initializes Firebase Admin SDK if not already initialized
 *
 * @returns {App} Firebase Admin app instance
 */
const initializeFirebaseAdmin = (): App => {
    const existingApp: App = getApps()[0];
    if (existingApp) {
        return existingApp;
    }

    return initializeApp(getFirebaseConfig());
};

const firebaseApp: App = initializeFirebaseAdmin();

const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp);

export { auth, db };