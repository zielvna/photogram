export default interface IUser {
    id: string;
    username: string;
    photoUrl: string;
    bio: string;
    isFollowable: boolean;
    stats?: {
        followers: number;
        following: number;
    };
    isFollowed?: boolean;
}
