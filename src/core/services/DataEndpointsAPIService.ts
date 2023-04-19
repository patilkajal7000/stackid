import { useQuery } from '@tanstack/react-query';
import { http_delete, http_get, http_post, http_put } from './BaseURLAxios';

const DASHBOARD_API_URL = 'data-endpoints/dashboard';
const SUMMARY_API_URL = 'data-endpoints/summary';
const RESOURCE_INVENTOTY_SUMMARY_URL = 'resources/resource-inventory/summary';
const RESOURCE_INVENTOTY_LIST_URL = 'resources/resource-inventory/list';

const RESOURCE_CONNECTIONS_API_URL = 'ui/resource-connections';
const RESOURCE_URL = 'resources';
const APPLICATION_CONNECTIONS_API_URL = RESOURCE_CONNECTIONS_API_URL + '/application-view';
const APPLICATION_DETAILS_API_URL = RESOURCE_CONNECTIONS_API_URL + '/application-details';
const RESOURCE_DETAILS_API_URL = RESOURCE_CONNECTIONS_API_URL + '/resource-details';
const MAPPING_DETAILS_API_URL = RESOURCE_CONNECTIONS_API_URL + '/application-mappings';
const NOTIFICATIONS_API_URL = '/notifications/org';
const SLACK_NOTIFICATIONS_URL = 'notifications/send/org';
const INSIGHTS_API_URL = 'data-endpoints/insights';
const ACCESS_DETAILS_API_URL = 'data-endpoints/access-details';
const IDENTITIES_API_URL = 'data-endpoints/identities';
const IDENTITY_MAPPINGS_URL = '/ui/resource-connections/identity-mappings/org/';
const ALL_RISK_URL = `/graphorchestrator/org/`;
const RISK_DETAILS = `/bpi/risk-details`;
const INTERNET_RISK_DETAILS = `/bpi/internet-risk-details`;

const RESOURCE_COUNT_BY_REGION_URL = RESOURCE_URL + '/region-count';
const RULES = '/rules';
const RISKS = '/bpi/risks';
const POLICIES = '/account-policy';
const POLICIES_RULES = '/account-policy/rules';
const AWS_SINGLE_IDENTITY_ACTIVITY_LOGS = '/analyticscore/org/';

// big query
const BIG_QUERY_DATASET = 'data-endpoints/bigquery_datasets';
const DATASET_INSIGHTS_API_URL = 'data-endpoints/dataset-insights';
const DATASET_TABLES = 'data-endpoints/dataset-tables';
const DATASET_IDENTITIES = '/data-endpoints/dataset-identities-roles';
const DATASET_ACTIVITY_LOGS = '/data-endpoints/dataset-activity-logs';
const DATASET_TABLE_INSIGHTS_API_URL = 'data-endpoints/table-insights';
const SINGLE_TABLE_COLUMNS = 'data-endpoints/tables-columns';
const SINGLE_TABLE_IDENTITIES = 'data-endpoints/table-identities-roles';

export const getDataEndpointsDashboard = async (cloud_account_id: number) => {
    return http_get(DASHBOARD_API_URL + '?cloud_account_id=' + cloud_account_id);
};

export const getDataEndpointsSummary = async (cloud_account_id: number, resource_type: string) => {
    return http_get(SUMMARY_API_URL + '?cloud_account_id=' + cloud_account_id + '&resource_types=' + resource_type);
};

export function getDataEndpointsSummaryGET(accountId: number, resourceType: string) {
    return useQuery({
        queryKey: [`dataEndpointsSummary`, accountId, resourceType],
        queryFn: async () => {
            const data: any = await http_get(
                `/data-endpoints/summary?cloud_account_id=${accountId}&resource_types=${resourceType}`,
            );
            return data;
        },
        onError: (error) => {
            console.log('Dataendpoints Summary API Error: ', error);
        },
    });
}

// TODO: Move `api/v2/` to baseurl after Rahul's PR merge
// Platform Tagging APIs
// export const getGenericTags = async (cloudAccountId: number) => {
//     return http_get('api/v2/platform-tagging/get-generic-tag-keys-values/account/' + cloudAccountId);
// };
export function getGenericTags(cloudAccountId: number): any {
    return useQuery({
        queryKey: [`genericTags`, cloudAccountId],
        queryFn: async () => {
            const data: any = await http_get(
                'api/v2/platform-tagging/get-generic-tag-keys-values/account/' + cloudAccountId,
            );

            return data;
        },
        onError: (error) => {
            console.log('genericTags API Error: ', error);
        },
    });
}
// export const getAllPlatformTags = async (accountId: any, resourceType: any) => {
//     return http_get('/api/v2/platform-tagging/get-all-tags/account/' + accountId + '/resourcetype/' + resourceType);
// };
export function getAllPlatformTags(accountId: any, resourceType: any): any {
    return useQuery({
        queryKey: [`allPlatformtag`, accountId, resourceType],
        queryFn: async () => {
            const data: any = await http_get(
                '/api/v2/platform-tagging/get-all-tags/account/' + accountId + '/resourcetype/' + resourceType,
            );
            return data;
        },
        onError: (error) => {
            console.log('allPlatformtag API Error: ', error);
        },
    });
}
export const addTags = async (body: any) => {
    return http_post('/api/v2/platform-tagging/add-tags', body);
};
export const UpdateTags = async (body: any) => {
    return http_put('/api/v2/platform-tagging/update-tag-details', body);
};
export const DeleteTags = async (body: any) => {
    const url = body?.type && body?.type == 'soft_delete' ? 'delete-tags-for-resources' : 'delete-tags-by-id';

    return http_delete(`/api/v2/platform-tagging/${url}`, body?.body);
};
/**
 * @deprecated The method should not be used as we're showing application connections insted of resource connections
 */
export const getResourceConnections = async (resourceId: string, cloudAccountId: number) => {
    return http_get(
        RESOURCE_CONNECTIONS_API_URL + '?resource_id=' + resourceId + '&cloud_account_id=' + cloudAccountId,
    );
};

export const getApplicationConnections = async (
    resourceId: string,
    cloudAccountId: number,
    connectionType: 'Identity' | 'Network' | 'All',
) => {
    return http_get(
        APPLICATION_CONNECTIONS_API_URL +
            '?resource_id=' +
            resourceId +
            '&cloud_account_id=' +
            cloudAccountId +
            '&connection_type=' +
            connectionType,
    );
};
export const getAtteckMap = async (accountId: number, resourceId: string, discoveryId: any, type: string) => {
    return http_get(
        `/ui/resource-connections/data-asset-graph?cloud_account_id=${accountId}&resource_id=${resourceId}&resource_type=${type}&discovery_id=${discoveryId}`,
    );
};
// export function getAtteckMap(accountId: number, resourceId: string, discoveryId: any, type: string) {
//     return useQuery({
//         queryKey: [`atteckMap`, accountId, resourceId, discoveryId, type],
//         enabled: false,
//         queryFn: async () => {
//             const data: any = await http_get(
//                 `/ui/resource-connections/data-asset-graph/cloud_account_id=${accountId}/resource_id=${resourceId}&resource_type=${type}&discovery_id=${discoveryId}`,
//             );
//             return data;
//         },
//         onError: (error) => {
//             console.log('atteckMap API Error: ', error);
//         },
//     });
// }

export const getAllRiskPath = async (
    org_id: string,
    cloudAccountId: number,
    discoveryId: any,
    resourceId: any,
    // connectionType: 'Identity' | 'Network' | 'All',
) => {
    return http_get(
        ALL_RISK_URL +
            org_id +
            '/account/' +
            cloudAccountId +
            '/discoveryId/' +
            discoveryId +
            '/resource/' +
            resourceId +
            '/allpaths',
    );
};
export const getInsights = async (resourceId: string, cloudAccountId: number, resourceType: string) => {
    return http_get(
        INSIGHTS_API_URL +
            '?resource_id=' +
            resourceId +
            '&cloud_account_id=' +
            cloudAccountId +
            '&resource_type=' +
            resourceType,
    );
};
export const getEndPath = async (
    org_id: string,
    cloudAccountId: any,
    discoveryId: any,
    resourceId: any,
    link: any,
    // connectionType: 'Identity' | 'Network' | 'All',
) => {
    return http_get(
        ALL_RISK_URL +
            org_id +
            '/account/' +
            cloudAccountId +
            '/discoveryId/' +
            discoveryId +
            '/resource/' +
            resourceId +
            '/allpaths?page=' +
            link,
    );
};

export const getAccessDetails = async (cloudAccountId: number, accessIds: Array<number>, accessType: string) => {
    const data = { cloud_account_id: cloudAccountId, access_ids: accessIds, access_type: accessType };
    return http_post(ACCESS_DETAILS_API_URL, data);
};

export const getAccessIdentities = async (cloudAccountId: number, rescourceId: string, resourceType: string) => {
    return http_get(
        IDENTITIES_API_URL +
            '?cloud_account_id=' +
            cloudAccountId +
            '&node_id=' +
            rescourceId +
            '&node_type=' +
            resourceType,
    );
};

export const getActions = async (orgId: any, cloudAccountId: number, discoveryId: any) => {
    return http_get(
        'bpiadapter/org/' +
            orgId +
            '/account/' +
            cloudAccountId +
            '/discoveryId/' +
            discoveryId +
            '/aggregated-lineage-bpi',
    );
};

export const getSiRiskDetails = async (
    orgId: any,
    cloudAccountId: any,
    discoveryId: number,
    ruleIds: any = [],
    resourceId: any,
) => {
    let url =
        AWS_SINGLE_IDENTITY_ACTIVITY_LOGS +
        orgId +
        '/query/id/si_risk_details?orgId=' +
        orgId +
        '&accountId=' +
        cloudAccountId +
        '&discoveryId=' +
        discoveryId;
    ruleIds?.forEach((ruleId: string) => {
        url += '&ruleIds=' + ruleId;
    });
    if (resourceId !== undefined) {
        url += '&resourceId=' + resourceId;
    }
    return http_get(url);
};

export const getSiRiskCount = async (orgId: any, cloudAccountId: any, discoveryId: number, filter: any) => {
    let url =
        AWS_SINGLE_IDENTITY_ACTIVITY_LOGS +
        orgId +
        '/query/id/si_risk_count?orgId=' +
        orgId +
        '&accountId=' +
        cloudAccountId +
        '&discoveryId=' +
        discoveryId;

    if (filter !== undefined) url += '&filter=' + filter;
    return http_get(url);
};

export const getApplications = async (orgId: any, cloudAccountId: number, discoveryId: number) => {
    return http_post('/analyticscore/org/' + orgId + '/query/id/app_summary_details', {
        accountId: `${cloudAccountId}`,
        discoveryId: `${discoveryId}`,
    });
};
export const getMappingsDetails = async (cloudAccountId: number, linkId: number) => {
    return http_get(MAPPING_DETAILS_API_URL + '?cloud_account_id=' + cloudAccountId + '&link_id=' + linkId);
};
// export const getApplicationGraph = async (cloudAccountId: number, application_id: number) => {
//     return await http_get(`application/graph?cloud_account_id=${cloudAccountId}&application_id=${application_id}`);
// };
export function getApplicationGraph(cloudAccountId: number, application_id: number) {
    return useQuery({
        queryKey: [`appgraphdBpi`, cloudAccountId, application_id],
        queryFn: async () => {
            const data: any = await http_get(
                `application/graph?cloud_account_id=${cloudAccountId}&application_id=${application_id}`,
            );
            return data;
        },

        onError: (error) => {
            console.log('Application  graph API Error: ', error);
        },
    });
}
export function getApplicationDetailsList(cloudAccountId: number, orgId: any, discoveryId: any, instanceId: any) {
    return useQuery({
        queryKey: [`aws_ec2_instance_details`, cloudAccountId, orgId, discoveryId, instanceId],
        queryFn: async () => {
            const data: any = await http_get(
                `analyticscore/org/${orgId}/query/id/aws_ec2_instance_details?accountId=${cloudAccountId}&discoveryId=${discoveryId}&instanceIds=${instanceId}`,
            );
            return data;
        },

        onError: (error) => {
            console.log('aws_ec2_instance_details  API Error: ', error);
        },
    });
}

export const getNotificationsURL = async (orgId: any) => {
    return http_get(NOTIFICATIONS_API_URL + '/' + orgId);
};

export const getSlackNotificationsURL = async (orgId: any, accountId: any, body: any) => {
    return http_post(SLACK_NOTIFICATIONS_URL + '/' + orgId + '/' + 'account/' + accountId, body);
    // return http_get(NOTIFICATIONS_API_URL + '/' + orgId + '/' + 'account/' + accountId);
};

export const getJiraNotificationsURL = async (orgId: any, accountId: any, body: any) => {
    return http_post(SLACK_NOTIFICATIONS_URL + '/' + orgId + '/' + 'account/' + accountId, body);
};

export const getPagerDutyNotificationsURL = async (orgId: any, accountId: any, body: any) => {
    return http_post(SLACK_NOTIFICATIONS_URL + '/' + orgId + '/' + 'account/' + accountId, body);
};

export function getAllDissmisedRisks(orgId: any, accountId: any): any {
    return useQuery({
        queryKey: [`allDismissedRisks`, orgId, accountId],
        queryFn: async () => {
            const data: any = await http_get('org/' + orgId + '/account/' + accountId + '/bpiexclusions');
            return data;
        },
        onError: (error) => {
            console.log('Fetching Dismissed Risks API Error: ', error);
        },
    });
}

export const dismissAllRisks = async (orgId: any, accountId: any, resourceId: any, body: any) => {
    return http_post('org/' + orgId + '/account/' + accountId + '/resource/' + resourceId + '/bpiexclusions', body);
};

export const getResourceInventorySummaryURL = async (cloudAccountId: any) => {
    return http_get(RESOURCE_INVENTOTY_SUMMARY_URL + '?cloud_account_id=' + cloudAccountId);
};

export const getResourceInventoryListURL = async (cloudAccountId: any) => {
    return http_get(RESOURCE_INVENTOTY_LIST_URL + '?cloud_account_id=' + cloudAccountId);
};

export const getIdentityMappings = async (orgId: any, accountId: any, body: any) => {
    return http_post(IDENTITY_MAPPINGS_URL + orgId + '/' + 'account/' + accountId, body);
};

export const getApplicationDetails = async (cloudAccountId: number, appId: string) => {
    return http_get(APPLICATION_DETAILS_API_URL + '?app_id=' + appId + '&cloud_account_id=' + cloudAccountId);
};

export const getResourceDetails = async (cloudAccountId: number, rescourceId: string) => {
    return http_get(RESOURCE_DETAILS_API_URL + '?cloud_account_id=' + cloudAccountId + '&resource_id=' + rescourceId);
};

export const getResourcesByRegion = async (cloudAccountId: number) => {
    return http_get(RESOURCE_COUNT_BY_REGION_URL + '?cloud_account_id=' + cloudAccountId);
};

export const getRules = async (cloudAccountId: number, resource_ref: string, resource_type: string) => {
    return http_get(
        RULES +
            '?cloud_account_id=' +
            cloudAccountId +
            '&resource_type=' +
            resource_type +
            '&resource_ref=' +
            resource_ref,
    );
};

export const getRisks = async (cloudAccountId: number, resource_ref: string) => {
    return http_get(RISKS + '?cloud_account_id=' + cloudAccountId + '&resource_ref=' + resource_ref);
};

export const getPolicies = async (cloudAccountId: number) => {
    return http_get(POLICIES + '?cloud_account_id=' + cloudAccountId);
};

export const getRulesPerPolicy = async (cloudAccountId: number, policy_ref: string) => {
    return http_get(POLICIES_RULES + '?cloud_account_id=' + cloudAccountId + '&policy_ref=' + policy_ref);
};

export const getRiskDetails = async (cloudAccountId: number, resource_id: string) => {
    return http_get(RISK_DETAILS + '?cloud_account_id=' + cloudAccountId + '&resource_ref=' + resource_id);
};
export const getInternetRiskDetails = async (cloudAccountId: number) => {
    return http_get(INTERNET_RISK_DETAILS + '?cloud_account_id=' + cloudAccountId);
};

export const getPolicyDocument = async (body: any) => {
    return http_post('/identities/policies/get-policy-document', body);
};

//----------------------- ANALYTICS APIS -----------------------------

export const getQueryOutput = async (orgId: any, body: any) => {
    return http_post('/analyticscore/org/' + orgId + '/query/execute', body);
};
export const createdJobId = async (orgId: any, body: any) => {
    return http_post('/analyticscore/org/' + orgId + '/queryjob', body);
};
export const getStatus = async (orgId: any, job_id: string) => {
    return http_get(`/analyticscore/org/${orgId}/queryjob/${job_id}?status=true`);
};
export const getResult = async (orgId: any, job_id: string) => {
    return http_get(`/analyticscore/org/${orgId}/queryjob/${job_id}?result=true`);
};
export const getQueryCSV = async (body: any) => {
    return http_post('analyticscore/jsontocsv', body);
};

export const getQueryXLSX = async (body: any) => {
    return http_post('analyticscore/jsontoxlsx', body);
};

export const saveQuery = async (orgId: any, body: any) => {
    return http_post('analyticscore/org/' + orgId + '/queryhistory', body);
};

export const updateSavedQuery = async (orgId: any, queryId: any, body: any) => {
    return http_post('analyticscore/org/' + orgId + '/queryhistory/id/' + queryId, body);
};

export const deleteSavedQuery = async (orgId: any, queryId: any) => {
    return http_delete('analyticscore/org/' + orgId + '/queryhistory/id/' + queryId);
};

export const getQueryHistory = async (orgId: any) => {
    return http_get('analyticscore/org/' + orgId + '/queryhistory');
};

export const getRiskAssesmentReport = async (cloudAccountId: any, orgId: any) => {
    return http_get('/analyticscore/org/' + orgId + '/account/' + cloudAccountId + '/riskassesmentreport');
};

//----------------------- BIG QUERY APIS -----------------------------
export const getBigQueryDatasets = async (cloud_account_id: number) => {
    return http_get(BIG_QUERY_DATASET + '?cloud_account_id=' + cloud_account_id);
    // return [
    //     { "classification": "restricted", "id": "TestDataset:tushar-test-project-323910", "name": "TestDataset" },
    //     { "classification": null, "id": "TestingDataSet:tushar-test-project-323910", "name": "TestingDataSet" },
    //     { "classification": null, "id": "TempDataset:vanditatestproject", "name": "TempDataset" },
    //     { "classification": null, "id": "TestDataset1:vanditatestproject", "name": "TestDataset1" }
    // ]
};

export const getDataSetInsights = async (cloudAccountId: number, datasetName: string) => {
    return http_get(DATASET_INSIGHTS_API_URL + '?cloud_account_id=' + cloudAccountId + '&dataset_name=' + datasetName);
    // return {
    //     "id": "tushar-test-project-323910:TestDataset",
    //     "is_encrypted": true,
    //     "is_public": false,
    //     "name": "TestDataset",
    //     "project_name": "Tushar-Test-Project",
    //     "tags": {
    //         "application": "accessops",
    //         "classificationlevel": "restricted",
    //         "component": "bqdataset",
    //         "environment": "development",
    //         "lifecycle": "store",
    //         "org": "tushar-test-project",
    //         "owner": "stackidentity"
    //     }
    // }
};

export const getDatasetTables = async (cloudAccountId: number, datasetName: string) => {
    return http_get(DATASET_TABLES + '?cloud_account_id=' + cloudAccountId + '&dataset_name=' + datasetName);
    // return [
    //     {
    //         "classification": "restrictedl1",
    //         "last_access_in_30_days": 20,
    //         "table_id": "tushar-test-project-323910:TestDataset:DetailedInfo",
    //         "table_name": "DetailedInfo"
    //     }, {
    //         "classification": null,
    //         "last_access_in_30_days": 20,
    //         "table_id": "tushar-test-project-323910:TestDataset:MasterTable",
    //         "table_name": "MasterTable"
    //     }, {
    //         "classification": "restrictedl2",
    //         "last_access_in_30_days": 20,
    //         "table_id": "tushar-test-project-323910:TestDataset:TestFeedback",
    //         "table_name": "TestFeedback"
    //     }, {
    //         "classification": "restrictedl3",
    //         "last_access_in_30_days": 20,
    //         "table_id": "tushar-test-project-323910:TestDataset:TestInfo",
    //         "table_name": "TestInfo"
    //     }, {
    //         "classification": null,
    //         "last_access_in_30_days": 20,
    //         "table_id": "tushar-test-project-323910:TestDataset:TestTable",
    //         "table_name": "TestTable"
    //     }]
};

export const getDatasetIdentities = async (cloudAccountId: number, datasetName: string, userType: string) => {
    return http_get(
        DATASET_IDENTITIES +
            '?cloud_account_id=' +
            cloudAccountId +
            '&dataset_name=' +
            datasetName +
            '&user_type=' +
            userType,
    );
    // if (userType == 'User') {
    //     return [
    //         {
    //             "last_activity": 122232,
    //             "name": "manish@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get",
    //                         "bigquery.datasets.update",
    //                         "bigquery.datasets.create",
    //                         "bigquery.datasets.modify"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "roles/bigquery.admin"
    //             },
    //             "permission_type": "roles/bigquery.admin"
    //         },
    //         {
    //             "last_activity": 122232,
    //             "name": "sanjay@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "WRITER"
    //             },
    //             "permission_type": "WRITER"
    //         },
    //         {
    //             "last_activity": 122232,
    //             "name": "sanjay@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "OWNER"
    //             },
    //             "permission_type": "OWNER"
    //         }]
    // } else {
    //     return [{
    //         "last_activity": 122232,
    //         "name": "tushar@stackidentity.com",
    //         "permission_details": {
    //             "permissions": {
    //                 "Read": [
    //                     "bigquery.datasets.get"
    //                 ],
    //                 "Unknown": [
    //                     "bigquery.models.export"
    //                 ]
    //             },
    //             "role_name": "OWNER"
    //         },
    //         "permission_type": "OWNER"
    //     },
    //     {
    //         "last_activity": 122232,
    //         "name": "allUsers",
    //         "permission_details": {
    //             "permissions": {
    //                 "Read": [
    //                     "bigquery.datasets.get"
    //                 ],
    //                 "Unknown": [
    //                     "bigquery.models.export"
    //                 ]
    //             },
    //             "role_name": "READER"
    //         },
    //         "permission_type": "READER"
    //     }
    //     ]
    // }
};

export const getDatasetActivityLogs = async (cloudAccountId: number, datasetName: string) => {
    return http_get(DATASET_ACTIVITY_LOGS + '?cloud_account_id=' + cloudAccountId + '&dataset_name=' + datasetName);
    // return [{
    //     "activity": "EXPORT",
    //     "date": 1645677965,
    //     "event_details": "0 bytes exported",
    //     "identity": "tushar@stackidentity.com",
    //     "table_name": "TestTable1` AS t0 LIMIT 100; "
    // },
    // {
    //     "activity": "INSERT",
    //     "date": 1645677965,
    //     "event_details": "1 row(s) inserted",
    //     "identity": "tushar@stackidentity.com",
    //     "table_name": "TestTable2"
    // },
    // {
    //     "activity": "EXPORT",
    //     "date": 1645678075,
    //     "event_details": "20 bytes exported",
    //     "identity": "tushar@stackidentity.com",
    //     "table_name": "TestTable1` AS t0 LIMIT 100; "
    // }]
};

export const getIdentityAWSActivityLogs = async (orgId: any, queryId: string, body: any) => {
    return http_post(AWS_SINGLE_IDENTITY_ACTIVITY_LOGS + orgId + '/query/id/' + queryId, body);

    // return [{
    //     "IsConfigChangeEvent": false,
    //     "account_id": 4,
    //     "event_name": "ListObjects",
    //     "event_source": "s3.amazonaws.com",
    //     "event_time": "2022-09-29T06:36:32Z",
    //     "org_id": "4250853635",
    //     "user_identity_principal_id": "AIDAWNFCUEXFIHCJOB3ZS"
    // },]
};

export const getDatasetTableInsights = async (cloudAccountId: number, datasetName: string, tableId: string) => {
    return http_get(
        DATASET_TABLE_INSIGHTS_API_URL +
            '?cloud_account_id=' +
            cloudAccountId +
            '&dataset_name=' +
            datasetName +
            '&table_name=' +
            tableId,
    );
    // return {
    //     "id": "tushar-test-project-323910:TestDataset:DetailedInfo",
    //     "name": "DetailedInfo",
    //     "num_of_times_exported": 25,
    //     "num_of_times_table_accessed": 20,
    //     "tags": {
    //         "application": "accessops",
    //         "classificationlevel": "restrictedl1",
    //         "component": "bqdataset",
    //         "environment": "development",
    //         "lifecycle": "store",
    //         "org": "tushar-test-project",
    //         "owner": "stackidentity"
    //     },
    //     "total_bytes_exported": 42356
    // }
};

export const getTableColumns = async (cloudAccountId: number, datasetName: string, tableId: string) => {
    return http_get(
        SINGLE_TABLE_COLUMNS +
            '?cloud_account_id=' +
            cloudAccountId +
            '&dataset_name=' +
            datasetName +
            '&table_name=' +
            tableId,
    );
    // return [
    //     {
    //         "classification": null,
    //         "col_id": "tushar-test-project-323910:TestDataset:DetailedInfo:DetailedInfoId",
    //         "col_name": "DetailedInfoId"
    //     }, {
    //         "classification": null,
    //         "col_id": "tushar-test-project-323910:TestDataset:DetailedInfo:TestInfoId",
    //         "col_name": "TestInfoId"
    //     }, {
    //         "classification": null,
    //         "col_id": "tushar-test-project-323910:TestDataset:DetailedInfo:MasterId",
    //         "col_name": "MasterId"
    //     }]
};

export const getTableIdentities = async (
    cloudAccountId: number,
    datasetName: string,
    tableId: string,
    userType: string,
) => {
    return http_get(
        SINGLE_TABLE_IDENTITIES +
            '?cloud_account_id=' +
            cloudAccountId +
            '&dataset_name=' +
            datasetName +
            '&table_name=' +
            tableId +
            '&user_type=' +
            userType,
    );
    // if (userType == 'User') {
    //     return [
    //         {
    //             "last_activity": 122232,
    //             "name": "manish@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get",
    //                         "bigquery.datasets.update",
    //                         "bigquery.datasets.create",
    //                         "bigquery.datasets.modify"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "roles/bigquery.admin"
    //             },
    //             "permission_type": "roles/bigquery.admin"
    //         },
    //         {
    //             "last_activity": 122232,
    //             "name": "sanjay@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "WRITER"
    //             },
    //             "permission_type": "WRITER"
    //         },
    //         {
    //             "last_activity": 122232,
    //             "name": "sanjay@stackidentity.com",
    //             "permission_details": {
    //                 "permissions": {
    //                     "Read": [
    //                         "bigquery.datasets.get"
    //                     ],
    //                     "Unknown": [
    //                         "bigquery.models.export"
    //                     ]
    //                 },
    //                 "role_name": "OWNER"
    //             },
    //             "permission_type": "OWNER"
    //         }]
    // } else {
    //     return [{
    //         "last_activity": 122232,
    //         "name": "tushar@stackidentity.com",
    //         "permission_details": {
    //             "permissions": {
    //                 "Read": [
    //                     "bigquery.datasets.get"
    //                 ],
    //                 "Unknown": [
    //                     "bigquery.models.export"
    //                 ]
    //             },
    //             "role_name": "OWNER"
    //         },
    //         "permission_type": "OWNER"
    //     },
    //     {
    //         "last_activity": 122232,
    //         "name": "allUsers",
    //         "permission_details": {
    //             "permissions": {
    //                 "Read": [
    //                     "bigquery.datasets.get"
    //                 ],
    //                 "Unknown": [
    //                     "bigquery.models.export"
    //                 ]
    //             },
    //             "role_name": "READER"
    //         },
    //         "permission_type": "READER"
    //     }
    //     ]
    // }
};
