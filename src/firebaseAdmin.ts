import { credential } from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig = {
    credential: credential.cert({
        privateKey: (process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
        clientEmail: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_CLIENT_EMAIL,
        projectId: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PROJECT_ID,
    }),
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth(getApp());
