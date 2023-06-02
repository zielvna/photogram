import { User as FirebaseUser, onIdTokenChanged } from 'firebase/auth';
import nookies from 'nookies';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

type User = FirebaseUser | null | undefined;

export const UserContext = createContext<User>(undefined);

type Props = {
    children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        onIdTokenChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                const token = await user.getIdToken();
                nookies.set(undefined, 'token', token, { path: '/' });
            } else {
                nookies.destroy(undefined, 'token', { path: '/' });
            }
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
