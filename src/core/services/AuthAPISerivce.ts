import store from 'store/store';
import { http_post, authAxios, http_get, http_put } from './BaseURLAxios';

export const SI_USER = '/si-users';
const LOGIN_URL = SI_USER + '/login/';
const FORGOT_PASSWORD = SI_USER + '/forgot-pass/';
const RESET_PASSWORD = SI_USER + '/reset-pass/';
const SIGN_UP = SI_USER + '/signup/';
const GOOGLE_LOGIN_URL = SI_USER + '/oidc-login/';
const ACTIVATE_USER_URL = SI_USER + '/activate/';
const REFRESH_TOKEN_URL = SI_USER + '/token/refresh/';
const INVITE_USER_VERIFY_URL = SI_USER + '/invite/verify/';
const ADD_SANDBOX = SI_USER + '/org/sandbox/';

/** These are the URL's in which if 401 error occurs, refresh token API not to be called */
export const exemptedRefreshTokensUrls = [
    LOGIN_URL,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    SIGN_UP,
    GOOGLE_LOGIN_URL,
    ACTIVATE_USER_URL,
    INVITE_USER_VERIFY_URL,
];

export const login = async (body: any) => {
    return http_post(LOGIN_URL, body, authAxios);
};

export const forgotPassword = async (body: any) => {
    return http_post(FORGOT_PASSWORD, body, authAxios);
};

export const resetPassword = async (body: any, verificationCode: string, params: any) => {
    return http_post(RESET_PASSWORD + verificationCode + '/' + params, body, authAxios);
};

export const verifyResetPasswordLink = async (verificationCode: string, params: string) => {
    return http_get(RESET_PASSWORD + verificationCode + '/' + params, authAxios);
};

export const signUp = async (body: any) => {
    return http_post(SIGN_UP, body, authAxios);
};

export const goole_login = async (body: any) => {
    return http_post(GOOGLE_LOGIN_URL, body, authAxios);
};

export const activate_user = async (verificationCode: string, params: string) => {
    return http_get(ACTIVATE_USER_URL + verificationCode + '/' + params, authAxios);
};

export const getRefreshToken = async () => {
    const body = { refresh: store.getState().authState.refreshToken };
    return http_post(REFRESH_TOKEN_URL, body, authAxios);
};

export const verifyInvitedUserUrl = async (verificationCode: string, params: string) => {
    return http_get(INVITE_USER_VERIFY_URL + verificationCode + '/' + params, authAxios);
};

export const registerInvitedUser = async (verificationCode: string, body: any) => {
    return http_post(INVITE_USER_VERIFY_URL + verificationCode + '/', body, authAxios);
};

export const addSandboxAccount = (body: any) => {
    return http_put(ADD_SANDBOX, body, authAxios);
};
