import { FirebaseError } from 'firebase/app';
import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/userContext';
import { follow, getUserFollowers } from '../lib/firebase';
import { IPost, IUser } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { ProfilePost } from './ProfilePost';

type Props = {
    user: IUser;
    posts: IPost[];
};

export const Profile = ({ user, posts }: Props) => {
    const [isUserFollowed, setIsUserFollowed] = useState(user.isFollowed);
    const [userFollowerCount, setUserFollowerCount] = useState(user.stats?.followers);
    const [error, setError] = useState('');
    const authUser = useUserContext();
    const router = useRouter();

    useEffect(() => {
        setUserFollowerCount(user.stats?.followers);
    }, [user.stats]);

    const generatePosts = () => {
        return posts
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => <ProfilePost key={post.id} post={post} />);
    };

    const followClick = async () => {
        if (authUser) {
            try {
                await follow(user.id, !isUserFollowed);
                const followers = await getUserFollowers(user.id);

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
                    className="w-40 h-40 rounded-full object-cover sm:mx-8"
                    src={user.photoUrl ? user.photoUrl : '/160x160-empty.png'}
                    width="160"
                    height="160"
                    alt="User avatar."
                />
                <div className="mt-4 sm:mt-0 sm:ml-4">
                    <p className="text-2xl font-bold">{user.username}</p>
                    <div className="mt-4 flex">
                        <p className="text-center">
                            <span className="font-bold">{posts.length}</span> posts
                        </p>
                        <p className="ml-4 text-center">
                            <span className="font-bold">{userFollowerCount}</span> followers
                        </p>
                        <p className="ml-4 text-center">
                            <span className="font-bold">{user.stats?.following}</span> following
                        </p>
                    </div>
                    <p className="mt-4">{user.bio}</p>
                    <div className="w-32 mt-4">
                        {user.isFollowable && (
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
