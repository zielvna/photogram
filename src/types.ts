export interface IUser {
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

export interface IComment {
    id: string;
    content: string;
    postId: string;
    timestamp: string;
    userId: string;
    author: IUser;
    isRemovable: boolean;
}

export interface IPost {
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
