import IComment from './Comment';
import IUser from './User';

export default interface IPost {
    id: string;
    description: string;
    photoUrl: string;
    timestamp: number;
    userId: string;
    stats: {
        likes: number;
        comments: number;
    };
    isRemovable: boolean;
    author?: IUser;
    comments?: IComment[];
    isLiked?: boolean;
}
