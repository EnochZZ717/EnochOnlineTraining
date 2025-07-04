import { Navigate } from 'react-router-dom';
import { INITIAL_PATH, INITIAL_PATH_SEARCH } from '../models/common/sys-msg';

export const LoginWrapper = (props: {currentUser: any, children: any, isHome?: boolean}) => {
    const {currentUser, children, isHome} = {...props};
    if(!currentUser.token){
        sessionStorage.setItem(INITIAL_PATH, window.location.pathname);
        window.location.search && sessionStorage.setItem(INITIAL_PATH_SEARCH, window.location.search);
    }
    return currentUser.token || isHome ? children : <Navigate to="/login" replace />
};