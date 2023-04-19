import type { AxiosInstance } from 'axios';
import { BasicCofigPayload } from 'shared/models/CloudAccountModel';
import BaseAPI, { http_delete, http_get, http_post, http_put } from './BaseURLAxios';

export const CLOUDACCOUNT_URL = 'cloudaccount';
export const CLOUDACCOUNT_SI_IAM_USER_URL = CLOUDACCOUNT_URL + '/si-iam-user';
const CLOUDACCOUNT_DISCOVERY_URL = CLOUDACCOUNT_URL + '/discover';
const CLOUDACCOUNTS_DISCOVERY_STATUS_URL = CLOUDACCOUNT_URL + '/discovery-status';
const DISCOVERY_STATUS_URL = CLOUDACCOUNT_URL + '/status';
const CLOUDACCOUNT_CONFIGS_URL = 'cloudaccount-config';
const CONFIG = 'config';
export const getAllCloudAccounts = async () => {
    return http_get(CLOUDACCOUNT_URL);
};

export const addCloudAccount = async (body: any) => {
    return http_post(CLOUDACCOUNT_URL, body);
};

export const addSnowflakeCloudAccount = async (body: any) => {
    return http_post(CLOUDACCOUNT_URL + '/snowflake', body);
};
export const addGitCloudAccount = async (body: any) => {
    return http_post(CLOUDACCOUNT_URL + '/github', body);
};

export const createSIIAMUser = async (body: { cloud_account_name: string; assume_role: string }) => {
    return http_post(CLOUDACCOUNT_SI_IAM_USER_URL, body);
};

export const startCloudAccountDiscovery = async (id: string) => {
    return http_get(CLOUDACCOUNT_DISCOVERY_URL + '/' + id);
};

export const getAllCloudAccountsWithDiscoveryStatus = async () => {
    return http_get(CLOUDACCOUNTS_DISCOVERY_STATUS_URL);
};

export const getCloudAccount = async (id: number) => {
    return http_get(CLOUDACCOUNT_URL + '/' + id);
};

export const getCloudAccountsDiscoveryStatus = async (ids: string) => {
    return http_get(DISCOVERY_STATUS_URL + '/' + ids);
};

export const get = async (id: number) => {
    return http_get(CLOUDACCOUNT_URL + '/' + id);
};

export const uploadCloudAccountFile = (file: File, name: string, key1: any, key2: any, slack_url: any) => {
    const APIinstance: AxiosInstance = BaseAPI;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('cloud_provider', 'GCP');
    if (key1) {
        formData.append('subscription_id', key1);
    }
    if (key2) {
        formData.append('bigquery_tag_key', key2);
    }
    if (slack_url) {
        formData.append('slack_web_url', slack_url);
    }
    return http_post(CLOUDACCOUNT_URL + '/file', formData, APIinstance, {
        transformRequest: () => formData,
    });
    // return http_post(CLOUDACCOUNT_URL + '/file', formData, APIinstance, {
    //     headers: { 'content-type': 'multipart/form-data' },
    // });
};

// -------------------- Cloud Account Settings API ---------------------------

export const getCloudAccountConfigs = async (id: number) => {
    return http_get(CLOUDACCOUNT_CONFIGS_URL + '/' + id);
};

export const addCloudAccountConfig = async (id: number, config: { config_name: string; config_value: any }) => {
    return http_post(CLOUDACCOUNT_CONFIGS_URL + '/' + id, config);
};
export const addRiskConfig = async (config: any) => {
    return http_post('schedule-process', config);
};
export const UpdateRiskConfig = async (config: any) => {
    return http_put('schedule-process', config);
};

export const updateCloudAccountConfig = async (
    id: number,
    configId: number,
    config: { config_name: string; config_value: any },
) => {
    return http_put(CLOUDACCOUNT_CONFIGS_URL + '/' + id + '/' + CONFIG + '/' + configId, config);
};

export const deleteCloudAccountConfig = async (id: number, configId: number) => {
    return http_delete(CLOUDACCOUNT_CONFIGS_URL + '/' + id + '/' + CONFIG + '/' + configId);
};

export const updateCloudAccount = async (id: number, body: BasicCofigPayload) => {
    return http_put(CLOUDACCOUNT_URL + '/' + id, body);
};

// -------------------- Resource Inventory API ---------------------------
