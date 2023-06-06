import { useRouter } from 'next/router';
import { useUserContext } from '../contexts/userContext';

type Props = {
    children: React.ReactNode;
};

export const PublicRoute = ({ children }: Props) => {
    const { user } = useUserContext();
    const router = useRouter();

    if (user) {
        router.push('/');
    }

    return <div>{children}</div>;
};
