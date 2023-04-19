import { useQuery } from '@tanstack/react-query';
import { SI_USER } from './AuthAPISerivce';
import { authAxios, http_delete, http_get, http_post, http_put } from './BaseURLAxios';

export const ORG_USERS = SI_USER + '/org-users/';
export const INVITE_USER = SI_USER + '/invite/';
export const USER = SI_USER + '/user/';
export const TRANSFER_OWNERSHIP = SI_USER + '/transfer-ownership/';
export const EDIT_CURRENT_USER = SI_USER + '/me/';
export const EDIT_ORG_NAME = SI_USER + '/org/';
export const EDIT_USER_ROLE = SI_USER + '/change-role/';
export const RISK_WORKFLOW = '/api/v2/risk-workflow';
// export const RISK_IDS = RISK_WORKFLOW + '/risk-workflow/';
export const CURRENT_STATUS = '/api/v2/risk-workflow/search/ids';

export const getAllOrgAndRoles = async () => {
    return http_get(ORG_USERS, authAxios);
};

export const getAlldeactivatedUser = async (include_inactive: boolean) => {
    include_inactive;
    return http_get(ORG_USERS + '?include_inactive=' + include_inactive, authAxios);
};

export const inviteUser = async (email: string, set_details?: boolean, name?: any, password?: any) => {
    const body = { email, set_details, name, password };
    return http_post(INVITE_USER, body, authAxios);
};

export const reInviteUser = async (userId: any, email: string) => {
    return http_post(USER + 'reinvite/' + userId + '/', { email: email }, authAxios);
};

export const deleteUser = async (user_id: any) => {
    return http_delete(USER + user_id, authAxios);
};

export const transferOwmner = async (user_id: any, email: string) => {
    const body = { transfer_email: email };
    return http_post(TRANSFER_OWNERSHIP + user_id + '/', body, authAxios);
};

export const updateMemberOfOrg = async (user_id: any, body: any) => {
    return http_put(USER + user_id + '/', body, authAxios);
};

export const getCurrentUser = async () => {
    return http_get(EDIT_CURRENT_USER, authAxios);
};

export const updateCurrentUser = async (body: any) => {
    return http_put(EDIT_CURRENT_USER, body, authAxios);
};

export const updateOrgName = async (body: any) => {
    return http_put(EDIT_ORG_NAME, body, authAxios);
};

export const updateUserRole = async (user_id: any, body: any) => {
    return http_put(EDIT_USER_ROLE + user_id + '/', body, authAxios);
};

export const riskWorkFlow = async (body: any) => {
    return await http_post(RISK_WORKFLOW, body);
};

export const bulkRiskWorkFlow = async (body: any) => {
    return await http_post(RISK_WORKFLOW + '/bulk-update', body);
};

export function currentStates(body: any) {
    return useQuery({
        queryKey: [`currentStatesCount`, CURRENT_STATUS, body],
        queryFn: async () => {
            const data: any = await http_post(CURRENT_STATUS, body);
            return data;
        },
        onError: (error) => {
            console.log('current States API Error: ', error);
        },
        enabled: false,
    });
}

export const riskIdAPI = async (orgId: any, riskId: any) => {
    return await http_get(`/analyticscore/org/${orgId}/query/id/risk_status_changes?riskId=${riskId}`);
};

export const riskTagsAPI = async (orgId: any, accId: any) => {
    return await http_get(`/rules/org/${orgId}/account/${accId}/tags`);
};
