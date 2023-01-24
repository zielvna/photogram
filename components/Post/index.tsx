import NextImage from 'next/future/image';
import { useState } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';

import { createComment, getComments } from '../../functions';
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
    scheme: 'normal' | 'preview';
};

const Post = ({ post, author, comments, scheme = 'normal' }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState('');
    const [postComments, setPostComments] = useState(comments);

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
                        <PostActions />
                        <hr className="text-light-gray my-4" />
                        <form onSubmit={onSubmit}>
                            <div className="flex items-center">
                                <Input
                                    name="comment"
                                    register={register}
                                    validation={registerOptions.comment}
                                    placeholder="Add a comment..."
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
                        <PostActions />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Post;
