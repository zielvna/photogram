import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { Post } from '../../components/Post';
import { auth } from '../../firebaseAdmin';
import { getPost } from '../../lib/firebase';
import { IPost } from '../../types';

type Props = {
    post: IPost | null;
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

    const postId = context.params?.postId as string;
    let post = null;

    try {
        post = await getPost(loggedUserId, postId, true, true, true);
    } catch (error) {
        post = null;
    }

    return {
        props: {
            post,
        },
    };
};

const PostPage: NextPage<Props> = ({ post }) => (
    <>
        <Head>
            <title>Photogram - Post {post?.description ? `(${post.description})` : 'not found'}</title>
        </Head>
        <div className="mt-4">{post ? <Post post={post} scheme="normal" /> : <p>Post not found.</p>}</div>
    </>
);

export default PostPage;
