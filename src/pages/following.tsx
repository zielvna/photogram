import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { Following } from '../components/Following';
import { Header } from '../components/Header';
import { PrivateRoute } from '../components/PrivateRoute';
import { Progress } from '../components/Progress';
import { Wrapper } from '../components/Wrapper';
import { auth } from '../firebaseAdmin';
import { getFollowingPagePosts, getPost } from '../lib/firebase';
import { IPost } from '../types';

type Props = {
    posts: IPost[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const cookies = nookies.get(context);

    let loggedUserId = null;

    try {
        loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;
    } catch (error) {
        loggedUserId = null;
    }

    const postIds = await getFollowingPagePosts(loggedUserId, 3);

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
            posts,
        },
    };
};

const FollowingPage: NextPage<Props> = ({ posts }) => (
    <PrivateRoute>
        <Progress />
        <Header />
        <Wrapper>
            <Following posts={posts} />
        </Wrapper>
    </PrivateRoute>
);

export default FollowingPage;
