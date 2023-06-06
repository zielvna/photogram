import type { NextPage } from 'next';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { Wrapper } from '../components/Wrapper';

const Custom404: NextPage = () => (
    <>
        <Head>
            <title>Photogram - Page not found</title>
        </Head>
        <Progress />
        <Header />
        <Wrapper>
            <div className="mt-4 flex justify-center">Page not found.</div>
        </Wrapper>
    </>
);

export default Custom404;
