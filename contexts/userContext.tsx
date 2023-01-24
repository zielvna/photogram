import { useState, useEffect, createContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase';

type User = FirebaseUser | null | undefined;

export const UserContext = createContext<User>(undefined);

type Props = {
    children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
