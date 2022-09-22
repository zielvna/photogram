import NextImage from 'next/future/image';
import { RiHeart3Fill, RiChat3Fill } from 'react-icons/ri';

const ProfilePost = () => (
    <div className="relative group cursor-pointer">
        <div className="bg-black/50 text-white rounded-lg items-center justify-center absolute inset-0 hidden group-hover:flex">
            <RiHeart3Fill className="text-3xl text-white" />
            <p className="ml-1">0</p>
            <RiChat3Fill className="ml-4 text-3xl text-white" />
            <p className="ml-1">0</p>
        </div>
        <NextImage className="w-full h-full rounded-lg" src="/640.png" width="640" height="640" alt="Post image." />
    </div>
);

export default ProfilePost;
