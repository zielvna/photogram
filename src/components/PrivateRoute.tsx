import { useRouter } from 'next/router';
import { useUserContext } from '../contexts/userContext';

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { user } = useUserContext();
    const router = useRouter();

    if (user === null) {
        router.replace('/login');
    }

    return <div>{children}</div>;
};
