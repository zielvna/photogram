import { useEffect, useState } from 'react';
import { RiLoader2Line } from 'react-icons/ri';
import { useUserContext } from '../contexts/userContext';
import { getFollowingPagePosts, getPost } from '../lib/firebase';
import { IPost } from '../types';
import { Post } from './Post';

type Props = {
    posts: IPost[];
};

export const Following = ({ posts }: Props) => {
    const [postsList, setPostsList] = useState(posts);
    const [message, setMessage] = useState('loading');
    const { user } = useUserContext();

    useEffect(() => {
        if (postsList.length < 3) {
            setMessage('no more');
        }
    });

    useEffect(() => {
        const listener = async () => {
            if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight && user !== undefined) {
                const postIds = await getFollowingPagePosts(
                    user?.uid ?? null,
                    3,
                    postsList[postsList.length - 1].timestamp
                );

                const newPosts: IPost[] = [];

                for (let i = 0; i < postIds.length; i++) {
                    const post = await getPost(user?.uid ?? null, postIds[i], true, false, true);
                    newPosts.push(post);
                }

                setPostsList([...postsList, ...newPosts]);

                if (postIds.length < 3) {
                    setMessage('No more posts!');
                }
            }
        };

        window.addEventListener('scroll', listener);

        return () => removeEventListener('scroll', listener);
    }, [user, postsList]);

    return (
        <>
            {postsList.map((post) => (
                <div key={post.id} className="mt-4">
                    <Post post={post} scheme="preview" />
                </div>
            ))}
            <div className="my-4 flex justify-center">
                {message === 'loading' ? (
                    <RiLoader2Line className="text-gray text-3xl animate-spin" />
                ) : (
                    'No more posts.'
                )}
            </div>
        </>
    );
};
