import NextImage from 'next/future/image';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';

import { createComment, getComments, getLikes, isLiked, like } from '../../functions';
import useUser from '../../hooks/useUser';
import IPost from '../../types/Post';
import IUser from '../../types/User';
import Card from '../Card';
import PostDescription from './PostDescription';
import PostComment from './PostComment';
import PostActions from './PostActions';
import Input from '../Input';
import InputError from '../Input/InputError';
import Button from '../Button';
import IComment from '../../types/Comment';

type Props = {
    post: IPost;
    author: IUser;
    comments: IComment[];
    likeCount: number;
    scheme: 'normal' | 'preview';
};

const Post = ({ post, author, comments, likeCount, scheme = 'normal' }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm();
    const user = useUser();
    const [error, setError] = useState('');
    const [postComments, setPostComments] = useState(comments);
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [postLikeCount, setPostLikeCount] = useState(likeCount);

    const registerOptions = {
        comment: {
            required: 'Comment is empty.',
            maxLength: {
                value: 100,
                message: 'Comment is too long.',
            },
        },
    };

    const onSubmit = handleSubmit(async (data) => {
        const { comment } = data;

        try {
            reset();
            await createComment(post.id, comment);
            setPostComments(await getComments(post.id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    const generateComments = () => {
        return postComments.map((comment, index) => (
            <div className={classnames({ 'mt-4': index != 0 })} key={comment.id}>
                <PostComment user={comment.user} content={comment.content} timestamp={comment.timestamp} />
            </div>
        ));
    };

    const likeClick = async () => {
        try {
            await like(post.id, !isPostLiked);
            checkIfPostIsLiked();
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    };

    const commentClick = () => {
        setFocus('comment');
    };

    const checkIfPostIsLiked = async () => {
        const liked = await isLiked(post.id);
        setIsPostLiked(liked);
        const likeCount = await getLikes(post.id);
        setPostLikeCount(likeCount);
    };

    useEffect(() => {
        if (user) {
            checkIfPostIsLiked();
        }
    }, [user]);

    return (
        <Card>
            <div className={classnames({ 'md:flex': scheme === 'normal' })}>
                <div className={classnames({ 'md:hidden': scheme === 'normal' })}>
                    <PostDescription user={author} content={post.description} timestamp={post.timestamp} />
                </div>
                <div className={classnames('mt-4', { 'md:mt-0': scheme === 'normal' })}>
                    <NextImage className="rounded-lg" src={post.photoUrl} width="640" height="640" alt="Post image." />
                </div>
                {scheme === 'normal' && (
                    <div className="mt-4 flex flex-col justify-between shrink-0 md:w-80 md:mt-0 md:pl-4">
                        <div className="hidden md:block">
                            <PostDescription user={author} content={post.description} timestamp={post.timestamp} />
                            <hr className="text-light-gray my-4" />
                        </div>
                        <div className="grow overflow-y-scroll max-h-80 md:h-0 md:max-h-max">{generateComments()}</div>
                        <hr className="text-light-gray my-4" />
                        <PostActions
                            likes={postLikeCount}
                            comments={postComments.length}
                            isLiked={isPostLiked}
                            onLikeClick={likeClick}
                            onCommentClick={commentClick}
                        />
                        <hr className="text-light-gray my-4" />
                        <form onSubmit={onSubmit}>
                            <div className="flex items-center">
                                <Input
                                    name="comment"
                                    register={register}
                                    validation={registerOptions.comment}
                                    type="text"
                                    placeholder="Add a comment..."
                                    autoComplete="off"
                                />
                                <div className="ml-2">
                                    <Button scheme="small">Post</Button>
                                </div>
                            </div>
                            {errors.comment && errors.comment.message && (
                                <InputError>{errors.comment.message.toString()}</InputError>
                            )}
                            <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                        </form>
                    </div>
                )}
                {scheme === 'preview' && (
                    <div className="mt-4">
                        <PostActions
                            likes={postLikeCount}
                            isLiked={isPostLiked}
                            onLikeClick={likeClick}
                            comments={postComments.length}
                            onCommentClick={commentClick}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Post;
