import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { DiscoveryStatusModel } from 'shared/models/DiscoveryStatusModel';
import { CloudAccountActions } from 'shared/models/ReduxModels/ActionModels';
import { CloudAccountState } from 'shared/models/ReduxModels/ReducerModels';
import {
    CLEAR_CLOUD_ACCOUNTS,
    SET_CLOUD_ACCOUNTS,
    SET_SELECTED_CLOUD_ACCOUNT,
    UPDATE_DISCOVERY_CLOUD_ACCOUNTS,
} from '../actions/ActionConstants';

const initialState: CloudAccountState = {
    cloudAccounts: [],
    selectedCloudAccount: undefined,
    getDataCalled: false,
};

export const cloudAccounReducer = (
    state: CloudAccountState = initialState,
    action: CloudAccountActions,
): CloudAccountState => {
    switch (action.type) {
        case SET_CLOUD_ACCOUNTS:
            return { ...state, cloudAccounts: action.cloudAccounts, getDataCalled: true };
        case SET_SELECTED_CLOUD_ACCOUNT:
            return {
                ...state,
                selectedCloudAccount: state.cloudAccounts.find(
                    (cloudAccount: CloudAccountModel) =>
                        cloudAccount.id.toString() === action.selectedCloudAccountId.toString(),
                ),
            };
        case UPDATE_DISCOVERY_CLOUD_ACCOUNTS: {
            const oldCloudAccountState = [...state.cloudAccounts];
            action.discoveryStatus.map((discovery: DiscoveryStatusModel) => {
                const elementsIndex = state.cloudAccounts.findIndex(
                    (element: CloudAccountModel) => element.id === discovery.cloud_account_id,
                );
                oldCloudAccountState[elementsIndex] = {
                    ...oldCloudAccountState[elementsIndex],
                    discovery_status: discovery,
                };
            });
            return { ...state, cloudAccounts: oldCloudAccountState };
        }
        case CLEAR_CLOUD_ACCOUNTS:
            return { ...initialState };
        default:
            return state;
    }
};
