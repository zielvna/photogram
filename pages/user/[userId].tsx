import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { auth } from '../../firebaseAdmin';
import IUser from '../../types/User';
import IPost from '../../types/Post';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Profile from '../../components/Profile';
import { getFollowers, getFollows, getUser, getUserStats, isFollowed } from '../../functions';

type Props = {
    loggedUserId: string | null;
    user: IUser | null;
    posts: IPost[] | null;
    postCount: number;
    isUserFollowed: boolean;
    followerCount: number;
    followingCount: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const userId = context.params?.userId;

    const user = await getUser(userId as string);

    const { posts, postCount } = await getUserStats(userId as string);

    console.log(posts);

    const cookies = nookies.get(context);

    let isUserFollowed = false;

    let loggedUserId = null;

    if (cookies.token) {
        loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;

        isUserFollowed = await isFollowed(user.id, loggedUserId);
    }

    const followerCount = await getFollowers(user.id);
    const followingCount = await getFollows(user.id);

    return {
        props: {
            loggedUserId: loggedUserId,
            user,
            posts,
            postCount,
            isUserFollowed,
            followerCount,
            followingCount,
        },
    };
};

const ProfilePage: NextPage<Props> = ({
    loggedUserId,
    user,
    posts,
    postCount,
    isUserFollowed,
    followerCount,
    followingCount,
}) => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="w-full mt-4">
                    {user && (
                        <Profile
                            loggedUserId={loggedUserId}
                            id={user.id}
                            username={user.username}
                            postCount={postCount}
                            followerCount={followerCount}
                            followingCount={followingCount}
                            posts={posts}
                            isFollowed={isUserFollowed}
                        />
                    )}
                </div>
            </Wrapper>
        </>
    );
};

export default ProfilePage;
