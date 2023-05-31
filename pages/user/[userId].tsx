import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { auth } from '../../firebaseAdmin';
import IUser from '../../types/User';
import IPost from '../../types/Post';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Profile from '../../components/Profile';
import { getPost, getUser, getUserPosts } from '../../functions';
import Progress from '../../components/Progress';

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

    const user = await getUser(loggedUserId, userId, true, true);

    const postIds = await getUserPosts(userId);

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

const ProfilePage: NextPage<Props> = ({ user, posts }) => {
    return (
        <>
            <Progress />
            <Header />
            <Wrapper>
                <div className="w-full mt-4">{user && <Profile user={user} posts={posts} />}</div>
            </Wrapper>
        </>
    );
};

export default ProfilePage;
