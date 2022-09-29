import { useState, useEffect, createContext } from 'react';
import { User as FirebaseUser, getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

type User = FirebaseUser | null;

export const UserContext = createContext<User>(null);

type Props = {
    children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
