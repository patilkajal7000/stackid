import { useQuery } from '@tanstack/react-query';
import { http_get, http_post } from './BaseURLAxios';
// ------------------------------- AWS URLs -----------------------------------------------------------
const IDENTITIES_ROUTE_BASE_URL = 'identities';
const RESOURCES_ROUTE_BASE_URL = 'resources';
const IDENTITIES_API_URL = IDENTITIES_ROUTE_BASE_URL + '/overview/users';
const FEDERATED_OVERVIEW_API_URL = IDENTITIES_ROUTE_BASE_URL + '/fed-users/overview';
const POLICY_INSIGHTS_API_URL = IDENTITIES_ROUTE_BASE_URL + '/policy/insights';
const POLICY_IDENTITIES_API_URL = IDENTITIES_ROUTE_BASE_URL + '/policy/identities';
const POLICY_PERMISSIONS_API_URL = IDENTITIES_ROUTE_BASE_URL + '/policy/permissions';
const IDENTITY_RESOURCE_API_URL = IDENTITIES_ROUTE_BASE_URL + '/' + RESOURCES_ROUTE_BASE_URL + '/user';
const IDENTITY_DETAILS_BY_ID_API_URL = IDENTITIES_ROUTE_BASE_URL + '/identity/details';
const RESOURCE_PERSMISSIONS_BY_ID_API_URL = IDENTITIES_ROUTE_BASE_URL + '/user/resource/permissions';
const ROLES_BY_ID_API_URL = IDENTITIES_ROUTE_BASE_URL + '/roles/overview';
const ASSUME_ROLE_RESOURCES_URL = IDENTITIES_ROUTE_BASE_URL + '/assume-role';
const FEDERATED_IDENTITIY_RESOURCES_URL = IDENTITIES_ROUTE_BASE_URL + '/resources/fed-user';
const RESOURCE_BY_ROLE = RESOURCES_ROUTE_BASE_URL + '/role';
const IDENTITY_RESOURCE_OVERVIEW_URL = IDENTITIES_ROUTE_BASE_URL + '/' + RESOURCES_ROUTE_BASE_URL + '/overview';
const IDENTITIES_SUMMARY_TOTAL = IDENTITIES_ROUTE_BASE_URL + '/summary';
// ------------------------------- GCP URLs -----------------------------------------------------------
const GPC_IDENTITIES_INSIGHTS = 'identities/get-identities-insights';
const GCP_IDENTITIES = 'identities/get-identities';
const GCP_ROLES = 'identities/get-roles';
const GCP_SINGLE_IDENTITY_INSIGHTS = 'identities/get-identity-insights';
const GCP_SINGLE_IDENTITY_RISKS = 'identities/get-identity-risks';
const GCP_SINGLE_IDENTITY_DETAILS = 'identities/get-identity-details';
const GCP_RESOURCE_PERMISSIONS = 'identities/get-identity-resource_permissions';
const GCP_SINGLE_IDENTITY_ACTIVITY_LOGS = 'identities/get-identity-activity-logs';
const GCP_ROLE_INSIGHTS = 'identities/get-role-insights';
const GCP_ROLE_IDENTITIES = 'identities/get-role-identities';
const GCP_ROLE_PERMISSIONS = 'identities/get-role-permissions';

//---------------------------- AWS Identities API calls ------------------------------------------------
export const getUsersOverview = async (cloudAccountId: number, page_num?: number, items_per_page?: number) => {
    const url =
        IDENTITIES_API_URL + '?cloud_account_id=' + cloudAccountId + getPaginationQueryParams(page_num, items_per_page);
    return http_get(url);
};

export function getIdentityOverview(cloud_account_id: string, orgId: string, discoveryId: any, identityIds: any): any {
    return useQuery({
        queryKey: [`identityOverview`, cloud_account_id, orgId, discoveryId, identityIds, identityIds?.length],
        queryFn: async () => {
            let prevIndex = 0;
            let data: any;
            let dataArr: string[] = [];
            if (identityIds?.length > 15) {
                for (let index = 15; index < identityIds?.length; index = index + 15) {
                    const arr: string[] = [];
                    identityIds?.slice(prevIndex, index).map((ids: any) => {
                        arr.push('identityIds=' + ids);
                    });
                    prevIndex = index;
                    data = await getIdentityOverviewApiCall(cloud_account_id, orgId, discoveryId, arr);
                    dataArr = dataArr.concat(data);
                }
            }
            if (identityIds?.length - prevIndex > 0) {
                const arr: string[] = [];
                identityIds?.slice(prevIndex, identityIds?.length).map((ids: any) => {
                    arr.push('identityIds=' + ids);
                });
                data = await getIdentityOverviewApiCall(cloud_account_id, orgId, discoveryId, arr);
                dataArr = dataArr.concat(data);
            }
            return dataArr;
        },
        onError: (error) => {
            console.log('getIdentityOverview API Error: ', error);
        },
    });
}

export function getIdentityOverviewApiCall(
    cloud_account_id: string,
    orgId: string,
    discoveryId: any,
    identityIds: any,
) {
    const data = http_get(
        'analyticscore/org/' +
            orgId +
            '/query/id/id_summary_details?orgId=' +
            orgId +
            '&accountId=' +
            cloud_account_id +
            '&discoveryId=' +
            discoveryId +
            '&' +
            identityIds.join().replaceAll(',', '&'),
    );
    return data;
}
export const getPoliciesOverview = async (
    cloudAccountId: number,
    orgId: string,
    page_num?: number,
    items_per_page?: number,
) => {
    const url = 'analyticscore/org/' + orgId + '/query/id/aws_iam_policy_overview?accountId=' + cloudAccountId;
    getPaginationQueryParams(page_num, items_per_page);
    return http_get(url);
};

export const getFederatedOverview = async (cloudAccountId: number, identityType: string) => {
    const url = FEDERATED_OVERVIEW_API_URL + '/' + cloudAccountId + '?identity_type=' + identityType;
    return http_get(url);
};

export const getResourcesByIdentityId = async (
    cloudAccountId: number,
    identityId: string,
    page_num?: number,
    items_per_page?: number,
) => {
    const url =
        IDENTITY_RESOURCE_API_URL +
        '?cloud_account_id=' +
        cloudAccountId +
        '&identity_id=' +
        identityId +
        getPaginationQueryParams(page_num, items_per_page);

    return http_get(url);
};

export const getIdentityDetailsById = async (cloudAccountId: number, identityId: string) => {
    return http_get(
        IDENTITY_DETAILS_BY_ID_API_URL + '?cloud_account_id=' + cloudAccountId + '&identity_id=' + identityId,
    );
};
export const getIdentityConnectionsMap = async (cloudAccountId: number, identityId: string, discovery_id: number) => {
    return http_get(
        IDENTITIES_ROUTE_BASE_URL +
            '/identity-graphv2?' +
            'cloud_account_id=' +
            cloudAccountId +
            '&identity_id=' +
            identityId +
            '&discovery_id=' +
            discovery_id,
    );
};

export const getResourcePermissionsById = async (cloudAccountId: number, identityId: string, resourceId: string) => {
    return http_get(
        RESOURCE_PERSMISSIONS_BY_ID_API_URL +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_id=' +
            identityId +
            '&resource_id=' +
            resourceId,
    );
};

export const getPolicyInsights = async (cloudAccountId: number, policyId: string) => {
    return http_get(POLICY_INSIGHTS_API_URL + '?cloud_account_id=' + cloudAccountId + '&policy_id=' + policyId);
};

export const getPolicyIdentities = async (cloudAccountId: number, policyId: string) => {
    return http_get(POLICY_IDENTITIES_API_URL + '?cloud_account_id=' + cloudAccountId + '&policy_id=' + policyId);
};

export const getPolicyPermissions = async (cloudAccountId: number, policyId: string) => {
    return http_get(POLICY_PERMISSIONS_API_URL + '?cloud_account_id=' + cloudAccountId + '&policy_id=' + policyId);
};

export const getRolesInsights = async (
    cloud_account_id: number,
    identity_type: string,
    page_num?: number,
    items_per_page?: number,
) => {
    const body = { cloud_account_id, identity_type: identity_type, page_num, items_per_page };
    return http_post(ROLES_BY_ID_API_URL, body);
};

export const getCrossAccountAccess = async (
    cloud_account_id: number,
    identity_type: string,
    page_num?: number,
    items_per_page?: number,
) => {
    const body = { cloud_account_id, identity_type: identity_type, page_num, items_per_page };
    return http_post('/identities/roles/cross-account-access/overview', body);
};

export const getIdentitiesSummaryTotal = async (cloudAccountId: number) => {
    return http_get(IDENTITIES_SUMMARY_TOTAL + '?cloud_account_id=' + cloudAccountId);
};

// Summary Counts and Drilldowns APIs
export function getIdentitySummaryCounts(orgId: string, accountId: number, interval: number, discoveryId: number) {
    return useQuery({
        queryKey: [`identitiesSummaryCount`, orgId, accountId, interval, discoveryId],
        queryFn: async () => {
            const data: any = await http_get(
                `/analyticscore/org/${orgId}/query/id/id_summary_counts?accountId=${accountId}&interval=${interval}&discoveryId=${discoveryId}`,
            );
            return data;
        },
        onError: (error) => {
            console.log('Identity Summary Counts API Error: ', error);
        },
        enabled: false,
    });
}

export const getIdentitySummaryDetails = async (body: any, orgId: any) => {
    return http_post('/analyticscore/org/' + orgId + '/query/id/id_summary_details', body);
};

export function getResourceSummaryCounts(
    orgId: string,
    accountId: number,
    interval: number,
    resourceTypes: any,
    discoveryId: number,
) {
    return useQuery({
        queryKey: [`resourcesSummaryCount`, orgId, accountId, interval, resourceTypes, discoveryId],
        queryFn: async () => {
            let resourcesTypeString = '';
            resourceTypes.forEach((element: string) => {
                resourcesTypeString += `&resourceTypes=${element}`;
            });
            const data: any = await http_get(
                `/analyticscore/org/${orgId}/query/id/resource_summary_counts?accountId=${accountId}&interval=${interval}&discoveryId=${discoveryId}${resourcesTypeString}`,
            );
            return data;
        },
        onError: (error) => {
            console.log('Resources Summary Counts API Error: ', error);
        },
    });
}

export const getResourceSummaryDetails = async (body: any, orgId: any) => {
    return http_post('/analyticscore/org/' + orgId + '/query/id/resource_summary_details', body);
};

export function getAppSummaryCounts(orgId: string, accountId: number, interval: number, discoveryId: number) {
    return useQuery({
        queryKey: [`appSummaryCount`, orgId, accountId, interval, discoveryId],
        queryFn: async () => {
            const data: any = await http_get(
                `/analyticscore/org/${orgId}/query/id/app_summary_counts?accountId=${accountId}&interval=${interval}&discoveryId=${discoveryId}`,
            );
            return data;
        },
        onError: (error) => {
            console.log('App Summary Counts API Error: ', error);
        },
        enabled: false,
    });
}

export const getAppSummaryDetails = async (body: any, orgId: any) => {
    return http_post('/analyticscore/org/' + orgId + '/query/id/app_summary_details', body);
};

export function getRiskyIdSummaryCounts(orgId: string, accountId: number, discoveryId: number): any {
    return useQuery({
        queryKey: [`riskySummaryCount`, orgId, accountId, discoveryId],
        queryFn: async () => {
            const data: any = await http_get(
                `/analyticscore/org/${orgId}/query/id/id_summary_risk_counts?accountId=${accountId}&discoveryId=${discoveryId}`,
            );
            return data;
        },
        onError: (error) => {
            console.log('Risky Summary Counts API Error: ', error);
        },
        enabled: false,
    });
}

export const getRiskyIdSummaryDetails = async (body: any, orgId: any) => {
    return http_post('/analyticscore/org/' + orgId + '/query/id/id_summary_risk_details', body);
};

export const getAssumeRoleResources = (
    cloud_account_id: number,
    resource_id: string,
    assumed_role_name: string,
    assumed_role_account_id: string,
) => {
    const body = {
        cloud_account_id,
        resource_id,
        assumed_role_name,
        assumed_role_account_id,
    };
    return http_post(ASSUME_ROLE_RESOURCES_URL, body);
};

export const getFedUserResources = (cloudAccountId: number, identityId: string, roleName: string) => {
    return http_get(
        FEDERATED_IDENTITIY_RESOURCES_URL +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_id=' +
            identityId +
            '&role_name=' +
            roleName,
    );
};

export const getResourcesAttachedToRole = (cloudAccountId: number, resource_id: string) => {
    return http_get(RESOURCE_BY_ROLE + '?cloud_account_id=' + cloudAccountId + '&identity_id=' + resource_id);
};

export const getIdentityResourceOverview = (cloudAccountId: number, identity_id: string) => {
    return http_get(
        IDENTITY_RESOURCE_OVERVIEW_URL + '?cloud_account_id=' + cloudAccountId + '&identity_id=' + identity_id,
    );
};

//---------------------------- GCP Identities API calls ------------------------------------------------
export const getGCPIdentitesInsights = async (cloudAccountId: number, identityType: string) => {
    return http_get(GPC_IDENTITIES_INSIGHTS + '?cloud_account_id=' + cloudAccountId + '&identity_type=' + identityType);
    // return identityType == 'User' ? {
    //     "access_types": [
    //         ["console access", 6]
    //     ],
    //     "permissions": [
    //         ["bigquery.admin", 4],
    //         [
    //             "bigquery.dataEditor",
    //             5
    //         ],
    //         [
    //             "bigquery.dataOwner",
    //             8
    //         ],
    //         [
    //             "bigquery.dataViewer",
    //             7
    //         ]
    //     ]
    // } : {
    //     "access_types": [
    //         [
    //             "programmatic access",
    //             15
    //         ]
    //     ],
    //     "permissions": [
    //         [
    //             "bigquery.admin",
    //             2
    //         ],
    //         [
    //             "bigquerydatatransfer.serviceAgent",
    //             1
    //         ],
    //         [
    //             "bigquery.dataOwner",
    //             2
    //         ],
    //         [
    //             "bigquery.user",
    //             1
    //         ]
    //     ]
    // }
};

export const getGCPIdentities = async (cloudAccountId: number, identityType: string) => {
    return http_get(GCP_IDENTITIES + '?cloud_account_id=' + cloudAccountId + '&identity_type=' + identityType);
    // return [
    //     {
    //         "last_activity": -1,
    //         "permissions": [
    //             "Console Access",
    //             "bigquery.dataOwner",
    //             "bigquery.dataEditor",
    //             "bigquery.admin"
    //         ],
    //         "resource_ids_count": 2,
    //         "resource_access_details": [
    //             "TestDataset",
    //             "TestDataset1"
    //         ],
    //         "risk_type": [],
    //         "identity_name": "sanjay@stackidentity.com",
    //         "identity_id": "sanjay@stackidentity.com"
    //     },
    //     {
    //         "last_activity": 1645679247,
    //         "permissions": [
    //             "Console Access",
    //             "iam.organizationRoleAdmin",
    //             "resourcemanager.organizationAdmin",
    //             "resourcemanager.folderAdmin",
    //             "iam.roleAdmin",
    //             "iam.securityAdmin",
    //             "owner",
    //             "storage.admin",
    //             "bigquery.dataOwner"
    //         ],
    //         "resource_ids_count": 4,
    //         "resource_access_details": [
    //             "TestDataset",
    //             "TestingDataSet",
    //             "TempDataset",
    //             "TestDataset1"
    //         ],
    //         "risk_type": [
    //             "Excessive Access"
    //         ],
    //         "identity_name": "tushar@stackidentity.com"
    //     }
    // ]
};

export const getGCPRoles = async (cloudAccountId: number) => {
    return http_get(GCP_ROLES + '?cloud_account_id=' + cloudAccountId);
    // return [
    //     {
    //         "identities": {
    //             "users": 3
    //         },
    //         "management": "Predefined",
    //         "permission_type": "",
    //         "resource_type": "bq_Dataset",
    //         "role_name": "bigquery.admin",
    //         "role_id": "bigquery.admin"
    //     },
    //     {
    //         "identities": {
    //             "service_account": 1,
    //             "users": 1
    //         },
    //         "management": "Predefined",
    //         "permission_type": "test",
    //         "resource_type": "bq_Table",
    //         "role_name": "bigquery.admin",
    //         "role_id": "bigquery.admin"
    //     }
    // ]
};

export const getGCPIdentityRisks = async (cloudAccountId: number, identityType: string, identity_id: string) => {
    return http_get(
        GCP_SINGLE_IDENTITY_RISKS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_type=' +
            identityType +
            '&identity_id=' +
            identity_id,
    );
    // return {
    //     "unused_access": {
    //         "total_access": 300,
    //         "unused_access": 200,
    //         "user_id": "AIDAWNFCUEXFIHCJOB3ZS"
    //     },
    //     "excessive_access": {
    //         "total_access": 300,
    //         "unused_access": 200,
    //         "user_id": "AROAWNFCUEXFCAF5UH5PT"
    //     }
    // }
};

export const getSingleGCPIdentityInsights = async (
    cloudAccountId: number,
    identityType: string,
    identity_id: string,
) => {
    return http_get(
        GCP_SINGLE_IDENTITY_INSIGHTS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_type=' +
            identityType +
            '&identity_id=' +
            identity_id,
    );
    // return {
    //     "identity_id": "AIDAWNFCUEXFIHCJOB3ZS",
    //     "identity_name": "apoorv.jain@stackidentity.com",
    //     "last_created_on": 1645677965,
    //     "last_activity": 1645677965,
    //     "programmatic_access": true,
    //     "console_access": true,
    //     "can_impersonate_service_account": true
    // }
};

export const getSingleGCPIdentityDetails = async (
    cloudAccountId: number,
    identityType: string,
    identity_id: string,
) => {
    return http_get(
        GCP_SINGLE_IDENTITY_DETAILS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_type=' +
            identityType +
            '&identity_id=' +
            identity_id,
    );
    // return [{
    //     "resource_id": "resource_id",
    //     "resource_name": "employeeData",
    //     "resource_type": "bigquery_dataset",
    //     "permission_type": "Owner",
    //     "classification": "feedback",
    //     "last_activity": 1645677965
    // }]
};

export const getGCPResourcePermissions = async (
    cloudAccountId: number,
    identityType: string,
    identity_id: string,
    resource_id: string,
) => {
    return http_get(
        GCP_RESOURCE_PERMISSIONS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_type=' +
            identityType +
            '&identity_id=' +
            identity_id +
            '&resource_id=' +
            resource_id,
    );
    // return {
    //     "resource_name": "employeeData",
    //     "resource_type": "bigquery_dataset",
    //     "permissions": [
    //         {
    //             "permission_name": "bigquery.config.get",
    //             "permission_type": "Owner",
    //             "role": [
    //                 "Apigee API Admin",
    //                 "Billing Account Administrator"
    //             ]
    //         }
    //     ]
    // }
};

export const getSingleGCPIdentityActivityLogs = async (
    cloudAccountId: number,
    identityType: string,
    identity_id: string,
) => {
    return http_get(
        GCP_SINGLE_IDENTITY_ACTIVITY_LOGS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&identity_type=' +
            identityType +
            '&identity_id=' +
            identity_id,
    );
    // return [{
    //     "activity": "EXPORT",
    //     "event_name": "Big Query Table accessed",
    //     "event_details": "Table: MasterTable, Classification Label: -, Operation: INSERT",
    //     "date": 1645677965,
    // }]
};

export const getSingleGCPRoleInsights = async (cloudAccountId: number, roleId: string) => {
    return http_get(GCP_ROLE_INSIGHTS + '?cloud_account_id=' + cloudAccountId + '&role_id=' + roleId);
    // return {
    //     "identities": {
    //         "users": 2,
    //         "service_accounts": 2
    //     },
    //     "permissions": {
    //         "owner": 1,
    //         "editor": 2,
    //         "viewer": 3
    //     },
    //     "role_name": "AmazonEC2FullAccess",
    //     "role_type": "customer_defined"
    // }
};

export const getSingleGCPRoleIdentites = async (cloudAccountId: number, roleId: string) => {
    return http_get(GCP_ROLE_IDENTITIES + '?cloud_account_id=' + cloudAccountId + '&role_id=' + roleId);
    // return [{
    //     "identity_name": "abc",
    //     "identity_type": "user"
    // }]
};

export const getSingleGCPRolePermissions = async (cloudAccountId: number, roleId: string) => {
    return http_get(GCP_ROLE_PERMISSIONS + '?cloud_account_id=' + cloudAccountId + '&role_id=' + roleId);
    // return {
    //     "TestDataset1": {
    //         "Owner": [
    //             {
    //                 "permission_name": "bigquery.config.get",
    //                 "last_used_on": 1645677965,
    //                 "last_used_by": "abc"
    //             }
    //         ]
    //     }
    // }
};

/* ----------------------- private methods------------------------- */
function getPaginationQueryParams(page_num: number | undefined, items_per_page: number | undefined) {
    let url = '';
    if (page_num) {
        url += '&page_num=' + page_num;
    }
    if (items_per_page) {
        url += '&items_per_page=' + items_per_page;
    }
    return url;
}
