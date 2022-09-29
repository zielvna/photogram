import type { AppProps } from 'next/app';

import '../firebase.ts';
import { UserProvider } from '../contexts/userContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
