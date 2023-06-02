import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { Progress } from '../components/Progress';
import { SignUp } from '../components/SignUp';
import { Wrapper } from '../components/Wrapper';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (cookies.token) {
        context.res.setHeader('location', '/');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const SignUpPage: NextPage = () => (
    <>
        <Progress />
        <Wrapper>
            <div className="w-full max-w-xs mt-20">
                <SignUp />
            </div>
        </Wrapper>
    </>
);

export default SignUpPage;
