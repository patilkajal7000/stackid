import { getAllCloudAccountsWithDiscoveryStatus } from 'core/services/CloudaccountsAPIService';
import { CLOUDACCOUNTINITIALSETUP } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import SpinnerLoader from 'shared/components/loaders/SpinnerLoader';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setCloudAccountsAction } from 'store/actions/CloudAccountActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { AppState } from 'store/store';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cloudAccountsState = useSelector((state: AppState) => state.cloudAccountState);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(setTabsAction('', '', '')); //to hide subheader
        dispatch(setBreadcrumbAction([])); //to hide breadcrumb
        /** If we dont have cloudaccounts in our account the user should directly land of the initial setup screen  */
        if (!cloudAccountsState.getDataCalled) {
            getCloudAccounts();
        } else if (cloudAccountsState.cloudAccounts.length === 0) {
            navigate(CLOUDACCOUNTINITIALSETUP);
        }
    }, []);

    const getCloudAccounts = () => {
        setIsLoading(true);
        getAllCloudAccountsWithDiscoveryStatus()
            .then((response: any) => {
                const cloudAccounts = response as CloudAccountModel[];
                dispatch(setCloudAccountsAction(cloudAccounts));
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="text-center mt-5">
            {isLoading ? <SpinnerLoader /> : <span className="h1 ">Dashboard coming soon!</span>}
        </div>
    );
};

export default Dashboard;
