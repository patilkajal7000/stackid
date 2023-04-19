import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { logoutUserDeails } from 'shared/service/AuthService';
import { STATUS, ToastVariant } from 'shared/utils/Constants';
import { updateAuthToken } from 'store/actions/AuthActions';
import { setToastMessageAction } from 'store/actions/SingleActions';
import store from 'store/store';
import { exemptedRefreshTokensUrls, getRefreshToken } from './AuthAPISerivce';
import BaseAPI from './BaseURLAxios';

let isAlreadyFetchingAccessToken = false;
let subscribers: any = [];

/**
 * Method to Handle error coming from backend, it will not return the error to the caller in case of 401
 * @param error
 * @returns
 */
export const handleResponseError = (error: any) => {
    const { config, response } = error;
    const originalRequest = config;
    if (response?.status === STATUS.UNAUTHORIZED) {
        if (originalRequest.url?.includes('refresh')) {
            logoutUserDeails();
            return Promise.reject(error);
        }
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            subscribers = [];
            return handle401(error);
        } else {
            const retryOriginalRequest = new Promise((resolve) => {
                addSubscriber((access_token: string) => {
                    originalRequest.headers.Authorization = 'Bearer ' + access_token;
                    resolve(axios(originalRequest));
                });
            });
            return retryOriginalRequest;
        }
    }
    return Promise.reject(error);
};

/**
 * This method will hold all the API in case of 401 error until refresh token API will get
 * new token and will call previous API again with new token
 * @param error
 * @returns
 */
export const handle401 = (error: AxiosError) => {
    return getRefreshToken()
        .then((res: any) => {
            isAlreadyFetchingAccessToken = false;
            if (res?.access && res?.refresh && error.response) {
                isAlreadyFetchingAccessToken = false;
                store.dispatch(updateAuthToken(res.access, res.refresh));
                BaseAPI.defaults.headers.common['Authorization'] = 'Bearer ' + res.access;
                if (
                    error.response.config &&
                    error.response.config.headers &&
                    error.response.config.headers['Authorization']
                ) {
                    error.response.config.headers['Authorization'] = 'Bearer ' + res.access;
                }
                onAccessTokenFetched(res.access);
                return axios(error.response.config);
            } else {
                logoutUser();
                return Promise.reject(error);
            }
        })
        .catch((error: AxiosError) => {
            isAlreadyFetchingAccessToken = false;
            if (error.response?.status === STATUS.UNAUTHORIZED) {
                logoutUser();
            }
            return Promise.reject(error);
        });
};

/**
 * Method to attach token to every outgoing request from UI
 * @param config
 * @returns
 */
export const addTokenToRequest = (config: AxiosRequestConfig) => {
    const token = store.getState()?.authState?.accessToken;
    token &&
        config.headers &&
        Object.assign(config.headers, { Authorization: `Bearer ${store.getState().authState.accessToken}` });
    return config;
};

export const logoutUser = () => {
    logoutUserDeails();
    store.dispatch(setToastMessageAction(ToastVariant.DANGER, 'Please login again'));
};

export const onAccessTokenFetched = (access_token: string) => {
    subscribers = subscribers.filter((callback: any) => callback(access_token));
};

export const addSubscriber = (callback: any) => {
    subscribers.push(callback);
};

export const getErrorValue = (value: any) => {
    switch (typeof value) {
        case 'string':
            return value;
        case 'object':
            return Object.values(value).toString();
        default:
            return '';
    }
};

export const errorDetails = (err: any, url = '') => {
    if (err?.request?.status === STATUS.UNAUTHORIZED) {
        /// This is used in case of Auth error when 401 is received but we want to show error for
        /// Auth related error becuse in those cases error comes with status 401
        if (err && err.config && exemptedUrls(err.config.url)) {
            showError(err, url);
            return;
        } else {
            return;
        }
    } else {
        if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.provider &&
            err.response.data.provider == 'Google'
        ) {
            return;
        } else {
            showError(err, url);
        }
    }
};

export const showError = (err: AxiosError, url = '') => {
    if (url && url.includes('/bpi/risks')) {
        store.dispatch(setToastMessageAction(ToastVariant.DANGER, 'BPI could not be fetched'));
    } else if (url && url.includes('/si-users/org-users/')) {
        return;
    } else {
        store.dispatch(
            setToastMessageAction(
                ToastVariant.DANGER,
                err.response?.data ? getErrorValue(err.response?.data) : 'Something went wrong, Please try again',
            ),
        );
    }
};

/**
 * return which all urls are not in the exempted list for showing an error or calling refresh token
 * @param url
 * @returns boolean
 */
export const exemptedUrls = (url?: string) => {
    return (
        url &&
        exemptedRefreshTokensUrls.some((ur: string) => {
            return url.includes(ur);
        })
    );
};
