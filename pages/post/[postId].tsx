import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import nookies from 'nookies';

import { auth } from '../../firebaseAdmin';
import IPost from '../../types/Post';
import { getPost } from '../../lib/firebase';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';
import Progress from '../../components/Progress';

export const getServerSideProps: GetServerSideProps<{
    post: IPost | null;
}> = async (context) => {
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

const PostPage = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <>
        <Progress />
        <Header />
        <Wrapper>
            <div className="mt-4">{post ? <Post post={post} scheme="normal" /> : <p>Post not found.</p>}</div>
        </Wrapper>
    </>
);

export default PostPage;
