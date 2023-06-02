import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { ChangePassword } from '../../components/ChangePassword';
import { Header } from '../../components/Header';
import { Progress } from '../../components/Progress';
import { Wrapper } from '../../components/Wrapper';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const ChangePasswordPage: NextPage = () => (
    <>
        <Progress />
        <Header />
        <Wrapper>
            <div className="w-full max-w-2xl mt-4">
                <ChangePassword />
            </div>
        </Wrapper>
    </>
);

export default ChangePasswordPage;
