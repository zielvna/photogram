import type { NextPage } from 'next';

import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Profile from '../../components/Profile';

const ProfilePage: NextPage = () => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="w-full mt-4">
                    <Profile />
                </div>
            </Wrapper>
        </>
    );
};

export default ProfilePage;
