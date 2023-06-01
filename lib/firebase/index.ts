import {
    signOut as FirebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import {
    collection,
    deleteDoc,
    doc,
    endAt,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    startAt,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { auth, db, storage } from '../../firebase';
import IComment from '../../types/Comment';
import IPost from '../../types/Post';
import IUser from '../../types/User';

export const signUp = async (username: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, 'users', user.uid), {
        username,
        photoUrl: '',
        bio: '',
    });
};

export const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
    await FirebaseSignOut(auth);
};

export const changePassword = async (newPassword: string) => {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
    }
};

export const updateUserPhoto = async (newPhoto: File) => {
    if (auth.currentUser) {
        const imageRef = ref(storage, `users/${auth.currentUser.uid}`);
        const snapshot = await uploadBytes(imageRef, newPhoto);
        const photoUrl = await getDownloadURL(snapshot.ref);

        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            photoUrl,
        });
    }
};

export const updateUserProfile = async (newUsername: string, newBio: string) => {
    if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            username: newUsername,
            bio: newBio,
        });
    }
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

export const deleteComment = async (commentId: string) => {
    await deleteDoc(doc(db, 'comments', commentId));
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

export const getUserPosts = async (userId: string) => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));

    const posts = await getDocs(q);

    const postIds: string[] = [];

    posts.forEach((post) => {
        postIds.push(post.id);
    });

    return postIds;
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

export const getFollowingPagePosts = async (loggedUserId: string | null, end: number, timestamp = 0) => {
    const postsRef = collection(db, 'posts');

    let q;

    if (timestamp) {
        q = query(postsRef, orderBy('timestamp', 'desc'), startAfter(timestamp));
    } else {
        q = query(postsRef, orderBy('timestamp', 'desc'));
    }

    const posts = await getDocs(q);

    const postsData: IPost[] = [];

    posts.forEach((post) => {
        const postData = post.data() as IPost;
        postData.id = post.id;
        postsData.push(postData);
    });

    const followsRef = collection(db, 'follows');

    const postIds: string[] = [];

    for (let i = 0; i < postsData.length; i++) {
        const q = query(
            followsRef,
            where('userId', '==', postsData[i].userId),
            where('followerId', '==', loggedUserId),
            where('status', '==', true)
        );
        const follows = await getDocs(q);

        if (follows.size > 0 || postsData[i].userId === loggedUserId) {
            postIds.push(postsData[i].id);

            if (postIds.length === end) {
                break;
            }
        }
    }

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

export const isPostLiked = async (loggedUserId: string | null, postId: string) => {
    if (loggedUserId) {
        const likesRef = collection(db, 'likes');
        const q = query(
            likesRef,
            where('postId', '==', postId),
            where('userId', '==', loggedUserId),
            where('status', '==', true)
        );

        const likes = await getDocs(q);

        return likes.size ? true : false;
    }

    return false;
};

export const getPostComments = async (loggedUserId: string | null, postId: string) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'desc'));

    const comments = await getDocs(q);

    const commentsData: IComment[] = [];

    comments.forEach((comment) => {
        const commentData = comment.data() as IComment;
        commentData.id = comment.id;

        if (loggedUserId === commentData.userId) {
            commentData.isRemovable = true;
        } else {
            commentData.isRemovable = false;
        }

        commentsData.push(commentData);
    });

    for (let i = 0; i < commentsData.length; i++) {
        const author = await getUser(loggedUserId, commentsData[i].userId, false, false);
        commentsData[i].author = author;
    }

    return commentsData;
};

export const getPost = async (
    loggedUserId: string | null,
    postId: string,
    withAuthor: boolean,
    withComments: boolean,
    withIsLiked: boolean
) => {
    const post = await getDoc(doc(db, 'posts', postId));

    const postData = post.data() as IPost;

    postData.id = postId;

    postData.stats = await getPostStats(postData.id);

    if (loggedUserId === postData.userId) {
        postData.isRemovable = true;
    } else {
        postData.isRemovable = false;
    }

    if (withAuthor) {
        postData.author = await getUser(loggedUserId, postData.userId, false, false);
    }

    if (withComments) {
        postData.comments = await getPostComments(loggedUserId, postData.id);
    }

    if (withIsLiked) {
        postData.isLiked = await isPostLiked(loggedUserId, postData.id);
    }

    return postData;
};

export const getUser = async (
    loggedUserId: string | null,
    userId: string,
    withStats: boolean,
    withIsFollowed: boolean
) => {
    const user = await getDoc(doc(db, 'users', userId));

    const userData = user.data() as IUser;

    userData.id = userId;

    if (loggedUserId !== userId) {
        userData.isFollowable = true;
    } else {
        userData.isFollowable = false;
    }

    if (withStats) {
        userData.stats = await getUserStats(userId);
    }

    if (withIsFollowed) {
        userData.isFollowed = await isUserFollowed(loggedUserId, userId);
    }

    return userData;
};

export const getUserStats = async (userId: string) => {
    const followersNumber = await getUserFollowers(userId);
    const followingNumber = await getUserFollowing(userId);

    return { followers: followersNumber, following: followingNumber };
};

export const getUserFollowers = async (userId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('userId', '==', userId), where('status', '==', true));

    const follows = await getDocs(q);

    return follows.size;
};

export const getUserFollowing = async (userId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('followerId', '==', userId), where('status', '==', true));

    const follows = await getDocs(q);

    return follows.size;
};

export const isUserFollowed = async (loggedUserId: string | null, userId: string) => {
    const followsRef = collection(db, 'follows');
    const q = query(
        followsRef,
        where('userId', '==', userId),
        where('followerId', '==', loggedUserId),
        where('status', '==', true)
    );

    const follows = await getDocs(q);

    return follows.size ? true : false;
};

export const search = async (text: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('username'), startAt(text), endAt(`${text}\uf8ff`), limit(3));

    const users = await getDocs(q);

    const usersData: IUser[] = [];

    users.forEach((user) => {
        const userData = user.data() as IUser;
        userData.id = user.id;
        usersData.push(userData);
    });

    return usersData;
};
