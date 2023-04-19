import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { DiscoveryStatusModel } from 'shared/models/DiscoveryStatusModel';
import {
    AddCloudAccountsAction,
    SelectedCloudClountAction,
    UpdateDiscoveryCloudAccounts,
} from 'shared/models/ReduxModels/ActionModels';
import { SET_CLOUD_ACCOUNTS, SET_SELECTED_CLOUD_ACCOUNT, UPDATE_DISCOVERY_CLOUD_ACCOUNTS } from './ActionConstants';

export const setCloudAccountsAction = (cloudAccounts: CloudAccountModel[]): AddCloudAccountsAction => {
    return {
        type: SET_CLOUD_ACCOUNTS,
        cloudAccounts,
    };
};

export const setSelectedCloudAction = (selectedCloudAccountId: string): SelectedCloudClountAction => {
    return {
        type: SET_SELECTED_CLOUD_ACCOUNT,
        selectedCloudAccountId,
    };
};

export const updateDiscoveryCloudAccountsAction = (
    discoveryStatus: DiscoveryStatusModel[],
): UpdateDiscoveryCloudAccounts => {
    return {
        type: UPDATE_DISCOVERY_CLOUD_ACCOUNTS,
        discoveryStatus,
    };
};
