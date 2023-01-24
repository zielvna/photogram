import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import IPost from '../../types/Post';
import IUser from '../../types/User';
import { getComments, getPost, getUser } from '../../functions';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';
import IComment from '../../types/Comment';

export const getServerSideProps: GetServerSideProps<{ post: IPost; author: IUser; comments: IComment[] }> = async (
    context
) => {
    const postId = context.params?.postId;

    const post = await getPost(postId as string);

    const author = await getUser(post.userId);

    const comments = await getComments(postId as string);

    return {
        props: {
            post,
            author,
            comments,
        },
    };
};

const PostPage = ({ post, author, comments }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <>
        <Header />
        <Wrapper>
            <div className="mt-4">
                {post ? (
                    <Post post={post} author={author} comments={comments} scheme="normal" />
                ) : (
                    <p>Post not found.</p>
                )}
            </div>
        </Wrapper>
    </>
);

export default PostPage;
