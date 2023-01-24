import { RiHeart3Line, RiHeart3Fill, RiChat3Line } from 'react-icons/ri';

type Props = {
    likes: number;
    comments: number;
    isLiked: boolean;
    onLikeClick: () => void;
    onCommentClick: () => void;
};

const PostActions = ({ likes, comments, isLiked, onLikeClick, onCommentClick }: Props) => (
    <div className="flex items-center">
        {isLiked ? (
            <RiHeart3Fill className="text-3xl text-red-500 cursor-pointer" onClick={onLikeClick} />
        ) : (
            <RiHeart3Line className="text-3xl text-black cursor-pointer" onClick={onLikeClick} />
        )}
        <p className="ml-1">{likes}</p>
        <RiChat3Line className="ml-4 text-3xl text-black cursor-pointer" onClick={onCommentClick} />
        <p className="ml-1">{comments}</p>
    </div>
);

export default PostActions;
