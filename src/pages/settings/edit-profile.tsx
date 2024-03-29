import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { EditProfile } from '../../components/EditProfile';
import { PrivateRoute } from '../../components/PrivateRoute';
import { auth } from '../../firebaseAdmin';
import { getUser } from '../../lib/firebase';
import { IUser } from '../../types';

type Props = {
    user: IUser | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const cookies = nookies.get(context);

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
    <PrivateRoute>
        <Head>
            <title>Photogram - Settings (Edit Profile)</title>
        </Head>
        <div className="w-full max-w-2xl mt-4">
            <EditProfile user={user} />
        </div>
    </PrivateRoute>
);

export default EditProfilePage;
