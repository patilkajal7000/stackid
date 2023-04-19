import { getApplicationDetailsList } from 'core/services/DataEndpointsAPIService';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState } from 'store/store';
import ApplicationsInstaceTable from './InstanceTable';

function ApplicationDetails() {
    const params = useParams<any>();
    const instanceId: any = params.instanceid;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id;
    const {
        data: applicationList,
        isLoading: loading,
        isError: error,
    } = getApplicationDetailsList(cloudAccountId, orgId, discoveryId, instanceId);

    return applicationList || error ? (
        <ApplicationsInstaceTable applicationsData={applicationList} isError={error} />
    ) : (
        <>
            {loading && (
                <div className="container mt-3">
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        <tbody>
                            <tr>
                                <td>
                                    <Skeleton count={10} height={48} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default ApplicationDetails;
