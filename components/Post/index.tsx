import classnames from 'classnames';
import { FirebaseError } from 'firebase/app';
import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiMoreLine } from 'react-icons/ri';
import useDropdown from '../../hooks/useDropdown';
import useUser from '../../hooks/useUser';
import { createComment, deletePost, getPostComments, getPostLikesNumber, like } from '../../lib/firebase';
import IPost from '../../types/Post';
import Button from '../Button';
import Card from '../Card';
import Dropdown from '../Dropdown';
import Input from '../Input';
import InputError from '../Input/InputError';
import PostActions from './PostActions';
import PostComment from './PostComment';
import PostDescription from './PostDescription';

type Props = {
    post: IPost;
    scheme: 'normal' | 'preview';
};

const Post = ({ post, scheme = 'normal' }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm();
    const user = useUser();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(dropdownRef);
    const [error, setError] = useState('');
    const [postComments, setPostComments] = useState(post.comments ?? []);
    const [isPostLiked, setIsPostLiked] = useState(post.isLiked ?? false);
    const [postLikeCount, setPostLikeCount] = useState(post.stats?.likes ?? 0);
    const [postCommentCount, setPostCommentCount] = useState(post.stats?.comments ?? 0);

    useEffect(() => {
        setIsPostLiked(post.isLiked ?? false);
    }, [post.isLiked]);

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
        if (user) {
            const { comment } = data;

            try {
                reset();
                await createComment(post.id, comment);
                setPostComments(await getPostComments(user.uid, post.id));
                setPostCommentCount(postComments.length + 1);
            } catch (error) {
                if (error instanceof FirebaseError) {
                    setError(error.message);
                }
            }
        } else {
            router.push('/login');
        }
    });

    const commentRemoved = async () => {
        setPostComments(await getPostComments(user?.uid ?? null, post.id));
        setPostCommentCount(postComments.length - 1);
    };

    const generateComments = () => {
        return postComments.map((comment, index) => (
            <div className={classnames({ 'mt-4': index != 0 })} key={comment.id}>
                <PostComment
                    id={comment.id}
                    user={comment.author}
                    content={comment.content}
                    timestamp={comment.timestamp}
                    addRemoveButton={comment.isRemovable}
                    commentRemoved={commentRemoved}
                />
            </div>
        ));
    };

    const likeClick = async () => {
        if (user) {
            try {
                await like(post.id, !isPostLiked);
                const postLikesNumber = await getPostLikesNumber(post.id);

                setIsPostLiked(!isPostLiked);
                setPostLikeCount(postLikesNumber);
            } catch (error) {
                if (error instanceof FirebaseError) {
                    setError(error.message);
                }
            }
        } else {
            router.push('/login');
        }
    };

    const commentClick = () => {
        if (user) {
            if (scheme === 'preview') {
                router.push(`/post/${post.id}`);
            } else {
                setFocus('comment');
            }
        } else {
            router.push('/login');
        }
    };

    async function handleChange(name: string) {
        switch (name) {
            case 'Remove':
                await deletePost(post.id);
                router.push('/');
        }

        closeDropdown();
    }

    function photoClick() {
        if (scheme === 'preview') {
            router.push(`/post/${post.id}`);
        }
    }

    const description = post.author ? (
        <>
            <PostDescription user={post.author} content={post.description} timestamp={post.timestamp} />
            {post.isRemovable && scheme === 'normal' && (
                <div className="md:relative">
                    <RiMoreLine className="text-3xl text-black cursor-pointer" onClick={openDropdown} />
                    <Dropdown show={isDropdownOpen} items={['Remove']} onChange={handleChange} passRef={dropdownRef} />
                </div>
            )}
        </>
    ) : (
        <></>
    );

    const actions = (
        <PostActions
            likes={postLikeCount}
            isLiked={isPostLiked}
            onLikeClick={likeClick}
            comments={postCommentCount}
            onCommentClick={commentClick}
        />
    );

    return (
        <Card>
            <div className={classnames({ 'md:flex': scheme === 'normal' })}>
                <div className={classnames('flex justify-between items-center', { 'md:hidden': scheme === 'normal' })}>
                    {description}
                </div>
                <div
                    onClick={photoClick}
                    className={classnames('mt-4 cursor-pointer', { 'md:mt-0': scheme === 'normal' })}
                >
                    <NextImage className="rounded-lg" src={post.photoUrl} width="640" height="640" alt="Post image." />
                </div>
                {scheme === 'normal' && (
                    <div className="mt-4 flex flex-col justify-between shrink-0 md:w-80 md:mt-0 md:pl-4">
                        <div className="hidden md:block">
                            <div className="flex justify-between items-center">{description}</div>
                            <hr className="text-light-gray my-4" />
                        </div>
                        <div className="grow overflow-y-scroll max-h-80 md:h-0 md:max-h-max">{generateComments()}</div>
                        <hr className="text-light-gray my-4" />
                        {actions}
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
                {scheme === 'preview' && <div className="mt-4">{actions}</div>}
            </div>
        </Card>
    );
};

export default Post;
