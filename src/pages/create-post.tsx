import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { CreatePost } from '../components/CreatePost';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { Wrapper } from '../components/Wrapper';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const CreatePostPage: NextPage = () => (
    <>
        <Progress />
        <Header />
        <Wrapper>
            <div className="mt-4">
                <CreatePost />
            </div>
        </Wrapper>
    </>
);

export default CreatePostPage;
