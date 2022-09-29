import { useContext } from 'react';

import { UserContext } from '../contexts/userContext';

function useUser() {
    const user = useContext(UserContext);

    return user;
}

export default useUser;
