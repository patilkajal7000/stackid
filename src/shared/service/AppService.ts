import { getAllCloudAccounts } from 'core/services/CloudaccountsAPIService';
import { useLocation } from 'react-router';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { DiscoveryStatusModel } from 'shared/models/DiscoveryStatusModel';
import { setCloudAccountsAction, setSelectedCloudAction } from 'store/actions/CloudAccountActions';
import store from 'store/store';

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

/**
 * Filter the array to a map with key as keyToFiler from original Array and values as original Array having the same keys
 * @param originalArray : Array of objects
 * @param keyToFilter : Key from which Array of object been filtered
 * @returns {key: Array having values == key}
 */
export const getMapOfUniqueKeysAndValues = (originalArray: Array<any>, keyToFilter: string) => {
    return originalArray.reduce((items: any, item: any) => {
        const data = items[item[keyToFilter]] || [];
        items[item[keyToFilter]] = [...data, item];
        return items;
    }, {});
};

/**
 * Return the unique array filtered with given filterItems as keys
 * @param originalArray : Array of objects
 * @param filterItems : Keys from which Array of object been filtered
 * @returns [Array having unique values of given keys]
 */
export const filterUniqueitemsWithGivenKeys = (originalArray: Array<any>, filterItems: Array<string>) => {
    return originalArray.reduce((accumulator: any, current: any) => {
        if (checkIfAlreadyExist(current)) {
            return accumulator;
        } else {
            return [...accumulator, current];
        }
        function checkIfAlreadyExist(currentVal: any) {
            return accumulator.some((item: any) => {
                return filterItems.every((filterItem: any) => item[filterItem] === currentVal[filterItem]);
            });
        }
    }, []);
};

/**
 * Sort an object as given order of array
 * @param orignalMap Map of object to be sort
 * @param orderArray The order in which orignalMap to be sorted
 * @returns sorted orignalMap
 */
export const sortObjectByGivenOrder = (orignalMap: Record<string, Array<any>>, orderArray: Array<string>) => {
    const dataKeys = Object.keys(orignalMap);
    return orderArray.reduce((items: any, item: any) => {
        if (dataKeys.includes(item)) {
            items[item] = orignalMap[item];
        }
        return items;
    }, {});
};

export const generateUID = (name: string) => {
    function _random_letter() {
        return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    function _p8(s: any) {
        const p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : _random_letter() + p.substr(0, 7);
    }
    return name + _p8(false) + _p8(true) + _p8(true) + _p8(false);
};

/**
 * Get cloud account name for a given cloud account id. If cloudaccount details for the given cloudAccountId is present in the store
 * then return the name of that cloud account. Otherwise fetch the cloudaccount details using API, dispatch action to store it in the redux store
 * and return the name if cloud account.
 * @param cloud account id
 * @returns Return Promise <string>
 */
export const getCloudAccountNameById = async (cloudAccountId: number) => {
    const cloudAccounts = (await getAllCloudAccounts()) as CloudAccountModel[];
    return new Promise(function (resolve, reject) {
        if (cloudAccountId) {
            const cloudAccountState = store.getState().cloudAccountState;

            if (cloudAccountState.selectedCloudAccount && cloudAccountState.cloudAccounts.length > 0) {
                const selectedCloudAccount: CloudAccountModel[] = cloudAccountState.cloudAccounts.filter(
                    (c) => +c.id === cloudAccountId,
                );

                resolve(selectedCloudAccount[0]?.name);
            } else {
                try {
                    const selectedCloudAccount: CloudAccountModel[] = cloudAccounts.filter(
                        (c) => +c.id === cloudAccountId,
                    );
                    if (selectedCloudAccount.length > 0) {
                        store.dispatch(setCloudAccountsAction(cloudAccounts));
                        store.dispatch(setSelectedCloudAction(cloudAccountId.toString()));
                        resolve(selectedCloudAccount[0]?.name);
                    }
                } catch (err) {
                    console.log('Error: ', err);
                    reject(err);
                }
            }
        }
        reject('Invalid cloud account id' + cloudAccountId);
    });
};

export const checkForDiscoveryStatusValue = (discoveryStatus: DiscoveryStatusModel) => {
    if (discoveryStatus) {
        if (discoveryStatus?.start_time?.RESOURCE_DISCOVERY) {
            if (discoveryStatus?.start_time?.APPLICATION_DISCOVERY) {
                // In case of if Application disocvery has started
                return 1;
            } else {
                // In case of if Resource discovery disocvery has started
                return 0;
            }
        } else {
            // In case of if discovery is started but nothing has been updated
            return -1;
        }
    } else {
        // In case of if discovery is yet to get started from backend
        return -1;
    }
};
