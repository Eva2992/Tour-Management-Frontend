import { useContext } from 'react';
import { AuthContext } from '../context/auth';

export const useAuth = () => useContext(AuthContext);


///A hook that runs side effects — code that runs after the component renders.
//