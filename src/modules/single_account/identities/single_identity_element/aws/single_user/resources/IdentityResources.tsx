import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AccessType,
    CanAssumeRole,
    IdentityResourceDetails,
    IdentityType,
    SingleIdentityInsightDetails,
} from 'shared/models/IdentityAccessModel';
import { NAV_TABS_VALUE, ResourceType, SCREEN_NAME } from 'shared/utils/Constants';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import {
    filterUniqueitemsWithGivenKeys,
    getCloudAccountNameById,
    getMapOfUniqueKeysAndValues,
} from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTabsAction } from 'store/actions/TabsStateActions';
import SingleIdentityTableView from '../components/SingleIdentityTableView';
import {
    getResourcesByIdentityId,
    getResourcesAttachedToRole,
    getAssumeRoleResources,
    getFedUserResources,
} from 'core/services/IdentitiesAPIService';
import SingleResourcePermissions from './single_resource_permissions/SingleResourcePermissions';
import { useNavigate, useLocation } from 'react-router';
import CustomInput from 'shared/components/input/CustomInput';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilInfo } from '@coreui/icons';

type CustomTab = {
    name: string;
    type: AccessType;
    icon: boolean;
    count: number;
};

interface IdentityResource {
    indirect_access: IdentityResourceDetails[];
    direct_access: IdentityResourceDetails[];
    resource_attached: IdentityResourceDetails[];
}

type IdentitiesResourcesProps = {
    singleIdentityInsightDetails?: SingleIdentityInsightDetails;
};

const IdentitiesResources = ({ singleIdentityInsightDetails }: IdentitiesResourcesProps) => {
    const { t } = useTranslation();
    const [identityResourceDetails, setIdentityResourceDetails] = useState<IdentityResource>();
    const [identityResourceDetailsList, setIdentityResourceDetailsList] = useState<IdentityResourceDetails[]>([]);
    const [indirectResourceDetailsList, setIndirectResourceDetailsList] = useState<IdentityResourceDetails[]>([]);
    const [selectedRoleAndAccount, setSelectedRoleAndAccount] = useState('');
    const [selectedResourceDetails, setSelectedResourceDetails] = useState<IdentityResourceDetails | null>(null);

    const [isIdentityResourceAPILoading, setIsIdentityResourceAPILoading] = useState(false);
    const [isResourcesAttachedAPILoading, setIsResourcesAttachedAPILoading] = useState(false);
    const [isIndirectAPILoading, setIsIndirectAPILoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState<AccessType>(AccessType.DirectAccess);
    const [tabList, setTabList] = useState<CustomTab[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type;
    const identityId: any = params?.rid;

    const access_type = new URLSearchParams(location.search).get('access_type');

    useEffect(() => {
        if (access_type) {
            setSelectedTab(access_type as AccessType);
        }
        /*------------------------------------------------ */
        // Added to show breadcrumb & tabs of reload
        // Todo - Refactore this code to call below api only once
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: 'Identities',
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.IDENTITIES +
                        '/' +
                        type,
                },
                { name: identityId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, ''));
        /*------------------------------------------------ */
        setIsIdentityResourceAPILoading(true);
        getResourcesByIdentityId(cloudAccountId, identityId)
            .then((response: any) => {
                if (response) {
                    if (type === IdentityType.AwsIAMRole) {
                        getResourceAttached(response);
                    } else {
                        setIdentityResourceDetails(response);
                        if (access_type) {
                            setIdentityResourceDetailsList(response[access_type]);
                        } else {
                            setIdentityResourceDetailsList(response[AccessType.DirectAccess]);
                        }
                    }
                }
            })
            .finally(() => setIsIdentityResourceAPILoading(false));
    }, []);

    useEffect(() => {
        if (identityResourceDetails) {
            let tabs = [
                {
                    name: t('direct') + ' ' + t('access'),
                    type: AccessType.DirectAccess,
                    icon: false,
                    count: identityResourceDetails[AccessType.DirectAccess].length,
                },
                {
                    name: t('indirect') + ' ' + t('access') + ' (' + t('assume') + ') ',
                    type: AccessType.IndirectAccess,
                    icon: true,
                    count:
                        singleIdentityInsightDetails && singleIdentityInsightDetails?.CanAssumeRole?.length > 0
                            ? singleIdentityInsightDetails?.CanAssumeRole?.length
                            : 0,
                },
            ];
            if (type === IdentityType.AwsIAMRole) {
                tabs.push({
                    name: t('resources_attached_to'),
                    type: AccessType.ResourcesAttached,
                    icon: false,
                    count: identityResourceDetails[AccessType.ResourcesAttached].length,
                });
            } else if (type === IdentityType.AwsFederated) {
                tabs = [];
                setSelectedTab(AccessType.IndirectAccess);
                onSelectAssumeRole();
            }
            setTabList(tabs);
        }
    }, [identityResourceDetails]);

    const getResourceAttached = (directIndirectData: any) => {
        setIsResourcesAttachedAPILoading(true);
        getResourcesAttachedToRole(cloudAccountId, identityId)
            .then((res: any) => {
                const updtedIdentityResourceDetails: any = {
                    ...directIndirectData,
                    resource_attached: res,
                };
                setIdentityResourceDetails(updtedIdentityResourceDetails);
                if (access_type) {
                    setIdentityResourceDetailsList(updtedIdentityResourceDetails[access_type]);
                } else {
                    setIdentityResourceDetailsList(updtedIdentityResourceDetails[AccessType.DirectAccess]);
                }
            })
            .finally(() => setIsResourcesAttachedAPILoading(false));
    };

    const naviagateToPolicyDetailsView = (resourceData: IdentityResourceDetails, currentPage: number) => {
        if (selectedRoleAndAccount.length > 0) {
            const val = selectedRoleAndAccount.split(':');

            const assumeRoleData = getSelectedAccountFromDropdown({
                aws_account_id: val[0],
                assumed_role_name: val[1],
            });
            resourceData = { ...resourceData, si_account_id: assumeRoleData?.si_account_id };
        }
        setCurrentPage(currentPage);
        setSelectedResourceDetails(resourceData);
    };

    const formatDropdownValue = (value: any) => {
        if (value) {
            let str = value.aws_account_id + ': ' + value.assumed_role_name;
            if (value.policy_name) {
                str += ': (Policy: ' + value.policy_name + ')';
            }
            return str;
        }
        return '';
    };

    const getAssumeRoleData = (selectedDropdownValue: any) => {
        const selectedAssumeRole: any = getSelectedAccountFromDropdown(selectedDropdownValue);
        if (selectedAssumeRole && selectedAssumeRole.si_account_id) {
            setIsIndirectAPILoading(true);
            if (type === IdentityType.AwsFederated) {
                getFedUserResources(selectedAssumeRole.si_account_id, identityId, selectedAssumeRole.assumed_role_name)
                    .then((res: any) => {
                        setIndirectResourceDetailsList(res[AccessType.IndirectAccess]);
                    })
                    .finally(() => {
                        setIsIndirectAPILoading(false);
                    });
            } else {
                getAssumeRoleResources(
                    selectedAssumeRole.si_account_id,
                    identityId,
                    selectedAssumeRole.assumed_role_name,
                    selectedAssumeRole.aws_account_id,
                )
                    .then((res: any) => {
                        setIndirectResourceDetailsList(res);
                    })
                    .finally(() => {
                        setIsIndirectAPILoading(false);
                    });
            }
        }
    };

    const getSelectedAccountFromDropdown = (selectedDropdownValue: any) => {
        return singleIdentityInsightDetails?.CanAssumeRole.find(
            (d: CanAssumeRole) =>
                d.aws_account_id === selectedDropdownValue.aws_account_id &&
                d.assumed_role_name === selectedDropdownValue.assumed_role_name,
        );
    };

    const getLengthofAssumeRoleName = () => {
        if (singleIdentityInsightDetails) {
            const data = Object.keys(
                getMapOfUniqueKeysAndValues(singleIdentityInsightDetails.CanAssumeRole, 'assumed_role_name'),
            );

            if (data.length > 0) {
                if (data.length > 1) {
                    return (
                        <div className="font-medium-semibold d-flex">
                            Can Assume <div className="h5 mx-1">{data.length}</div> role(s)
                        </div>
                    );
                } else {
                    <div className="font-medium-semibold d-flex">
                        Can Assume <div className="h5 mx-1">{data.length}</div> role
                    </div>;
                }
            }
        }
    };

    const getLengthofAccountIdeName = () => {
        if (singleIdentityInsightDetails) {
            const data = Object.keys(
                getMapOfUniqueKeysAndValues(singleIdentityInsightDetails.CanAssumeRole, 'aws_account_id'),
            );

            if (data.length > 0) {
                if (data.length > 1) {
                    return (
                        <div className="font-medium-semibold d-flex">
                            From <div className="h5 mx-1">{data.length}</div> Cloud Account(s)
                        </div>
                    );
                } else {
                    <div className="font-medium-semibold d-flex">
                        From <div className="h5 mx-1">{data.length}</div> Cloud Account
                    </div>;
                }
            }
        }
    };

    const onSelectAssumeRole = () => {
        if (singleIdentityInsightDetails && singleIdentityInsightDetails.CanAssumeRole) {
            const dataForDropdown = filterUniqueitemsWithGivenKeys(singleIdentityInsightDetails.CanAssumeRole, [
                'aws_account_id',
                'assumed_role_name',
            ]);
            setSelectedRoleAndAccount(formatDropdownValue(dataForDropdown[0]));
            getAssumeRoleData(dataForDropdown[0]);
        }
    };
    useEffect(() => {
        onSelectAssumeRole();
    }, [singleIdentityInsightDetails]);

    return (
        <div>
            {!selectedResourceDetails && (
                <>
                    <div className="container">
                        <nav className="nav nav-custom nav-box text-center my-3">
                            {tabList &&
                                tabList.map((tab: CustomTab, index: number) => (
                                    <span
                                        key={index}
                                        className={`nav-link w-2 font-small-semibold ${
                                            selectedTab == tab.type ? 'active' : ''
                                        } `}
                                        onClick={() => {
                                            setSelectedTab(tab.type);
                                            navigate('?access_type=' + tab.type + '&pageNo=' + currentPage);
                                            if (tab.type !== AccessType.IndirectAccess && identityResourceDetails) {
                                                setIdentityResourceDetailsList(identityResourceDetails[tab.type]);
                                            } else {
                                                onSelectAssumeRole();
                                            }
                                        }}
                                        role="presentation"
                                        data-si-qa-key={`identities-resources-access-${tab.name}`}
                                    >
                                        {tab.name} ({tab.count}){' '}
                                        {tab.icon && <CIcon icon={cilInfo} className="ms-1 " />}
                                    </span>
                                ))}
                        </nav>
                    </div>

                    {selectedTab === AccessType.IndirectAccess ? (
                        <>
                            {singleIdentityInsightDetails &&
                                singleIdentityInsightDetails?.CanAssumeRole?.length > 0 && (
                                    <div className="container my-4">
                                        <div className="d-flex justify-content-between">
                                            {getLengthofAssumeRoleName()}
                                            {getLengthofAccountIdeName()}
                                            <div></div>
                                        </div>
                                        <div>
                                            <CustomInput
                                                autoComplete="roles"
                                                value={selectedRoleAndAccount}
                                                onChange={(e: any) => {
                                                    setSelectedRoleAndAccount(e);
                                                    const val = e.split(' : ');
                                                    getAssumeRoleData({
                                                        aws_account_id: val[0],
                                                        assumed_role_name: val[1],
                                                    });
                                                }}
                                                placeHolder={t('select_role') + '*'}
                                                isDropdown
                                                dropdownValues={singleIdentityInsightDetails?.CanAssumeRole.map(
                                                    (d: any) => formatDropdownValue(d),
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            <SingleIdentityTableView
                                currentPage={currentPage}
                                isLoading={isIndirectAPILoading}
                                translate={t}
                                data={indirectResourceDetailsList}
                                onClickRow={naviagateToPolicyDetailsView}
                                t={t}
                                showFullTable
                                selectedTab={selectedTab}
                                singleIdentityInsightDetails={singleIdentityInsightDetails}
                                selectedRoleAndAccount={selectedRoleAndAccount}
                            />
                        </>
                    ) : (
                        <SingleIdentityTableView
                            currentPage={currentPage}
                            isLoading={isIdentityResourceAPILoading || isResourcesAttachedAPILoading}
                            translate={t}
                            data={identityResourceDetailsList}
                            onClickRow={naviagateToPolicyDetailsView}
                            t={t}
                            showFullTable={selectedTab !== AccessType.ResourcesAttached}
                            selectedTab={selectedTab}
                            singleIdentityInsightDetails={singleIdentityInsightDetails}
                            selectedRoleAndAccount={selectedRoleAndAccount}
                        />
                    )}
                </>
            )}

            {selectedResourceDetails && (
                <div>
                    <div className="container-fluid mt-3">
                        <div className="d-flex align-items-center">
                            <div className="container p-0">
                                <div className="h5">
                                    <CIcon
                                        icon={cilArrowLeft}
                                        size="xl"
                                        className="me-2 pt-2 cursor-pointer text-primary"
                                        onClick={() => setSelectedResourceDetails(null)}
                                    />
                                    <span className="title">{selectedResourceDetails.resource_name}</span>
                                </div>
                                <div className="h6 text-neutral">
                                    {ResourceType[selectedResourceDetails.resource_type]}
                                </div>
                            </div>
                        </div>
                    </div>
                    <SingleResourcePermissions
                        translate={t}
                        identityId={identityId}
                        cloudAccountId={
                            selectedResourceDetails.si_account_id
                                ? selectedResourceDetails.si_account_id
                                : cloudAccountId
                        }
                        resourceId={selectedResourceDetails.resource_id}
                    />
                </div>
            )}
        </div>
    );
};

export default IdentitiesResources;
