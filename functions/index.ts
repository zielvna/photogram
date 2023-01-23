import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

import IPost from '../types/Post';

export const signUp = async (username: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, 'users', user.uid), {});
};

export const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const createPost = async (photo: File, description: string) => {
    if (!auth.currentUser) {
        return;
    }

    const id = v4();
    const uid = auth.currentUser?.uid;

    const imageRef = ref(storage, `posts/${id}`);
    const snapshot = await uploadBytes(imageRef, photo);
    const photoUrl = await getDownloadURL(snapshot.ref);

    await setDoc(doc(db, 'posts', id), {
        userId: uid,
        photoUrl: photoUrl,
        description: description,
    });

    return id;
};

export const getPost = async (postId: string) => {
    const post = await getDoc(doc(db, 'posts', postId));

    return post.data() as IPost;
};
