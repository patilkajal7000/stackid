import {
    CLOUDACCOUNT_URL,
    getAllCloudAccountsWithDiscoveryStatus,
    getCloudAccountsDiscoveryStatus,
} from 'core/services/CloudaccountsAPIService';
import type { Dispatch } from 'redux';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { DiscoveryStatusModel } from 'shared/models/DiscoveryStatusModel';
import { BASE_URL } from 'shared/utils/Constants';
import { updateDiscoveryCloudAccountsAction, setCloudAccountsAction } from 'store/actions/CloudAccountActions';

const DISCOVERY_STATUS_URL = BASE_URL + '/' + CLOUDACCOUNT_URL + '/status/';

/**
 * Method for subscribing to SSE(Server Sent Events)
 * @param id: string of cloudccountid whose discovery has started
 */
export const subscribeDiscoveryStatusService = (id: any, dispatch: Dispatch, accessToken?: string) => {
    const eventSource = new EventSource(DISCOVERY_STATUS_URL + id + '?access_token=' + accessToken);
    eventSource.onmessage = (e: any) => {
        const cloudAccountdiscoveryStatus = JSON.parse(e.data) as DiscoveryStatusModel[];
        // Check if any discovery is currently running
        const discoveryStatus = cloudAccountdiscoveryStatus.some(
            (discovery: DiscoveryStatusModel) => !discovery.isDiscoveryComplete,
        );

        if (discoveryStatus) {
            dispatch(updateDiscoveryCloudAccountsAction(cloudAccountdiscoveryStatus));
        } else {
            dispatch(updateDiscoveryCloudAccountsAction(cloudAccountdiscoveryStatus));
            eventSource.close();
        }
    };
    eventSource.onerror = (e: any) => {
        console.log('error', e);
        // eventSource.close();
    };
    return eventSource;
};

/**
 * Method for subscribing to SSE(Server Sent Events)
 * @param id: string of cloudccountid whose discovery has started
 */
export const getDiscoveryStatus = (ids: any, dispatch: Dispatch) => {
    const interval = setInterval(
        () =>
            getCloudAccountsDiscoveryStatus(ids).then((res: any) => {
                const cloudAccountdiscoveryStatus = res as DiscoveryStatusModel[];
                // Check if any discovery is currently running
                const discoveryStatus = cloudAccountdiscoveryStatus.some(
                    (discovery: DiscoveryStatusModel) => !discovery.isDiscoveryComplete,
                );

                if (discoveryStatus) {
                    dispatch(updateDiscoveryCloudAccountsAction(cloudAccountdiscoveryStatus));
                } else {
                    getAllCloudAccountsWithDiscoveryStatus().then((response: any) => {
                        const cloudAccounts = response as CloudAccountModel[];
                        dispatch(setCloudAccountsAction(cloudAccounts));
                    });
                    clearInterval(interval);
                }
            }),
        30000,
    );
    return interval;
};
