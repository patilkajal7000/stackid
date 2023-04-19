import { lazy } from 'react';

const AddCloudAccount = lazy(() => import('./add_cloud_account/AddCloudAccount'));
const CloudAccounts = lazy(() => import('./cloud_accounts_list/CloudAccounts'));
const InitialSetup = lazy(() => import('./initial_setup/InitialSetup'));

export const CLOUDACCOUNT = '/accounts';
export const CLOUDACCOUNTINITIALSETUP = '/accounts/initial-setup';
export const CLOUDACCOUNTPROFILESETUP = '/accounts/profile';
export const CLOUDACCOUNTADD = '/accounts/add-cloudaccounts';

export default [
    {
        routeProps: {
            path: CLOUDACCOUNT,
            component: CloudAccounts,
            name: 'All Cloud Accounts',
        },

        name: 'CloudAccounts',
    },
    {
        routeProps: {
            path: CLOUDACCOUNTADD,
            component: AddCloudAccount,
            name: 'AddCloudAccount',
        },
        name: 'AddCloudAccount',
    },
    {
        routeProps: {
            path: CLOUDACCOUNTINITIALSETUP,
            component: InitialSetup,
            name: 'InitialSetup',
        },
        name: 'InitialSetup',
    },
];
