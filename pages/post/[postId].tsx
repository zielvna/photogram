import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import IPost from '../../types/Post';
import IUser from '../../types/User';
import { getComments, getLikes, getPost, getUser } from '../../functions';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';
import IComment from '../../types/Comment';

export const getServerSideProps: GetServerSideProps<{
    post: IPost | null;
    author: IUser | null;
    comments: IComment[] | null;
    likeCount: number | null;
}> = async (context) => {
    const postId = context.params?.postId;

    const post = await getPost(postId as string);

    if (!post) {
        return {
            props: {
                post: null,
                author: null,
                comments: null,
                likeCount: null,
            },
        };
    }

    const author = await getUser(post.userId);
    const comments = await getComments(postId as string);
    const likeCount = await getLikes(postId as string);

    return {
        props: {
            post,
            author,
            comments,
            likeCount,
        },
    };
};

const PostPage = ({ post, author, comments, likeCount }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <>
        <Header />
        <Wrapper>
            <div className="mt-4">
                {post && author && comments !== null && likeCount !== null ? (
                    <Post post={post} author={author} comments={comments} likeCount={likeCount} scheme="normal" />
                ) : (
                    <p>Post not found.</p>
                )}
            </div>
        </Wrapper>
    </>
);

export default PostPage;
