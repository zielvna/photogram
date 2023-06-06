import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangePassword } from '../../components/ChangePassword';
import { PrivateRoute } from '../../components/PrivateRoute';

const ChangePasswordPage: NextPage = () => (
    <PrivateRoute>
        <Head>
            <title>Photogram - Settings (Change Password)</title>
        </Head>
        <div className="w-full max-w-2xl mt-4">
            <ChangePassword />
        </div>
    </PrivateRoute>
);

export default ChangePasswordPage;
