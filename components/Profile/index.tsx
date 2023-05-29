import NextImage from 'next/future/image';
import { FirebaseError } from 'firebase/app';

import useUser from '../../hooks/useUser';
import { follow, getUserFollowers } from '../../functions';
import Card from '../Card';
import Button from '../Button';
import ProfilePost from './ProfilePost';
import IPost from '../../types/Post';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import IUser from '../../types/User';

type Props = {
    user: IUser;
    posts: IPost[];
};

const Profile = ({ user, posts }: Props) => {
    const authUser = useUser();
    const router = useRouter();
    const [isUserFollowed, setIsUserFollowed] = useState(user.isFollowed);
    const [userFollowerCount, setUserFollowerCount] = useState(user.stats?.followers);
    const [error, setError] = useState('');

    useEffect(() => {
        setUserFollowerCount(user.stats?.followers);
    }, [user.stats]);

    const generatePosts = () => {
        return posts
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => <ProfilePost key={post.id} id={post.id} photoUrl={post.photoUrl} />);
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
                    className="rounded-full sm:mx-8"
                    src="/160.png"
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
                    <p className="mt-4">profile description</p>
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

export default Profile;
