import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { Home } from '../components/Home';
import { auth } from '../firebaseAdmin';
import { getHomePagePosts, getPost } from '../lib/firebase';
import { IPost } from '../types';

type Props = {
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

    const postIds = await getHomePagePosts(3);

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

const HomePage: NextPage<Props> = ({ posts }) => (
    <>
        <Head>
            <title>Photogram - Home</title>
        </Head>
        <Home posts={posts} />
    </>
);

export default HomePage;
