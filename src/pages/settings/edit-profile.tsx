import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { EditProfile } from '../../components/EditProfile';
import { Header } from '../../components/Header';
import { Progress } from '../../components/Progress';
import { Wrapper } from '../../components/Wrapper';
import { auth } from '../../firebaseAdmin';
import { getUser } from '../../lib/firebase';
import { IUser } from '../../types';

type Props = {
    user: IUser | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    let loggedUserId = null;

    try {
        loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;
    } catch (error) {
        loggedUserId = null;
    }

    let user = null;

    if (loggedUserId) {
        user = await getUser(loggedUserId, loggedUserId, true, true);
    }

    return {
        props: {
            user: user,
        },
    };
};

const EditProfilePage: NextPage<Props> = ({ user }) => (
    <>
        <Progress />
        <Header />
        <Wrapper>
            <div className="w-full max-w-2xl mt-4">
                <EditProfile user={user} />
            </div>
        </Wrapper>
    </>
);

export default EditProfilePage;
