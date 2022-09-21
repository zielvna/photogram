import type { NextPage } from 'next';

import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Post from '../../components/Post';

const PostPage: NextPage = () => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="mt-4">
                    <Post scheme="normal" />
                </div>
            </Wrapper>
        </>
    );
};

export default PostPage;
