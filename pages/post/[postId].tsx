import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import nookies from 'nookies';

import { auth } from '../../firebaseAdmin';
import IPost from '../../types/Post';
import IUser from '../../types/User';
import { getComments, getLikes, getPost, getUser, isLiked } from '../../functions';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';
import IComment from '../../types/Comment';

export const getServerSideProps: GetServerSideProps<{
    userId: string | null;
    post: IPost | null;
    author: IUser | null;
    comments: IComment[] | null;
    likeCount: number | null;
    isPostLiked: boolean | null;
}> = async (context) => {
    const postId = context.params?.postId;

    const post = await getPost(postId as string);

    if (!post) {
        return {
            props: {
                userId: null,
                post: null,
                author: null,
                comments: null,
                likeCount: null,
                isLiked: null,
                isPostLiked: null,
            },
        };
    }

    const author = await getUser(post.userId);
    const comments = await getComments(postId as string);
    const likeCount = await getLikes(postId as string);

    const cookies = nookies.get(context);

    let isPostLiked = false;

    let userId = null;

    if (cookies.token) {
        userId = (await auth.verifyIdToken(cookies.token)).uid;

        isPostLiked = await isLiked(userId, postId as string);
    }

    return {
        props: {
            userId,
            post,
            author,
            comments,
            likeCount,
            isPostLiked,
        },
    };
};

const PostPage = ({
    userId,
    post,
    author,
    comments,
    likeCount,
    isPostLiked,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <>
        <Header />
        <Wrapper>
            <div className="mt-4">
                {post && author && comments !== null && likeCount !== null && isPostLiked !== null ? (
                    <Post
                        userId={userId}
                        post={post}
                        author={author}
                        comments={comments}
                        likeCount={likeCount}
                        isLiked={isPostLiked}
                        scheme="normal"
                    />
                ) : (
                    <p>Post not found.</p>
                )}
            </div>
        </Wrapper>
    </>
);

export default PostPage;
