import IUser from './User';

export default interface IComment {
    id: string;
    postId: string;
    userId: string;
    user: IUser;
    content: string;
    timestamp: string;
}
