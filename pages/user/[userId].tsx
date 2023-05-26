import type { GetServerSideProps, NextPage } from 'next';

import IUser from '../../types/User';
import IPost from '../../types/Post';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Profile from '../../components/Profile';
import { getUser, getUserStats } from '../../functions';

type Props = {
    user: IUser | null;
    posts: IPost[] | null;
    postCount: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const userId = context.params?.userId;

    const user = await getUser(userId as string);

    const { posts, postCount } = await getUserStats(userId as string);

    console.log(posts);

    return {
        props: {
            user,
            posts,
            postCount,
        },
    };
};

const ProfilePage: NextPage<Props> = ({ user, posts, postCount }) => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="w-full mt-4">
                    {user && (
                        <Profile
                            username={user.username}
                            postCount={postCount}
                            followerCount={0}
                            followingCount={0}
                            posts={posts}
                        />
                    )}
                </div>
            </Wrapper>
        </>
    );
};

export default ProfilePage;
