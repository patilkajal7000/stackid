import React, { useCallback, useEffect, useState } from 'react';
import { getAccessIdentities, getApplicationDetails, getResourceDetails } from 'core/services/DataEndpointsAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import SearchInput from 'shared/components/search_input/SearchInput';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { IdentityDetails, IdentityType, SingleBucketAccess } from 'shared/models/IdentityAccessModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { SCREEN_NAME, NAV_TABS_VALUE, ResourceType, UserAccessType, MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { GraphNode } from 'shared/components/graph_node/graph_node';
import { AppState } from 'store/store';
import { CHeader, CNav, CNavItem, CNavLink, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilArrowLeft,
    cilCheckCircle,
    cilList,
    cilLockLocked,
    cilLockUnlocked,
    cilNotes,
    cilPencil,
    cilTag,
    cilUser,
} from '@coreui/icons';

type CustomTab = {
    name: string;
    type: IdentityType;
};

const DataAssetIdentity1 = () => {
    const { t } = useTranslation();
    const params = useParams<any>();
    const navigate = useNavigate();
    const location = useLocation();
    const stack = location?.state?.stack;
    const nodeType: any = location?.state?.nodeType;
    const id: any = location?.state?.id;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType = params?.cloudAccountType;
    const type: string | undefined = params?.type ? params?.type : '';
    const resourceId: string | undefined = params?.rid ? params?.rid : '';
    const dataAssetElementId: string | undefined = id;
    const dataAssetElementType: string | undefined = nodeType;

    const dispatch = useDispatch();
    const [subTabList, setSubTabList] = useState<CustomTab[]>([]);
    const [selectedSubTab, setSelectedSubTab] = useState<IdentityType>(IdentityType.AwsIAMUserHuman);
    const [selectedMainTab, setSelectedMainTab] = useState<any>(NAV_TABS_VALUE.IDENTITY_ACCESS);
    const [data, setData] = useState<SingleBucketAccess>();
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedIdentity, setSelectedIdentity] = useState<any>([]);
    const [selectedIdentityName, setSelectedIdentityName] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [nodeDetails, setNodeDetails] = useState<GraphNode>();
    const NodeTypes = useSelector((state: AppState) => state.graphState.selectedData?.type);

    const Tabs = [
        {
            tabName: t(NAV_TABS_VALUE.IDENTITY_ACCESS),
            tabValue: NAV_TABS_VALUE.IDENTITY_ACCESS,
        },
        {
            tabName: t(NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE),
            tabValue: NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE,
        },
        {
            tabName: t(NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS),
            tabValue: NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS,
        },
        // {
        //     tabName: t(NAV_TABS_VALUE.FEDERATED_IDENTITY_ACCESS),
        //     tabValue: NAV_TABS_VALUE.FEDERATED_IDENTITY_ACCESS,
        // },
    ];

    useEffect(() => {
        dispatch(
            setTabsAction(
                SCREEN_NAME.SINGLE_DATA_ELEMENT,
                NAV_TABS_VALUE.ACCESS_DETAILS,
                NAV_TABS_VALUE.DATA_ENDPOINTS,
            ),
        );
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const DataAssetsPath =
                CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type;
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: ResourceType[type],
                    path: DataAssetsPath,
                },
                {
                    name: resourceId,
                    path: '', // DataAssetsPath + '/' + resourceId + '/' + NAV_TABS_VALUE.RISK_MAP,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        setIsLoading(true);
        getAccessIdentities(cloudAccountId, dataAssetElementId || resourceId, dataAssetElementType || type)
            .then((res: any) => {
                const result = res as SingleBucketAccess;
                setData(result);
            })
            .finally(() => setIsLoading(false));
        if (dataAssetElementType === 'userDefinedGroup') {
            getApplicationDetails(cloudAccountId, dataAssetElementId || resourceId)
                .then((response: any) => {
                    if (response && response.length > 0) {
                        setNodeDetails(response[0]);
                    }
                })
                .catch((error: any) => {
                    console.log('in error', error);
                });
        } else {
            getResourceDetails(cloudAccountId, dataAssetElementId || resourceId)
                .then((response: any) => {
                    setNodeDetails(response);
                })
                .catch((error: any) => {
                    console.log('in error', error);
                });
        }
    }, []);

    useEffect(() => {
        const tabs = [];
        if (selectedMainTab == NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE) {
            tabs.push({
                name: t('human_identities'),
                type: IdentityType.AwsIAMUserHuman,
            });
            tabs.push({
                name: t('application_identities'),
                type: IdentityType.AwsIAMUserApplication,
            });
            tabs.push({ name: t('fed_identities'), type: IdentityType.AwsFederated });
            tabs.push({ name: t('roles'), type: IdentityType.AwsIAMRole });
        } else if (selectedMainTab == NAV_TABS_VALUE.IDENTITY_ACCESS) {
            tabs.push({
                name: t('human_identities'),
                type: IdentityType.AwsIAMUserHuman,
            });
            tabs.push({
                name: t('application_identities'),
                type: IdentityType.AwsIAMUserApplication,
            });
            tabs.push({ name: t('roles'), type: IdentityType.AwsIAMRole });
        } else {
            tabs.push({
                name: t('identities'),
                type: IdentityType.AwsIAMUserHuman,
            });
            tabs.push({ name: t('roles'), type: IdentityType.AwsIAMRole });
        }
        setSubTabList(tabs);
        setSelectedSubTab(IdentityType.AwsIAMUserHuman);
    }, [selectedMainTab]);

    const getTitle = (isTrue: boolean) => {
        return (isTrue ? t('role') : t('user')) + ' ' + t('name');
    };

    const onClickView = (identityDetails: IdentityDetails, key: any) => {
        if (Array.isArray(identityDetails?.permissions)) {
            setSelectedIdentity(identityDetails?.permissions);
        } else {
            setSelectedIdentity(identityDetails?.permissions[Object.keys(identityDetails?.permissions)[key]]);
        }
        setSelectedIdentityName(identityDetails);
        setShowPermissionModal(true);
    };

    const navigate_back = () => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT, NAV_TABS_VALUE.RISK_MAP));

        const DataAssetsPath =
            CLOUDACCOUNT +
            '/' +
            cloudAccountId +
            '/' +
            cloudAccountType +
            '/' +
            NAV_TABS_VALUE.DATA_ENDPOINTS +
            '/' +
            type;
        navigate(DataAssetsPath + '/' + resourceId + '/' + NAV_TABS_VALUE.RISK_MAP);
    };

    return (
        <div>
            <>
                <div className="container d-flex px-0">
                    <CHeader className="border-0 c-subheader">
                        <CNav variant="tabs" className="tabs-custom border-0">
                            {Tabs &&
                                Tabs.map((tab: any, index: number) => (
                                    <CNavItem key={index}>
                                        <CNavLink
                                            active={selectedMainTab === tab.tabValue}
                                            data-tab={tab.tabValue}
                                            onClick={() => setSelectedMainTab(tab.tabValue)}
                                        >
                                            <span className="h5">{tab.tabName}</span>
                                        </CNavLink>
                                    </CNavItem>
                                ))}
                        </CNav>
                    </CHeader>
                </div>
            </>

            <div className="container">
                {stack && (
                    <div className="h5 mt-1">
                        <CIcon
                            icon={cilArrowLeft}
                            className="pt-3 me-2 cursor-pointer text-primary"
                            size="xxl"
                            onClick={() => {
                                navigate_back();
                            }}
                        />
                        <span className="title text-neutral ">{nodeDetails?.name}</span>
                    </div>
                )}
                <nav className="nav nav-custom nav-box text-center my-3">
                    {subTabList &&
                        subTabList.map((tab: CustomTab, index: number) => (
                            <span
                                key={index}
                                className={`nav-link font-small-semibold ${
                                    selectedSubTab == tab.type ? 'active' : ''
                                } `}
                                onClick={() => {
                                    setSelectedSubTab(tab.type);
                                }}
                                role="presentation"
                            >
                                {tab.name}
                            </span>
                        ))}
                </nav>
                <div className="font-medium py-2">
                    {selectedMainTab === NAV_TABS_VALUE.IDENTITY_ACCESS &&
                        t(
                            `Identities in this cloud account that have access to this ${
                                NodeTypes ? NodeTypes : 'data asset'
                            } via an IAM policy attached to them directly.`,
                        )}
                    {selectedMainTab === NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS &&
                        t(
                            `Identities from other cloud accounts that have access to this ${
                                NodeTypes ? NodeTypes : 'data asset'
                            } by assuming a role in this account.`,
                        )}
                    {selectedMainTab === NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE &&
                        t(
                            `Identities in this cloud account that have access to this ${
                                NodeTypes ? NodeTypes : 'data asset'
                            } by assuming another role in this same account.`,
                        )}
                </div>

                {selectedMainTab === NAV_TABS_VALUE.IDENTITY_ACCESS && (
                    <>
                        {selectedSubTab == IdentityType.AwsIAMUserHuman && (
                            <TableComponent
                                t={t}
                                data={data?.direct.human_identities}
                                isLoading={isLoading}
                                title={getTitle(false)}
                                onClickView={(identityDetails: IdentityDetails, key: any) =>
                                    onClickView(identityDetails, key)
                                }
                            />
                        )}
                        {selectedSubTab == IdentityType.AwsIAMUserApplication && (
                            <TableComponent
                                t={t}
                                data={data?.direct.application_identities}
                                isLoading={isLoading}
                                title={getTitle(false)}
                                onClickView={(identityDetails: IdentityDetails, key: any) =>
                                    onClickView(identityDetails, key)
                                }
                            />
                        )}

                        {selectedSubTab == IdentityType.AwsIAMRole && (
                            <TableComponent
                                t={t}
                                data={data?.direct.roles}
                                isLoading={isLoading}
                                title={getTitle(true)}
                                onClickView={(identityDetails: IdentityDetails, key: any) =>
                                    onClickView(identityDetails, key)
                                }
                            />
                        )}
                    </>
                )}

                {selectedMainTab !== NAV_TABS_VALUE.IDENTITY_ACCESS &&
                    (selectedSubTab == IdentityType.AwsIAMRole ? (
                        selectedMainTab === NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS ? (
                            <TableComponentExtraColumn
                                t={t}
                                isLoading={isLoading}
                                showAccountColumn
                                data={data?.indirect.roles.filter((value: IdentityDetails) =>
                                    value.accessTypes.includes(UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT),
                                )}
                                title={getTitle(true)}
                                onClickView={onClickView}
                            />
                        ) : (
                            <TableComponentExtraColumn
                                t={t}
                                isLoading={isLoading}
                                showAccountColumn={false}
                                data={data?.indirect.roles.filter((value: IdentityDetails) =>
                                    value.accessTypes.includes(UserAccessType.ASSUME_ROLE_SAME_ACCOUNT),
                                )}
                                title={getTitle(true)}
                                onClickView={onClickView}
                            />
                        )
                    ) : selectedMainTab === NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS ? (
                        <TableComponentExtraColumn
                            t={t}
                            isLoading={isLoading}
                            showAccountColumn
                            data={data?.indirect.users.filter((value: IdentityDetails) =>
                                value.accessTypes.includes(UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT),
                            )}
                            title={getTitle(false)}
                            onClickView={onClickView}
                        />
                    ) : selectedSubTab == IdentityType.AwsFederated ? (
                        <TableComponentExtraColumn
                            t={t}
                            data={data?.indirect?.fed_okta_users}
                            showAccountColumn={false}
                            isLoading={isLoading}
                            title={getTitle(false)}
                            onClickView={onClickView}
                        />
                    ) : selectedSubTab == IdentityType.AwsIAMUserApplication ? (
                        <TableComponentExtraColumn
                            t={t}
                            isLoading={isLoading}
                            showAccountColumn={false}
                            data={data?.indirect.application_identities.filter((value: IdentityDetails) =>
                                value.accessTypes.includes(UserAccessType.ASSUME_ROLE_SAME_ACCOUNT),
                            )}
                            title={getTitle(false)}
                            onClickView={onClickView}
                        />
                    ) : (
                        <TableComponentExtraColumn
                            t={t}
                            isLoading={isLoading}
                            showAccountColumn={false}
                            data={data?.indirect.human_identities?.filter((value: IdentityDetails) =>
                                value.accessTypes.includes(UserAccessType.ASSUME_ROLE_SAME_ACCOUNT),
                            )}
                            title={getTitle(false)}
                            onClickView={onClickView}
                        />
                    ))}

                <CustomModal
                    show={showPermissionModal}
                    onHide={() => setShowPermissionModal(false)}
                    className="square-corner"
                >
                    <div className="h3 mt-2">{selectedIdentityName?.identity_name}</div>
                    {selectedIdentity && <PopupModal selectedIdentity={selectedIdentity} t={t} />}
                </CustomModal>
            </div>
        </div>
    );
};

export default DataAssetIdentity1;

type PopupModlProps = { selectedIdentity: string[]; t: any };

const PopupModal = (props: PopupModlProps) => (
    <table className="custom-table table table-bordered text-center">
        <thead className="font-small-semibold">
            <tr>
                <th className="w-15"> {props.t('permission_management')} </th>
                <th className="w-15"> {props.t('write')} </th>
                <th className="w-15"> {props.t('read')} </th>
                <th className="w-15"> {props.t('list')} </th>
                <th className="w-15"> {props.t('tagging')} </th>
            </tr>
        </thead>
        <tbody>
            <>
                {
                    <tr className="font-small">
                        <td>
                            {props.selectedIdentity.includes('Permissions management') ? (
                                <CIcon icon={cilCheckCircle} size="lg" className="Low-icon-color" />
                            ) : (
                                ''
                            )}
                        </td>
                        <td>
                            {props.selectedIdentity.includes('Write') ? (
                                <CIcon icon={cilCheckCircle} size="lg" className="Low-icon-color" />
                            ) : (
                                ''
                            )}
                        </td>
                        <td>
                            {props.selectedIdentity.includes('Read') ? (
                                <CIcon icon={cilCheckCircle} size="lg" className="Low-icon-color" />
                            ) : (
                                ''
                            )}
                        </td>
                        <td>
                            {props.selectedIdentity.includes('List') ? (
                                <CIcon icon={cilCheckCircle} size="lg" className="Low-icon-color" />
                            ) : (
                                ''
                            )}
                        </td>
                        <td>
                            {props.selectedIdentity.includes('Tagging') ? (
                                <CIcon icon={cilCheckCircle} size="lg" className="Low-icon-color" />
                            ) : (
                                ''
                            )}
                        </td>
                    </tr>
                }
                {props.selectedIdentity && props.selectedIdentity.length == 0 && (
                    <tr className="text-center">
                        <td colSpan={5}>{props.t('no_records_available')} </td>
                    </tr>
                )}
            </>
        </tbody>
    </table>
);

const PermissionDetails = ({ identityDetails }: any) => {
    const [selectedIdentity, setSelectedIdentity] = useState<any>([]);

    useEffect(() => {
        if (Array.isArray(identityDetails?.permissions)) {
            setSelectedIdentity(identityDetails?.permissions);
        }
    }, [identityDetails]);

    return (
        <>
            {selectedIdentity?.includes('Tagging') ? (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Tagging Enabled">
                        <CIcon icon={cilTag} size="lg" />
                    </CTooltip>
                </span>
            ) : (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Tagging Disabled">
                        <CIcon icon={cilTag} size="lg" />
                    </CTooltip>
                </span>
            )}
            {selectedIdentity?.includes('Write') ? (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Write Enabled">
                        <CIcon icon={cilPencil} size="lg" />
                    </CTooltip>
                </span>
            ) : (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Write Disabled">
                        <CIcon icon={cilPencil} size="lg" />
                    </CTooltip>
                </span>
            )}
            {selectedIdentity?.includes('Read') ? (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Read Enabled">
                        <CIcon icon={cilNotes} size="lg" />
                    </CTooltip>
                </span>
            ) : (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Read Disabled">
                        <CIcon icon={cilNotes} size="lg" />
                    </CTooltip>
                </span>
            )}
            {selectedIdentity?.includes('List') ? (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="List Enabled">
                        <CIcon icon={cilList} size="lg" />
                    </CTooltip>
                </span>
            ) : (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="List Disabled">
                        <CIcon icon={cilList} size="lg" />
                    </CTooltip>
                </span>
            )}
            {selectedIdentity?.includes('Permissions management') ? (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Permissions Management Enabled">
                        <CIcon icon={cilLockLocked} size="lg" />
                    </CTooltip>
                </span>
            ) : (
                <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                    <CTooltip trigger="hover" placement="bottom" content="Permissions Management Disabled">
                        <CIcon icon={cilLockUnlocked} size="lg" />
                    </CTooltip>
                </span>
            )}
        </>
    );
};

type TableComponentProps = {
    data?: IdentityDetails[];
    isLoading: boolean;
    title: string;
    t: any;
    onClickView: (identityDetails: IdentityDetails, key: any) => void;
};
const TableComponent = ({ data, isLoading, title, t }: TableComponentProps) => {
    const [filteredData, setFilteredData] = useState<IdentityDetails[]>([]);

    useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data]);
    const getRow = (identityDetails: IdentityDetails) => (
        <tr key={identityDetails.identity_id}>
            <td>
                {identityDetails.is_admin_permission && (
                    <React.Fragment>
                        <CTooltip trigger="hover" placement="bottom" content={t('admin') + ' ' + t('permission')}>
                            <div className="cursor-pointer d-inline mt-1 me-2">
                                <CIcon icon={cilUser} className="pe-1" />
                            </div>
                        </CTooltip>
                    </React.Fragment>
                )}
                {identityDetails.identity_name}
            </td>
            <td className="text-center py-2">
                <div className="no-pointer d-flex flex-row">
                    <PermissionDetails identityDetails={identityDetails} />
                </div>
                {/* <button
                    type="button"
                    className="btn-custom btn btn-link"
                    onClick={(key: any) => onClickView(identityDetails, key)}
                >
                    {t('view')}
                </button> */}
            </td>
        </tr>
    );

    const getEmptyRow = () => {
        return (
            <tr>
                <td colSpan={5}>
                    <div className="d-flex justify-content-center align-items-center">{t('no_records_available')}</div>{' '}
                </td>
            </tr>
        );
    };

    const onSearchBucket = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (data) {
                if (searchString.length >= MIN_SEARCH_LENGTH) {
                    const selectedBuckets = data?.filter((data: IdentityDetails) =>
                        data.identity_name.toLowerCase().includes(searchString.toLowerCase()),
                    );
                    if (selectedBuckets && selectedBuckets.length > 0) {
                        setFilteredData(selectedBuckets);
                        callback && callback('');
                    } else {
                        setFilteredData([]);
                        callback && callback('No Items found.');
                    }
                } else {
                    setFilteredData(data);
                }
            }
        },
        [data],
    );

    return (
        <>
            <div className="my-2">
                <SearchInput onSearch={onSearchBucket} placeholder="Search User Name" />
            </div>
            <table className="table table-borderless table-hover container custom-table shadow-6 rounded overflow-hidden">
                <thead className="font-small-semibold">
                    <tr>
                        <th className="w-80" title={title}>
                            {title}
                        </th>
                        <th align="center" className="w-20 text-center py-2" title={t('permission_details')}>
                            {t('permission_details')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5}>
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {filteredData && filteredData?.length > 0
                                ? filteredData?.map((value: IdentityDetails) => getRow(value))
                                : getEmptyRow()}
                        </>
                    )}
                </tbody>
            </table>
        </>
    );
};

type TableComponentExtraProps = {
    selectedSubTab?: any;
    data?: IdentityDetails[];
    isLoading: boolean;
    title: string;
    t: any;
    onClickView: (identityDetails: IdentityDetails, key: any) => void;
    showAccountColumn: boolean;
};

const TableComponentExtraColumn = ({
    data,
    isLoading,
    title,
    t,

    showAccountColumn,
}: TableComponentExtraProps) => {
    const [filteredData, setFilteredData] = useState<IdentityDetails[]>([]);

    useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data]);

    const getMultiRow = (identityDetails: IdentityDetails, key: any) => (
        <tr key={key}>
            {identityDetails.aws_account_id && showAccountColumn && <td>{identityDetails.aws_account_id}</td>}
            <td>
                {identityDetails.is_admin_permission && (
                    <React.Fragment>
                        <CTooltip trigger="hover" placement="bottom" content={t('admin') + ' ' + t('permission')}>
                            <div className="cursor-pointer d-inline mt-1 me-2">
                                <CIcon icon={cilUser} className="pe-1" />
                            </div>
                        </CTooltip>
                    </React.Fragment>
                )}
                {identityDetails.identity_name}
            </td>
            <td className="border-left">
                <>
                    {Array.isArray(identityDetails?.assumed_role_name)
                        ? identityDetails?.assumed_role_name?.map((ele: any, key: any) => {
                              return (
                                  <div key={key} className="py-2">
                                      {identityDetails.is_admin_permission && (
                                          <React.Fragment>
                                              <CTooltip
                                                  trigger="hover"
                                                  placement="bottom"
                                                  content={t('admin') + ' ' + t('permission')}
                                              >
                                                  <div className="cursor-pointer d-inline my-1 me-2">
                                                      <CIcon icon={cilUser} className="pe-1" />
                                                  </div>
                                              </CTooltip>
                                          </React.Fragment>
                                      )}
                                      {ele}
                                  </div>
                              );
                          })
                        : identityDetails.assumed_role_name}
                </>
            </td>
            <td className="text-center py-2">
                {Array.isArray(identityDetails?.assumed_role_name) ? (
                    identityDetails?.assumed_role_name?.map((item: any, key: any) => {
                        return (
                            <div className="no-pointer d-flex flex-row" key={key}>
                                <PermissionDetails
                                    identityDetails={{ permissions: identityDetails?.permissions[item] }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="no-pointer d-flex flex-row">
                        <PermissionDetails identityDetails={identityDetails} />
                    </div>
                    // <button
                    //     type="button"
                    //     className="btn-custom btn btn-link"
                    //     onClick={() => onClickView(identityDetails, key)}
                    // >
                    //     {t('view')}
                    // </button>
                )}
            </td>
        </tr>
    );

    const getEmptyRow = () => {
        return (
            <tr>
                <td colSpan={5}>
                    <div className="d-flex justify-content-center align-items-center">{t('no_records_available')}</div>{' '}
                </td>
            </tr>
        );
    };

    const onSearchBucket = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (data) {
                if (searchString.length >= MIN_SEARCH_LENGTH) {
                    const selectedBuckets = data?.filter((data: IdentityDetails) =>
                        data.identity_name.toLowerCase().includes(searchString.toLowerCase()),
                    );
                    if (selectedBuckets && selectedBuckets.length > 0) {
                        setFilteredData(selectedBuckets);
                        callback && callback('');
                    } else {
                        setFilteredData([]);
                        callback && callback('No Items found.');
                    }
                } else {
                    setFilteredData(data);
                }
            }
        },
        [data],
    );

    return (
        <>
            <div className="my-2">
                <SearchInput onSearch={onSearchBucket} placeholder="Search Bucket" />
            </div>
            <table className="table table-borderless table-hover container custom-table shadow-6 rounded overflow-hidden">
                <thead className="font-small-semibold">
                    <tr className="border-bottom">
                        <th
                            rowSpan={showAccountColumn ? undefined : 2}
                            className="w-50"
                            colSpan={showAccountColumn ? 2 : 0}
                            title={t('assuming') + ' ' + t('identity')}
                        >
                            {t('assuming') + ' ' + t('identity')}
                            {!showAccountColumn && <p className="pt-3 m-0">{title}</p>}
                        </th>
                        <th className="w-50 border-left" colSpan={2} title={t('assumed') + ' ' + t('identity')}>
                            {t('assumed') + ' ' + t('identity')}
                        </th>
                    </tr>
                    <tr>
                        {showAccountColumn && (
                            <th className="w-25" title={t('aws_account')}>
                                {t('aws_account')}
                            </th>
                        )}
                        {showAccountColumn && (
                            <th className="w-25" title={t('aws_account')}>
                                {title}
                            </th>
                        )}
                        <th className="w-25 border-left" title={t('role') + ' ' + t('being_assumed')}>
                            {t('role') + ' ' + t('being_assumed')}
                        </th>
                        <th className="w-25 text-center" title={t('permission_details')}>
                            {t('permission_details')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5}>
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {filteredData && filteredData?.length > 0
                                ? filteredData?.map((value: IdentityDetails, key: any) => getMultiRow(value, key))
                                : getEmptyRow()}
                        </>
                    )}
                </tbody>
            </table>
        </>
    );
};
