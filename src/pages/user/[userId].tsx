import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { Profile } from '../../components/Profile';
import { auth } from '../../firebaseAdmin';
import { getPost, getUser, getUserPosts } from '../../lib/firebase';
import { IPost, IUser } from '../../types';

type Props = {
    user: IUser | null;
    posts: IPost[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const cookies = nookies.get(context);
    let loggedUserId = null;

    if (cookies.token) {
        try {
            loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;
        } catch (error) {
            loggedUserId = null;
        }
    }

    const userId = context.params?.userId as string;

    let user = null;

    let postIds: string[] = [];

    try {
        user = await getUser(loggedUserId, userId, true, true);

        postIds = await getUserPosts(userId);
    } catch (error) {
        user = null;
    }

    const posts: IPost[] = [];

    try {
        for (let i = 0; i < postIds.length; i++) {
            posts.push(await getPost(loggedUserId, postIds[i], true, false, true));
        }
    } catch (error) {
        posts.splice(0, posts.length);
    }

    return {
        props: {
            user,
            posts,
        },
    };
};

const ProfilePage: NextPage<Props> = ({ user, posts }) => (
    <>
        <Head>
            <title>Photogram - User ({user?.username})</title>
        </Head>
        <div className="w-full mt-4">
            {user ? <Profile user={user} posts={posts} /> : <p className="flex justify-center">User not found.</p>}
        </div>
    </>
);

export default ProfilePage;
