import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from 'shared/components/search_input/SearchInput';
import { getApplications } from 'core/services/DataEndpointsAPIService';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import Skeleton from 'react-loading-skeleton';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import ApplicationsTable from './ApplicationsTable';
import CIcon from '@coreui/icons-react';
import { cilScreenDesktop, cilStorage } from '@coreui/icons';
import { setTabsAction } from 'store/actions/TabsStateActions';

const FilterItems: any = [
    { id: 0, name: 'Application Name' },
    { id: 1, name: 'Type' },
    { id: 2, name: 'Group Type' },
    { id: 3, name: 'Sub Type' },
    { id: 4, name: 'Exposed To Internet' },
    { id: 5, name: 'Environment' },
];
interface TabSelect {
    Compute: boolean;
    Serverless: boolean;
}

const ApplicationsOverview = () => {
    const { t } = useTranslation();
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [applicationsData, setApplicationsData] = useState<any>();
    const [displayData, setDisplayData] = useState<any>();
    const [tabSelected, setTabSelected] = useState<TabSelect>({ Compute: false, Serverless: false });
    const [isError, setIsError] = useState(false);
    const [, setIsLoading] = useState(false);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const params = useParams<any>();
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, ''));
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: NAV_TABS_VALUE.APPLICATIONS,
                    path: '', // CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/' + NAV_TABS_VALUE.APPLICATIONS,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
    }, []);

    useEffect(() => {
        getApplications(orgId, cloudAccountId, discoveryId)
            .then((response: any) => {
                setIsLoading(false);
                setApplicationsData(response);
                setDisplayData(response);
            })
            .catch((error: any) => {
                console.log('Error', error);
                setIsError(true);
                setIsLoading(false);
            });
    }, []);
    const naviagateToSingleApplicationScreen = (appId: string, app: any) => {
        const instanceDetail = app?.application_details ? JSON.parse(app?.application_details) : [];
        navigate(
            `/accounts/${cloudAccountId}/${cloudAccountType}/Applications/Overview/${appId}/${instanceDetail[0].id}/${NAV_TABS_VALUE.APPLICATIONS_DETAILS}`,
            { state: app },
        );
    };
    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedItems = applicationsData?.filter((data: any) => {
                    switch (selectedFilerValue) {
                        case 0:
                            return data?.application_name.toLowerCase().includes(searchString.toLowerCase());
                        case 1:
                            return data?.application_type.toLowerCase().includes(searchString.toLowerCase());
                        case 2:
                            return data?.application_group_type.toLowerCase().includes(searchString.toLowerCase());
                        case 3:
                            return data?.application_sub_type.toLowerCase().includes(searchString.toLowerCase());
                        case 4:
                            return data?.exposed_to_internet
                                .toString()
                                .toLowerCase()
                                .includes(searchString.toLowerCase());
                        case 5:
                            return data?.application_environment.toLowerCase().includes(searchString.toLowerCase());
                        default:
                            return data;
                    }
                });
                if (selectedItems && selectedItems.length > 0) {
                    setDisplayData(selectedItems);
                    callback && callback('');
                } else {
                    setDisplayData(undefined);
                    callback && callback('No Items found.');
                }
            } else {
                setDisplayData(applicationsData);
            }
        },
        [applicationsData, selectedFilerValue],
    );

    const onTabChange = (type: string) => {
        // Multi select tabs
        const selectedItems = applicationsData?.filter((data: any) => {
            if (tabSelected.Compute === false && tabSelected.Serverless === false) {
                if (type === 'compute' && data?.application_type === 'compute') {
                    setTabSelected({ Compute: true, Serverless: false });
                    return data;
                } else if (type === 'serverless' && data?.application_type === 'serverless') {
                    setTabSelected({ Compute: false, Serverless: true });
                    return data;
                }
            }
            if (tabSelected.Compute === true && tabSelected.Serverless === false) {
                if (type === 'compute') {
                    setTabSelected({ Compute: false, Serverless: false });
                    return data;
                } else if (type === 'serverless') {
                    setTabSelected({ Compute: true, Serverless: true });
                    return data;
                }
            }
            if (tabSelected.Compute === false && tabSelected.Serverless === true) {
                if (type === 'compute') {
                    setTabSelected({ Compute: true, Serverless: true });
                    return data;
                } else if (type === 'serverless') {
                    setTabSelected({ Compute: false, Serverless: false });
                    return data;
                }
            }
            if (tabSelected.Compute === true && tabSelected.Serverless === true) {
                if (type === 'compute' && data?.application_type !== 'compute') {
                    setTabSelected({ Compute: false, Serverless: true });
                    return data;
                } else if (type === 'serverless' && data?.application_type !== 'serverless') {
                    setTabSelected({ Compute: true, Serverless: false });
                    return data;
                }
            }
        });
        setDisplayData(selectedItems);
    };

    return (
        <>
            <div
                className="container mt-4 mb-3 d-flex"
                data-si-qa-key={`applications-mainTabs-${tabSelected}`}
                style={{ overflow: 'hidden' }}
            >
                <div
                    data-si-qa-key={`applications-mainTab-Compute-${tabSelected.Compute}`}
                    role="presentation"
                    className={`${
                        tabSelected.Compute ? `border-card-active` : `border-card`
                    } border me-2 py-2 px-4 pointer d-flex align-items-center rounded`}
                    onClick={() => {
                        onTabChange('compute');
                    }}
                >
                    <div className="pe-2 float-start">
                        <CIcon icon={cilScreenDesktop} size="xl" />
                    </div>
                    <div className="font-small-semibold p-1">Compute</div>
                </div>
                <div
                    data-si-qa-key={`applications-mainTab-Serverless-${tabSelected.Serverless}`}
                    role="presentation"
                    className={`${
                        tabSelected.Serverless ? `border-card-active` : `border-card`
                    } border me-2 py-2 px-4 pointer d-flex align-items-center rounded`}
                    onClick={() => {
                        onTabChange('serverless');
                    }}
                >
                    <div className="pe-2 float-start">
                        <CIcon icon={cilStorage} size="xl" />
                    </div>
                    <div className="font-small-semibold p-1">Serverless</div>
                </div>
            </div>

            <div className="container">
                <div
                    className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded"
                    style={{ height: '46px', float: 'left', marginBottom: '0.5rem' }}
                >
                    <div className="font-x-small-bold">{t('filter')}</div>
                    <div className="w-100">
                        <CDropdown placement="bottom" className="p-2 w-100">
                            <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {FilterItems.map((item: any, index: number) => (
                                    <CDropdownItem
                                        data-si-qa-key={`applications-filter-${item.id}`}
                                        key={index}
                                        onClick={() => setSelectedFilerValue(item.id)}
                                    >
                                        {item.name}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>
                <SearchInput
                    data-si-qa-key={`applications-search-bar`}
                    customClass="w-50"
                    onSearch={onSearch}
                    placeholder="Search"
                />
            </div>

            {(applicationsData && displayData) || isError ? (
                <ApplicationsTable
                    applicationsData={displayData}
                    isError={isError}
                    onClickRow={naviagateToSingleApplicationScreen}
                />
            ) : (
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
};

export default ApplicationsOverview;
