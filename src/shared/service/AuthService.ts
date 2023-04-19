import * as crypto from 'crypto-js';
import { Cookies } from 'react-cookie';

import { USER_DETAILS_COOKIE } from 'shared/utils/Constants';
import { removeAuthTokens } from 'store/actions/AuthActions';
import store from 'store/store';

export const getEncrytedString = async (value: string) => {
    return await crypto.SHA256(value).toString();
};

export const logoutUserDeails = () => {
    const cookie = new Cookies();
    cookie.remove(USER_DETAILS_COOKIE);
    store.dispatch(removeAuthTokens());

    /** Reloading the app because it will clear of the redux states values */
    // location.reload();
    return true;
};
