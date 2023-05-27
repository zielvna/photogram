import IUser from './User';

export default interface IComment {
    id: string;
    content: string;
    postId: string;
    timestamp: string;
    userId: string;
    author: IUser;
    isRemovable: boolean;
}
