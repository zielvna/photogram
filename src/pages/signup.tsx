import type { NextPage } from 'next';
import Head from 'next/head';
import { Progress } from '../components/Progress';
import { PublicRoute } from '../components/PublicRoute';
import { SignUp } from '../components/SignUp';
import { Wrapper } from '../components/Wrapper';

const SignUpPage: NextPage = () => (
    <PublicRoute>
        <Head>
            <title>Photogram - Sign Up</title>
        </Head>
        <Progress />
        <Wrapper>
            <div className="w-full max-w-xs mt-20">
                <SignUp />
            </div>
        </Wrapper>
    </PublicRoute>
);

export default SignUpPage;
