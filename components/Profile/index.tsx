import NextImage from 'next/future/image';
import { FirebaseError } from 'firebase/app';

import useUser from '../../hooks/useUser';
import { follow, getFollowers } from '../../functions';
import Card from '../Card';
import Button from '../Button';
import ProfilePost from './ProfilePost';
import IPost from '../../types/Post';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Props = {
    loggedUserId: string | null;
    id: string;
    username: string;
    posts: IPost[] | null;
    postCount: number;
    followerCount: number;
    followingCount: number;
    isFollowed: boolean;
};

const Profile = ({
    loggedUserId,
    id,
    username,
    posts,
    postCount,
    followerCount,
    followingCount,
    isFollowed,
}: Props) => {
    const user = useUser();
    const router = useRouter();
    const [isUserFollowed, setIsUserFollowed] = useState(isFollowed);
    const [userFollowerCount, setUserFollowerCount] = useState(followerCount);
    const [error, setError] = useState('');

    const generatePosts = () => {
        return posts
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => <ProfilePost key={post.id} id={post.id} photoUrl={post.photoUrl} />);
    };

    const followClick = async () => {
        if (user) {
            try {
                await follow(id, !isUserFollowed);
                const followers = await getFollowers(id);
                setIsUserFollowed(!isUserFollowed);
                setUserFollowerCount(followers);
            } catch (error) {
                if (error instanceof FirebaseError) {
                    setError(error.message);
                }
            }
        } else {
            router.push('/login');
        }
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row">
                <NextImage
                    className="rounded-full sm:mx-8"
                    src="/160.png"
                    width="160"
                    height="160"
                    alt="User avatar."
                />
                <div className="mt-4 sm:mt-0 sm:ml-4">
                    <p className="text-2xl font-bold">{username}</p>
                    <div className="mt-4 flex">
                        <p className="text-center">
                            <span className="font-bold">{postCount}</span> posts
                        </p>
                        <p className="ml-4 text-center">
                            <span className="font-bold">{userFollowerCount}</span> followers
                        </p>
                        <p className="ml-4 text-center">
                            <span className="font-bold">{followingCount}</span> following
                        </p>
                    </div>
                    <p className="mt-4">profile description</p>
                    <div className="w-32 mt-4">
                        {loggedUserId !== id && (
                            <Button scheme={isUserFollowed ? 'inverse' : 'normal'} onClick={followClick}>
                                {isUserFollowed ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                    </div>
                </div>
            </div>
            <hr className="text-light-gray my-4" />
            <div className="grid gap-4 sm:grid-cols-posts">{generatePosts()}</div>
        </Card>
    );
};

export default Profile;
