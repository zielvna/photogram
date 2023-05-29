export default interface IUser {
    id: string;
    username: string;
    isFollowable: boolean;
    stats?: {
        followers: number;
        following: number;
    };
    isFollowed?: boolean;
}
