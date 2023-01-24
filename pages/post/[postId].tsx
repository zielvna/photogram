import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import IPost from '../../types/Post';
import IUser from '../../types/User';
import { getPost, getUser } from '../../functions';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';

export const getServerSideProps: GetServerSideProps<{ post: IPost; author: IUser }> = async (context) => {
    const postId = context.params?.postId;

    const post = await getPost(postId as string);

    const author = await getUser(post.userId);

    return {
        props: {
            post,
            author,
        },
    };
};

const PostPage = ({ post, author }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <>
        <Header />
        <Wrapper>
            <div className="mt-4">
                {post ? <Post post={post} author={author} scheme="normal" /> : <p>Post not found.</p>}
            </div>
        </Wrapper>
    </>
);

export default PostPage;
