import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import Header from '../../components/Header';
import Post from '../../components/Post';
import Progress from '../../components/Progress';
import Wrapper from '../../components/Wrapper';
import { auth } from '../../firebaseAdmin';
import { getPost } from '../../lib/firebase';
import IPost from '../../types/Post';

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
        <Progress />
        <Header />
        <Wrapper>
            <div className="mt-4">{post ? <Post post={post} scheme="normal" /> : <p>Post not found.</p>}</div>
        </Wrapper>
    </>
);

export default PostPage;
