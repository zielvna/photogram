import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {
    setDoc,
    getDoc,
    doc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    updateDoc,
    deleteDoc,
    limit,
    startAfter,
} from 'firebase/firestore';
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

export const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
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

export const like = async (postId: string, status: boolean) => {
    const uid = auth.currentUser?.uid;

    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('postId', '==', postId), where('userId', '==', uid));

    const likes = await getDocs(q);

    let likeId = null;

    likes.forEach(async (like) => {
        likeId = like.id;
    });

    if (likeId) {
        await updateDoc(doc(db, 'likes', likeId), {
            status,
        });
    } else {
        const id = v4();

        await setDoc(doc(db, 'likes', id), {
            postId,
            userId: uid,
            status,
        });
    }
};

export const getUserStats = async (userId: string) => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));

    const posts = await getDocs(q);

    const postsData: IPost[] = [];

    posts.forEach(async (post) => {
        const postData = post.data();
        postData.id = post.id;
        postsData.push(postData as IPost);
    });

    return { posts: postsData, postCount: posts.size };
};

export const deleteComment = async (commentId: string) => {
    await deleteDoc(doc(db, 'comments', commentId));
};

export const follow = async (userId: string, status: boolean) => {
    const uid = auth.currentUser?.uid;

    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('userId', '==', userId), where('followerId', '==', uid));

    const follows = await getDocs(q);

    let followId = null;

    follows.forEach(async (follow) => {
        followId = follow.id;
    });

    if (followId) {
        await updateDoc(doc(db, 'follows', followId), {
            status,
        });
    } else {
        const id = v4();

        await setDoc(doc(db, 'follows', id), {
            userId,
            followerId: uid,
            status,
        });
    }
};

export const isFollowed = async (userId: string, followerId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(
        followsRef,
        where('userId', '==', userId),
        where('followerId', '==', followerId),
        where('status', '==', true)
    );

    const follows = await getDocs(q);

    return follows.size ? true : false;
};

export const getFollowers = async (userId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('userId', '==', userId), where('status', '==', true));

    const follows = await getDocs(q);

    return follows.size;
};

export const getFollows = async (userId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('followerId', '==', userId), where('status', '==', true));

    const follows = await getDocs(q);

    return follows.size;
};

export const getHomePagePosts = async (end: number, timestamp = 0) => {
    const postsRef = collection(db, 'posts');

    let q;

    if (timestamp) {
        q = query(postsRef, orderBy('timestamp', 'desc'), startAfter(timestamp), limit(end));
    } else {
        q = query(postsRef, orderBy('timestamp', 'desc'), limit(end));
    }

    const posts = await getDocs(q);

    const postIds: string[] = [];

    posts.forEach((post) => {
        postIds.push(post.id);
    });

    return postIds;
};

export const getPostLikesNumber = async (postId: string) => {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('postId', '==', postId), where('status', '==', true));

    const likes = await getDocs(q);

    return likes.size;
};

export const getPostCommentsNumber = async (postId: string) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId));

    const comments = await getDocs(q);

    return comments.size;
};

export const getPostStats = async (postId: string) => {
    const likesNumber = await getPostLikesNumber(postId);
    const commentsNumber = await getPostCommentsNumber(postId);

    return { likes: likesNumber, comments: commentsNumber };
};

export const isPostLiked = async (userId: string | null, postId: string) => {
    if (userId) {
        const likesRef = collection(db, 'likes');
        const q = query(
            likesRef,
            where('postId', '==', postId),
            where('userId', '==', userId),
            where('status', '==', true)
        );

        const likes = await getDocs(q);

        return likes.size ? true : false;
    }

    return false;
};

export const getPostComments = async (userId: string | null, postId: string) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'desc'));

    const comments = await getDocs(q);

    const commentsData: IComment[] = [];

    comments.forEach((comment) => {
        const commentData = comment.data() as IComment;
        commentData.id = comment.id;

        if (userId === commentData.userId) {
            commentData.isRemovable = true;
        } else {
            commentData.isRemovable = false;
        }

        commentsData.push(commentData);
    });

    for (let i = 0; i < commentsData.length; i++) {
        const author = await getUser(commentsData[i].userId);
        commentsData[i].author = author;
    }

    return commentsData;
};

export const getPost = async (
    userId: string | null,
    postId: string,
    withAuthor: boolean,
    withComments: boolean,
    withIsLiked: boolean
) => {
    const post = await getDoc(doc(db, 'posts', postId));

    const postData = post.data() as IPost;

    postData.id = postId;

    postData.stats = await getPostStats(postData.id);

    if (userId === postData.userId) {
        postData.isRemovable = true;
    } else {
        postData.isRemovable = false;
    }

    if (withAuthor) {
        postData.author = await getUser(postData.userId);
    }

    if (withComments) {
        postData.comments = await getPostComments(userId, postData.id);
    }

    if (withIsLiked) {
        postData.isLiked = await isPostLiked(userId, postData.id);
    }

    return postData;
};
