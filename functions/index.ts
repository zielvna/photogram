import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, getFirestore } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const signUp = async (username: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, 'users', user.uid), {});
};

export const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
};
