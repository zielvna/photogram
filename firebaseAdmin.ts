import { credential } from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccountKey from './serviceAccountKey.json';

const firebaseConfig = {
    credential: credential.cert({
        privateKey: serviceAccountKey.private_key,
        clientEmail: serviceAccountKey.client_email,
        projectId: serviceAccountKey.project_id,
    }),
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const auth = getAuth(getApp());

export { auth };
