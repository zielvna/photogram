import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiMoreLine } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';
import { useUserContext } from '../contexts/userContext';
import { useDropdown } from '../hooks/useDropdown';
import { createComment, deletePost, getPostComments, getPostLikesNumber, like } from '../lib/firebase';
import { commentZod } from '../lib/zod';
import { IPost } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { Dropdown } from './Dropdown';
import { Input } from './Input';
import { InputError } from './InputError';
import { PostActions } from './PostActions';
import { PostComment } from './PostComment';
import { PostDescription } from './PostDescription';

type Props = {
    post: IPost;
    scheme: 'normal' | 'preview';
};

export const Post = ({ post, scheme = 'normal' }: Props) => {
    const [error, setError] = useState('');
    const [postComments, setPostComments] = useState(post.comments ?? []);
    const [isPostLiked, setIsPostLiked] = useState(post.isLiked ?? false);
    const [postLikeCount, setPostLikeCount] = useState(post.stats?.likes ?? 0);
    const [postCommentCount, setPostCommentCount] = useState(post.stats?.comments ?? 0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUserContext();
    const router = useRouter();
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(dropdownRef);

    const schema = z.object({
        comment: commentZod,
    });

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<z.TypeOf<typeof schema>>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setIsPostLiked(post.isLiked ?? false);
    }, [post.isLiked]);

    const onSubmit = handleSubmit(async (data) => {
        if (user) {
            const { comment } = data;

            try {
                reset();
                await createComment(post.id, comment.trim());
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
            <div className={twMerge(index != 0 && 'mt-4')} key={comment.id}>
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
                    <Dropdown show={isDropdownOpen} items={['Remove']} onChange={handleChange} ref={dropdownRef} />
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
            <div className={twMerge(scheme === 'normal' && 'md:flex')}>
                <div className={twMerge('flex justify-between items-center', scheme === 'normal' && 'md:hidden')}>
                    {description}
                </div>
                <div onClick={photoClick} className={twMerge('mt-4 cursor-pointer', scheme === 'normal' && 'md:mt-0')}>
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
                                <Input type="text" placeholder="Add a comment..." {...register('comment')} />
                                <div className="ml-2">
                                    <Button scheme="small">Post</Button>
                                </div>
                            </div>
                            {errors.comment?.message && <InputError>{errors.comment.message}</InputError>}
                            <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                        </form>
                    </div>
                )}
                {scheme === 'preview' && <div className="mt-4">{actions}</div>}
            </div>
        </Card>
    );
};
