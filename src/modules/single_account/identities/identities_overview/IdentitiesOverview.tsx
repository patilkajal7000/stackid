import { AxiosError } from 'axios';
import { getRiskyIdSummaryCounts, getRiskyIdSummaryDetails } from 'core/services/IdentitiesAPIService';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CloudAccountProvider } from 'shared/models/CloudAccountModel';
import { AppState } from 'store/store';
import AWSIdentitiesOverview from './aws_identities/AWSIdentitiesOverview';
import GCPIdentitiesOverview from './gcp_identities/GCPIdentitiesOverview';

const IdentitiesOverview = () => {
    const params = useParams<any>();
    const cloudAccountType = params?.cloudAccountType;
    const [identityType, setIdentityType] = useState<any>('human_user');
    const [identityNames, setIdentityNames] = useState<any>([]);
    const [accessCounts, setAccessCounts] = useState<any>({
        invisible_access: 0,
        excessive_access: 0,
        unused_access: 0,
    });
    const [accessType, setAccessType] = useState<any>([]);
    const [refreshData, setRefreshData] = useState(false);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id || '';

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    const { data: riskyIdentitiesData, refetch: refetchAccessCounts } = getRiskyIdSummaryCounts(
        orgId,
        cloudAccountId,
        discoveryId,
    );

    useEffect(() => {
        if (discoveryId) refetchAccessCounts();
        if (riskyIdentitiesData) {
            const setAccessCount = (data: any) => {
                setAccessCounts({
                    invisible_access: data?.invisible_access ? data?.invisible_access : 0,
                    excessive_access: data?.excessive_access ? data?.excessive_access : 0,
                    unused_access: data?.unused_access ? data?.unused_access : 0,
                });
            };

            riskyIdentitiesData?.map((data: any) => {
                if (identityType === data?.id_type) setAccessCount(data?.counts);
            });
        }
    }, [riskyIdentitiesData, identityType, discoveryId]);

    const getSummaryDetails = (riskType: any) => {
        //setTableDetailsLoading(true);
        setIdentityNames([]);
        setAccessType(riskType);

        const body = {
            discoveryId: `${discoveryId}`,
            accountId: `${cloudAccountId}`,
            idType: identityType, //human_user/app_user/federated/role/all   default value is all
            riskType: riskType, //excessive_access/invisible_access/unused_access/all   default value is all
        };
        getRiskyIdSummaryDetails(body, orgId)
            .then((res: any) => {
                res.map((id: any) => {
                    setIdentityNames((identityNames: any) => [...identityNames, id?.identity_name]);
                });
            })
            .catch((err: AxiosError) => {
                //setTableDetailsLoading(false);
                console.log('Error: ', err);
            });
    };

    return (
        <>
            {cloudAccountType == CloudAccountProvider.AWS && (
                <AWSIdentitiesOverview
                    identityNames={identityNames}
                    setIdentityType={setIdentityType}
                    accessCounts={accessCounts}
                    getSummaryDetails={getSummaryDetails}
                    accessType={accessType}
                    setRefreshData={setRefreshData}
                    refresh={refreshData}
                />
            )}
            {cloudAccountType == CloudAccountProvider.GCP && (
                <GCPIdentitiesOverview
                    identityNames={identityNames}
                    setIdentityType={setIdentityType}
                    accessCounts={accessCounts}
                    getSummaryDetails={getSummaryDetails}
                />
            )}
        </>
    );
};

export default IdentitiesOverview;
