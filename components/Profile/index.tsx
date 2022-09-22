import NextImage from 'next/future/image';

import Card from '../Card';
import Button from '../Button';
import ProfilePost from './ProfilePost';

const Profile = () => (
    <Card>
        <div className="flex flex-col sm:flex-row">
            <NextImage className="rounded-full sm:mx-8" src="/160.png" width="160" height="160" alt="User avatar." />
            <div className="mt-4 sm:mt-0 sm:ml-4">
                <p className="text-2xl font-bold">user</p>
                <div className="mt-4 flex">
                    <p className="text-center">
                        <span className="font-bold">10</span> posts
                    </p>
                    <p className="ml-4 text-center">
                        <span className="font-bold">10</span> followers
                    </p>
                    <p className="ml-4 text-center">
                        <span className="font-bold">10</span> following
                    </p>
                </div>
                <p className="mt-4">profile description</p>
                <div className="max-w-32 mt-4">
                    <Button>Follow</Button>
                </div>
            </div>
        </div>
        <hr className="text-light-gray my-4" />
        <div className="grid gap-4 sm:grid-cols-posts">
            <ProfilePost />
            <ProfilePost />
            <ProfilePost />
        </div>
    </Card>
);

export default Profile;
