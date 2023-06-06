import type { NextPage } from 'next';
import Head from 'next/head';
import { CreatePost } from '../components/CreatePost';
import { PrivateRoute } from '../components/PrivateRoute';

const CreatePostPage: NextPage = () => (
    <PrivateRoute>
        <Head>
            <title>Photogram - Create post</title>
        </Head>
        <div className="mt-4">
            <CreatePost />
        </div>
    </PrivateRoute>
);

export default CreatePostPage;
