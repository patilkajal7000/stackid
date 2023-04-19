import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { addTokenToRequest, errorDetails, exemptedUrls, handleResponseError } from './AxiosService';
import { BASE_URL, BASE_URL_AUTH_V1, STATUS } from 'shared/utils/Constants';
import BaseAPI from './BaseURLAxios';

export default axios.create({
    baseURL: BASE_URL,
});

export const authAxios = axios.create({
    baseURL: BASE_URL_AUTH_V1,
});

authAxios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // Request come here before leaving UI, check for any value or add headers
        return addTokenToRequest(config);
    },
    (error) => {
        return Promise.reject(error);
    },
);

authAxios.interceptors.response.use(
    (config: AxiosResponse) => {
        // Response come here from backend, check for any value or headers
        return config;
    },
    (error: AxiosError) => {
        if (error && error.config && error.config.url && exemptedUrls(error.config.url)) {
            return Promise.reject(error);
        }
        return handleResponseError(error);
    },
);

BaseAPI.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // Request come here before leaving UI, check for any value or add headers
        return addTokenToRequest(config);
    },
    (error) => {
        return Promise.reject(error);
    },
);

BaseAPI.interceptors.response.use(
    (config: AxiosResponse) => {
        // Response come here from backend, check for any value or headers
        return config;
    },
    (error: any) => {
        return handleResponseError(error);
    },
);

export const http_get = async (url: string, APIinstance?: AxiosInstance) => {
    const API = APIinstance ? APIinstance : BaseAPI;
    return new Promise((resolve, reject) => {
        API.get(url)
            .then((res: AxiosResponse) => {
                if (res.status === STATUS.OK) {
                    resolve(res.data);
                } else {
                    reject('Something went wrong');
                }
            })
            .catch((err: AxiosError) => {
                errorDetails(err, url);
                reject(err);
            });
    });
};

export const http_post = async (url: string, data: any, APIinstance?: AxiosInstance, config?: AxiosRequestConfig) => {
    const API = APIinstance ? APIinstance : BaseAPI;
    return new Promise((resolve, reject) => {
        API.post(url, data, config)
            .then((res: AxiosResponse) => {
                if (res.status === STATUS.OK || res.status === STATUS.CREATED) {
                    resolve(res.data);
                } else {
                    reject('Something went wrong');
                }
            })
            .catch((err: AxiosError) => {
                errorDetails(err);
                reject(err);
            });
    });
};

export const http_delete = async (url: string, body?: any, APIinstance?: AxiosInstance) => {
    let API: any;
    return new Promise((resolve, reject) => {
        API = APIinstance ? APIinstance : BaseAPI;
        if (typeof body == 'function') {
            API = body ? body : BaseAPI;
            API.delete(url)
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                })
                .catch((err: AxiosError) => {
                    errorDetails(err);
                    reject(err);
                });
        } else {
            API.delete(url, { data: body })
                .then((res: AxiosResponse) => {
                    resolve(res.data);
                })
                .catch((err: AxiosError) => {
                    errorDetails(err);
                    reject(err);
                });
        }
    });
};

export const http_put = async (url: string, body: any, APIinstance?: AxiosInstance) => {
    const API = APIinstance ? APIinstance : BaseAPI;
    return new Promise((resolve, reject) => {
        API.put(url, body)
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err: AxiosError) => {
                errorDetails(err);
                reject(err);
            });
    });
};
