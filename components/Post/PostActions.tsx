import { RiHeart3Line, RiChat3Line } from 'react-icons/ri';

const PostActions = () => (
    <div className="flex items-center">
        <RiHeart3Line className="text-3xl text-black cursor-pointer" />
        <p className="ml-1">0</p>
        <RiChat3Line className="ml-4 text-3xl text-black cursor-pointer" />
        <p className="ml-1">0</p>
    </div>
);

export default PostActions;
