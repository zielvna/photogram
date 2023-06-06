import type { NextPage } from 'next';
import Head from 'next/head';

const Custom404: NextPage = () => (
    <>
        <Head>
            <title>Photogram - Page not found</title>
        </Head>
        <div className="mt-4 flex justify-center">Page not found.</div>
    </>
);

export default Custom404;
