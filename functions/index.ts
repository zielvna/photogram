import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, getDoc, doc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

import IPost from '../types/Post';
import IUser from '../types/User';
import IComment from '../types/Comment';

export const signUp = async (username: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, 'users', user.uid), {
        username,
    });
};

export const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const getUser = async (userId: string) => {
    const user = await getDoc(doc(db, 'users', userId));

    const userData = user.data();

    if (userData) {
        userData.id = userId;
    }

    return userData as IUser;
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
        timestamp: Date.now(),
    });

    return id;
};

export const getPost = async (postId: string) => {
    const post = await getDoc(doc(db, 'posts', postId));

    const postData = post.data();

    if (postData) {
        postData.id = postId;
    }

    return postData as IPost;
};

export const createComment = async (postId: string, content: string) => {
    if (!auth.currentUser) {
        return;
    }

    const id = v4();
    const uid = auth.currentUser?.uid;

    await setDoc(doc(db, 'comments', id), {
        postId,
        userId: uid,
        content,
        timestamp: Date.now(),
    });
};

export const getComments = async (postId: string) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'desc'));

    const comments = await getDocs(q);

    const commentsData: IComment[] = [];

    comments.forEach(async (comment) => {
        const commentData = comment.data();
        commentData.id = comment.id;
        commentsData.push(commentData as IComment);
    });

    for (let i = 0; i < commentsData.length; i++) {
        const user = await getUser(commentsData[i].userId);
        commentsData[i].user = user;
    }

    return commentsData;
};
