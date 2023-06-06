import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { Wrapper } from '../components/Wrapper';
import { UserProvider } from '../contexts/userContext';
import '../firebase';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <UserProvider>
            <Progress />
            {router.pathname !== '/login' && router.pathname !== '/signup' && <Header />}
            <Wrapper>
                <Component {...pageProps} />
            </Wrapper>
        </UserProvider>
    );
}
