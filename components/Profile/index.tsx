import NextImage from 'next/future/image';

import Card from '../Card';
import Button from '../Button';
import ProfilePost from './ProfilePost';
import IPost from '../../types/Post';

type Props = {
    username: string;
    posts: IPost[] | null;
    postCount: number;
    followerCount: number;
    followingCount: number;
};

const Profile = ({ username, posts, postCount, followerCount, followingCount }: Props) => {
    const generatePosts = () => {
        return posts
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => <ProfilePost key={post.id} id={post.id} photoUrl={post.photoUrl} />);
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
                            <span className="font-bold">{followerCount}</span> followers
                        </p>
                        <p className="ml-4 text-center">
                            <span className="font-bold">{followingCount}</span> following
                        </p>
                    </div>
                    <p className="mt-4">profile description</p>
                    <div className="w-32 mt-4">
                        <Button>Follow</Button>
                    </div>
                </div>
            </div>
            <hr className="text-light-gray my-4" />
            <div className="grid gap-4 sm:grid-cols-posts">{generatePosts()}</div>
        </Card>
    );
};

export default Profile;
