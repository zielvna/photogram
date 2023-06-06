import type { NextPage } from 'next';
import Head from 'next/head';
import { CreatePost } from '../components/CreatePost';
import { Header } from '../components/Header';
import { PrivateRoute } from '../components/PrivateRoute';
import { Progress } from '../components/Progress';
import { Wrapper } from '../components/Wrapper';

const CreatePostPage: NextPage = () => (
    <PrivateRoute>
        <Head>
            <title>Photogram - Create post</title>
        </Head>
        <Progress />
        <Header />
        <Wrapper>
            <div className="mt-4">
                <CreatePost />
            </div>
        </Wrapper>
    </PrivateRoute>
);

export default CreatePostPage;
