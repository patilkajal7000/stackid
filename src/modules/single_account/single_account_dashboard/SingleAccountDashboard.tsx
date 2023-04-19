import Skeleton from 'react-loading-skeleton';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';

import { AppState } from 'store/store';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { dashboardBpi } from 'core/services/ApplicationAPIService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import NewDataDashboard from './components/new_data_assets/NewDataDashboard';
import MonthNewsDashboard from './components/news_dashboard/MonthNewsDashboard';
import DataBpiDashboard from './components/data_assets_dashboard/DataBpiDashboard';
import TotalIdentityRisk from './components/identity_risk_dashboard/TotalIdentityRisk';
import IdentityRiskdashboard from './components/identity_risk_dashboard/IdentityRiskdashboard';
import {
    getAppSummaryCounts,
    getRiskyIdSummaryCounts,
    getIdentitySummaryCounts,
    getResourceSummaryCounts,
} from 'core/services/IdentitiesAPIService';
const GCPIdentity = [
    {
        counts: {
            adminPermission: 1,
            credentialExposurePermissions: 22,
            exfiltrationPermissions: 3,
            invisible_access: 1,
            mfaDisabled: 22,
            privilegeEscalationPermissions: 20,
            resourceExposurePermissions: 4,
            total: 22,
            unused_access: 20,
            wildcardPermissions: 6,
        },
        id_type: 'app_user',
    },
    {
        counts: {
            invisible_access: 2,
            total: 2,
        },
        id_type: 'federated',
    },
    {
        counts: {
            adminPermission: 4,
            credentialExposurePermissions: 4,
            excessive_access: 3,
            exfiltrationPermissions: 4,
            invisible_access: 3,
            mfaDisabled: 1,
            privilegeEscalationPermissions: 4,
            resourceExposurePermissions: 4,
            total: 12,
            unused_access: 6,
            wildcardPermissions: 4,
        },
        id_type: 'human_user',
    },
    {
        counts: {
            adminPermission: 3,
            credentialExposurePermissions: 29,
            exfiltrationPermissions: 44,
            invisible_access: 5,
            privilegeEscalationPermissions: 26,
            resourceExposurePermissions: 34,
            total: 176,
            unused_access: 52,
            wildcardPermissions: 143,
        },
        id_type: 'role',
    },
];
const TimeArray = ['DAILY', 'WEEKLY', 'MONTHLY'];

const SingleAccountDashboard = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams<any>();
    const type = params?.type ? params?.type : 'aws_S3';

    const [identitiesRisk] = useState({});
    const [interval, setInterval] = useState<number>(720);

    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id || '';
    const cloudAccountType: any = params?.cloudAccountType;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const [selectedTime, setSelectedTime] = useState<string>(cloudAccountType == 'GCP' ? 'DAILY' : 'MONTHLY');

    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    // Interval
    const getInterval = (timeValue: any) => {
        if (timeValue === 'DAILY') {
            setInterval(24);
        }
        if (timeValue === 'WEEKLY') {
            setInterval(168);
        }
        if (timeValue === 'MONTHLY') {
            setInterval(720);
        }
    };

    const {
        data: summaryCounts,
        isLoading: loadingIdentity,
        isError: summaryCountsError,
        refetch: getIdentitySummary,
    } = getIdentitySummaryCounts(orgId, cloudAccountId, interval, discoveryId);

    const { data: bpiData, isLoading: loadingBpi, isError: bpiDataError } = dashboardBpi(orgId, cloudAccountId);

    const {
        data: bpiNewData,
        isLoading: loadingResourceIdentity,
        refetch: getResourceIdentity,
        isError: bpiNewDataError,
    } = getResourceSummaryCounts(orgId, cloudAccountId, interval, ['all'], discoveryId);

    const {
        data: applicationData,
        isLoading: loadingApplication,
        isError: applicationDataError,
        refetch: getApplicationSummary,
    } = getAppSummaryCounts(orgId, cloudAccountId, interval, discoveryId);

    const {
        data: riskyIdentitiesData,
        isLoading: loadingRiskyIdentities,
        isError: riskyIdentitiesDataError,
        refetch: getRiskyIdSummary,
    } = getRiskyIdSummaryCounts(orgId, cloudAccountId, discoveryId);
    useEffect(() => {
        if (cloudAccountType == 'GCP') {
            const text: any = location.pathname;
            const path: any = text.replace('gcp_IAMUser', 'bq_Dataset');
            navigate({
                pathname: `${path}`,
            });
        }
    }, []);

    const gotoSingleBucket = (bucketData: any) => {
        const text: any = location.pathname;

        const path: any = text.replace('dashboard', 'data_assets');
        if (cloudAccountType == 'GCP') {
            navigate({
                pathname: `${path}/${bucketData?.root_resource}/${NAV_TABS_VALUE.TABLES}`,
            });
        } else {
            navigate({
                pathname: `${path}/${bucketData?.root_resource}/${NAV_TABS_VALUE.RISK_MAP}`,
            });
        }
    };

    useEffect(() => {
        if (discoveryId != 0) {
            getApplicationSummary();
            getIdentitySummary();
            getRiskyIdSummary();
            getResourceIdentity();
        }
    }, [discoveryId, interval]);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                { name: 'Dashboard', path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, ''));
    }, []);

    const Filter = () => {
        return (
            <div className="float-end d-flex align-items-center border-neutral-700 w-130 rounded">
                <div className="w-100">
                    <CDropdown placement="bottom" className=" p-2 w-100">
                        <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                            {selectedTime || 'Select Time'}
                        </CDropdownToggle>
                        <CDropdownMenu>
                            {TimeArray.map((item: any, key: number) => {
                                return (
                                    <CDropdownItem
                                        key={key}
                                        onClick={() => {
                                            getInterval(item);
                                            setSelectedTime(item);
                                        }}
                                    >
                                        {item}
                                    </CDropdownItem>
                                );
                            })}
                        </CDropdownMenu>
                    </CDropdown>
                </div>
            </div>
        );
    };

    return (
        <div className="container dashboard-main mt-3">
            <div className="row">
                <div className="col-xl-8 col-lg-12">
                    {summaryCountsError ? (
                        ''
                    ) : (
                        <div className="border col-md-12 py-2 px-3 rounded">
                            {loadingIdentity ? (
                                <div className="d-flex justify-content-around container">
                                    <Skeleton className="p-5 m-4" />
                                    <Skeleton className="p-5 m-4" />
                                    <Skeleton className="p-5 m-4" />
                                    <Skeleton className="p-5 m-4" />
                                </div>
                            ) : (
                                <>
                                    {Filter()}
                                    <MonthNewsDashboard
                                        discoveryId={discoveryId}
                                        type={type}
                                        orgId={orgId}
                                        accountId={cloudAccountId}
                                        interval={interval}
                                        summaryCounts={summaryCounts}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {bpiNewDataError ? (
                        ''
                    ) : (
                        <div className="border col-md-12 py-2 mt-3 px-3 rounded">
                            {loadingResourceIdentity ? (
                                <div className="d-flex justify-content-around container">
                                    <Skeleton className="p-5 m-4" />
                                    <Skeleton className="p-5 m-4" />
                                    <Skeleton className="p-5 m-4" />
                                </div>
                            ) : (
                                <>
                                    {Filter()}
                                    <NewDataDashboard
                                        discoveryId={discoveryId}
                                        type={type}
                                        loadingBpi={loadingBpi}
                                        bpiData={bpiNewData}
                                        orgId={orgId}
                                        accountId={cloudAccountId}
                                        interval={interval}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {bpiDataError ? (
                        ''
                    ) : (
                        <div className="col-12">
                            <div>
                                {loadingBpi ? (
                                    <div className="container border mt-3 mb-3">
                                        <Skeleton height={80} className="mx-0 me-5" />
                                        <Skeleton height={80} className="mx-0 me-5" />
                                        <Skeleton height={80} className="mx-0 me-5" />
                                        <Skeleton height={80} className="mx-0 me-5" />
                                        <Skeleton height={80} className="mx-0 me-5" />
                                    </div>
                                ) : (
                                    <div className="col-md-12 border mt-3 mb-3 rounded">
                                        <DataBpiDashboard
                                            type={type}
                                            onClickRow={gotoSingleBucket}
                                            loadingBpi={loadingBpi}
                                            bpiData={bpiData}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-xl-4 col-lg-6">
                    {riskyIdentitiesDataError ? (
                        ''
                    ) : (
                        <div className="border p-3 rounded">
                            {loadingRiskyIdentities ? (
                                <div className="container">
                                    <Skeleton height={80} className="mx-0 me-5" />
                                    <Skeleton height={120} className="mx-0 me-5" />
                                    <Skeleton height={150} className="mx-0 me-5" />
                                    <Skeleton height={120} className="mx-0 me-5" />
                                </div>
                            ) : (
                                <>
                                    {type == 'bq_Dataset' && (
                                        <IdentityRiskdashboard
                                            type={type}
                                            orgId={orgId}
                                            accountId={cloudAccountId}
                                            riskyData={GCPIdentity}
                                            identitiesRisk={identitiesRisk}
                                        />
                                    )}
                                    {riskyIdentitiesData && riskyIdentitiesData.length > 0 && (
                                        <IdentityRiskdashboard
                                            type={type}
                                            orgId={orgId}
                                            accountId={cloudAccountId}
                                            riskyData={riskyIdentitiesData}
                                            identitiesRisk={identitiesRisk}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {applicationDataError ? (
                        ''
                    ) : (
                        <div className="border p-3 mt-3 rounded">
                            {loadingApplication ? (
                                <div className="container d-flex">
                                    <Skeleton height={120} width={110} className="mx-0 me-2" />
                                    <Skeleton height={120} width={110} className="mx-0 me-2" />
                                    <Skeleton height={120} width={110} className="mx-0 me-0" />
                                </div>
                            ) : (
                                applicationData &&
                                applicationData.length > 0 && (
                                    <>
                                        {Filter()}
                                        <TotalIdentityRisk
                                            discoveryId={discoveryId}
                                            data={applicationData}
                                            type={type}
                                            orgId={orgId}
                                            accountId={cloudAccountId}
                                            interval={interval}
                                        />
                                    </>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default SingleAccountDashboard;
