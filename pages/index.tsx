/* eslint-disable no-empty */
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import nookies from 'nookies';

import { auth } from '../firebaseAdmin';
import Header from '../components/Header';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';
import IPost from '../types/Post';
import { getHomePagePosts, getPost } from '../functions';
import { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { RiLoader2Line } from 'react-icons/ri';

export const getServerSideProps: GetServerSideProps<{
    posts: IPost[];
}> = async (context) => {
    const cookies = nookies.get(context);
    let loggedUserId = null;

    if (cookies.token) {
        try {
            loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;
        } catch (error) {
            loggedUserId = null;
        }
    }

    const postIds = await getHomePagePosts(3);

    const posts: IPost[] = [];

    try {
        for (let i = 0; i < postIds.length; i++) {
            posts.push(await getPost(loggedUserId, postIds[i], true, false, true));
        }
    } catch (error) {
        posts.splice(0, posts.length);
    }

    return {
        props: {
            posts,
        },
    };
};

const HomePage = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const user = useUser();
    const [postsList, setPostsList] = useState(posts);
    const [message, setMessage] = useState('loading');

    useEffect(() => {
        if (postsList.length < 3) {
            setMessage('no more');
        }
    });

    useEffect(() => {
        const listener = async () => {
            if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight && user !== undefined) {
                const postIds = await getHomePagePosts(3, postsList[postsList.length - 1].timestamp);

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
            <Header />
            <Wrapper>
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
            </Wrapper>
        </>
    );
};

export default HomePage;
