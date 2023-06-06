import type { NextPage } from 'next';
import Head from 'next/head';
import { PublicRoute } from '../components/PublicRoute';
import { SignUp } from '../components/SignUp';

const SignUpPage: NextPage = () => (
    <PublicRoute>
        <Head>
            <title>Photogram - Sign Up</title>
        </Head>
        <div className="w-full max-w-xs mt-20">
            <SignUp />
        </div>
    </PublicRoute>
);

export default SignUpPage;
