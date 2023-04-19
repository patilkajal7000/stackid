import React from 'react';
const Views = React.lazy(() => import('./views/Views'));
const Inventory = React.lazy(() => import('./resource_inventory/resource_inventory'));
const RiskDetail = React.lazy(() => import('./actions/RiskAnalyticsDetail'));
const SignelElementViews = React.lazy(() => import('./views/singleElementView'));
const SingelPolicyView = React.lazy(() => import('./policy/singlePolicy/SinglePolicy'));
const SingelRiskDetailsView = React.lazy(() => import('./RiskDetails'));
const SingelDataAssetIdentityView = React.lazy(
    () => import('./data_endpoints/single_data_asset_identity/DataAssetIdentity'),
);
const SingelDataAssetApplicationView = React.lazy(
    () => import('./data_endpoints/single_data_assets_application/SingleApplication'),
);
const SingelDataetTableView = React.lazy(
    () =>
        import(
            './data_endpoints/single_data_element/bigquery_dataset/components/tables_tab/single_dataset_table/SingleDatasetTable'
        ),
);
/* --------------- SINGLE ACCOUNT URL PARAMETERS ------------- */
const PARAMS_ACCOUNT_ID = '/:cloudAccountId';
const PARAMS_ACCOUNT_TYPE = '/:cloudAccountType';
const PARAMS_RESOURCE_TYPE = '/:type';
const PARAMS_RESOURCE_ID = '/:rid';
const PARAMS_TAB_NAME = '/:tName';
const PARAMS_SIGNEL_ELEMENT_TAB_NAME = '/:SETName';
const SINGLE_DATA_ELEMENT_IDENTITY_ID = '/:sid';
const SINGLE_DATA_ELEMENT_APPLICATION_ID = '/:sid';
const SINGLE_DATA_ELEMENT_INSTANCE_ID = '/:instanceid';
const SINGLE_DATA_ELEMENT_IDENTITY_TYPE = '/:sidtype';

const SINGLE_DATA_ELEMENT_IDENTITY_TAB_NAME = '/:sidName';
const SINGLE_DATA_SET_TABLE_ID = '/:datasetTableId'; // for big query single dataset table
const SINGLE_DATA_SET_TABLE_TAB_NAME = '/:datasetTableTabName';

/* --------------- ACCOUNTS URL ------------- */
export const ACCOUNTS_URL = '/accounts';
export const POLICY = '/policy';
export const ACCOUNTS = '/accounts' + PARAMS_ACCOUNT_ID + PARAMS_ACCOUNT_TYPE;

/* --------------- INVENTORY URL ------------- */

export const INVENTORY_URL = ACCOUNTS_URL + '/resource_inventory';

/* --------------- RISK DETAIL URL ------------- */

export const RISKDETAIL_URL = ACCOUNTS + '/Risks/Overview/:ruleId/:resourceId';
// export const RISKDETAIL_URL = ACCOUNTS + '/Risks/Overview/risk-detail';
/* --------------- ENDPOINTS SCREENS URL ------------- */
export const OVERVIEW_SCREEN = ACCOUNTS + PARAMS_TAB_NAME + PARAMS_RESOURCE_TYPE;
export const SINGLE_DATA_ELEMENT = OVERVIEW_SCREEN + PARAMS_RESOURCE_ID + PARAMS_SIGNEL_ELEMENT_TAB_NAME;
export const SINGLE_DATA_ASSET_IDENTITIES_URL =
    SINGLE_DATA_ELEMENT +
    '/identities' +
    SINGLE_DATA_ELEMENT_IDENTITY_ID +
    SINGLE_DATA_ELEMENT_IDENTITY_TYPE +
    SINGLE_DATA_ELEMENT_IDENTITY_TAB_NAME;

export const SINGLE_DATA_SET_TABLE_URL =
    SINGLE_DATA_ELEMENT + '/table' + SINGLE_DATA_SET_TABLE_ID + SINGLE_DATA_SET_TABLE_TAB_NAME;

export const SINGLE_ACCOUNT_URL = {
    ACCOUNTS_URL,
    OVERVIEW_SCREEN,
    SINGLE_DATA_ELEMENT,
};

// export const SINGLE_POLICY_URL = OVERVIEW_SCREEN + PARAMS_RESOURCE_ID;
export const SINGLE_POLICY_URL = OVERVIEW_SCREEN + PARAMS_RESOURCE_ID;
export const SINGLE_DATA_ASSET_APPLICATION_URL =
    ACCOUNTS +
    '/Applications/Overview' +
    SINGLE_DATA_ELEMENT_APPLICATION_ID +
    SINGLE_DATA_ELEMENT_INSTANCE_ID +
    PARAMS_TAB_NAME;

export const SINGLE_RISK_DETAILS = 'riskDetails';
export default [
    {
        routeProps: {
            path: SINGLE_DATA_ASSET_IDENTITIES_URL,
            component: SingelDataAssetIdentityView,
            name: 'Single Data Asset Identity View',
        },
        name: 'Single Data Asset Identity View',
    },
    {
        routeProps: {
            path: SINGLE_DATA_ASSET_APPLICATION_URL,
            component: SingelDataAssetApplicationView,
            name: 'Single Data Asset Application View',
        },
        name: 'Single Data Asset Application View',
    },
    {
        routeProps: {
            path: SINGLE_DATA_SET_TABLE_URL,
            component: SingelDataetTableView,
            name: 'Single Dataset Table View',
        },
        name: 'Single Dataset Table View',
    },
    {
        routeProps: {
            path: SINGLE_POLICY_URL,
            component: SingelPolicyView,
            name: 'Single Policy View',
        },
        name: 'Single Policy View',
    },
    {
        routeProps: {
            path: SINGLE_RISK_DETAILS,
            component: SingelRiskDetailsView,
            name: 'risk',
        },
        name: 'risk',
    },

    {
        routeProps: {
            path: SINGLE_DATA_ELEMENT,
            component: SignelElementViews,
            name: 'Single Element Views',
        },
        name: 'Single Element Views',
    },
    {
        routeProps: {
            path: OVERVIEW_SCREEN,
            component: Views,
            name: 'Views',
        },
        name: 'Views',
    },
    {
        routeProps: {
            path: INVENTORY_URL,
            component: Inventory,
            name: 'Inventory',
        },
        name: 'Inventory',
    },
    {
        routeProps: {
            path: RISKDETAIL_URL,
            component: RiskDetail,
            name: 'RiskDetail',
        },
        name: 'RiskDetail',
    },
];
