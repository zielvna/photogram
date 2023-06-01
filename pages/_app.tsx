import type { AppProps } from 'next/app';
import { UserProvider } from '../contexts/userContext';
import '../firebase.ts';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
