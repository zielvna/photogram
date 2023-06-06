import { User as FirebaseUser, onIdTokenChanged } from 'firebase/auth';
import nookies from 'nookies';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

export interface UserContextValue {
    user: FirebaseUser | null | undefined;
}

const UserContext = createContext<UserContextValue>({ user: undefined });

type Props = {
    readonly children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserContextValue>({ user: undefined });

    useEffect(() => {
        onIdTokenChanged(auth, async (user) => {
            setUser({ user });

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

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useFooContext must be use inside FooProvider!');
    }

    return context;
};
