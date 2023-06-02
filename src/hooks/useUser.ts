import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';

export const useUser = () => {
    const user = useContext(UserContext);

    return user;
};
