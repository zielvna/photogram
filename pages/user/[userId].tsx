import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import Header from '../../components/Header';
import Profile from '../../components/Profile';
import Progress from '../../components/Progress';
import Wrapper from '../../components/Wrapper';
import { auth } from '../../firebaseAdmin';
import { getPost, getUser, getUserPosts } from '../../lib/firebase';
import IPost from '../../types/Post';
import IUser from '../../types/User';

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

const ProfilePage: NextPage<Props> = ({ user, posts }) => (
    <>
        <Progress />
        <Header />
        <Wrapper>
            <div className="w-full mt-4">{user && <Profile user={user} posts={posts} />}</div>
        </Wrapper>
    </>
);

export default ProfilePage;
