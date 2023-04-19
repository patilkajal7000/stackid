import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CTooltip } from '@coreui/react';
import { getCrossAccountAccess } from 'core/services/IdentitiesAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import SearchInput from 'shared/components/search_input/SearchInput';
import { IdentityDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH, UserAccessType } from 'shared/utils/Constants';
import GCPIdentitiesTableComponent from '../../../gcp_identities/components/users/GCPIdentitiesTableComponent';
import UsersTableComponent from './UsersTableComponent';

const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'User' },
    { id: 2, name: 'Tags' },
    { id: 3, name: 'Platform Tags' },
];

type IdentitiesTableViewProps = {
    tabCount: any;
    headerTitle: string;
    data: IdentityDetails[];
    onClickRow: (id: string) => void;
    isLoading: boolean;
    identityType: IdentityType;
    currentPage: number;
    cloudAccountId: any;
    accessCounts: any;
    getSummaryDetails: any;
    identityNames: any;
    accessType?: any;
    setRefreshData?: any;
    refresh?: any;
};
const IdentitiesTableView = (props: IdentitiesTableViewProps) => {
    const [filteredRecords, setFilteredRecords] = useState<IdentityDetails[]>([]);
    const [allAccess, setAllAccess] = useState<IdentityDetails[]>([]);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    // eslint-disable-next-line prefer-const
    let [btnSeleted, setBtnSelected] = useState<string[]>([]);
    const [adminAccess, setAdminAccess] = useState<IdentityDetails[]>([]);
    const [adminPermission, setAdminPermission] = useState<IdentityDetails[]>([]);
    const [notTagged, setNotTagged] = useState<IdentityDetails[]>([]);
    const { accessCounts, getSummaryDetails, identityNames, refresh, setRefreshData } = props;
    const [showBulkTagging, setShowBulkTagging] = useState<boolean>(false);
    const { t } = useTranslation();
    const params = useParams<any>();
    const cloudAccountType: any = params?.cloudAccountType;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const [crossOriginData, setCrossOriginData] = useState<any>();

    useEffect(() => {
        getCrossAccountAccess(cloudAccountId, IdentityType.AwsIAMRole, 1, 1000).then((response: any) => {
            setCrossOriginData(response);
        });
        props.data.map((item: any) => {
            item?.is_admin_permission ? adminAccess.push(item) : null;
            item?.is_permission_management ? adminPermission.push(item) : null;
            item?.policy_tags?.length === 0 ? notTagged.push(item) : null;
        });
        setAdminAccess(adminAccess);
        setAdminPermission(adminPermission);
        setNotTagged(notTagged);
    }, [props.data]);

    useEffect(() => {
        if (identityNames) {
            setFilteredRecords(props?.data.filter((d: IdentityDetails) => identityNames.includes(d.identity_name)));
        }
    }, [identityNames]);
    const openPlatformTags = (e: any) => {
        e.stopPropagation();
        setShowBulkTagging(true);
    };
    const filterAdminRecord = (value: string) => {
        if (!btnSeleted.find((e) => e === value)) {
            btnSeleted.push(value);
            setBtnSelected(btnSeleted);
        } else {
            const newArray = btnSeleted.filter((el) => el !== value);
            btnSeleted = newArray;
            setBtnSelected(btnSeleted);
        }
        if (btnSeleted.length > 0) {
            let data = props.data;

            data = btnSeleted.find((e) => e === 'admin_permission')
                ? data.filter((value) => adminAccess.some((value2) => value.identity_id === value2.identity_id))
                : data;
            data = btnSeleted.find((e) => e === 'permission_management')
                ? data.filter((value) => adminPermission.some((value2) => value.identity_id === value2.identity_id))
                : data;
            data = btnSeleted.find((e) => e === 'not_tagged')
                ? data.filter((value) => notTagged.some((value2) => value.identity_id === value2.identity_id))
                : data;
            setFilteredRecords(data);
        } else {
            setFilteredRecords(props.data);
        }
    };

    const allData = () => {
        setBtnSelected([]);
        setFilteredRecords(props.data);
    };

    useEffect(() => {
        setFilteredRecords([]);
        if (props?.identityType === IdentityType.AwsIAMUserHuman) {
            setFilteredRecords(
                props?.data.filter((d: IdentityDetails) => d.accessTypes.includes(UserAccessType.LOGIN_ACCESS)),
            );
            setAllAccess(props.data);
            return;
        }
        if (props?.identityType === IdentityType.AwsIAMUserApplication) {
            setFilteredRecords(
                props?.data.filter((d: IdentityDetails) => d.accessTypes.includes(UserAccessType.PROGRAMATIC_ACCESS)),
            );
            setAllAccess(props.data);
            return;
        }
        setFilteredRecords(props.data);
        setAllAccess(props.data);
    }, [props.data]);

    const getCrossOriginAccess = () => {
        if (props?.identityType === IdentityType.AwsIAMRole && crossOriginData) {
            const arr: any[] = [];
            Object.keys(crossOriginData).map((data) => arr.push(crossOriginData[data].identity_name));
            setFilteredRecords(props?.data.filter((d: IdentityDetails) => arr.some((data) => data == d.identity_name)));
            setAllAccess(props.data);
            return;
        }
    };

    // filter Record
    const filteredRecordsData = (recordID: number) => {
        setSelectedFilerValue(recordID);
        if (recordID === 2) {
            const notTagged = props.data.filter((k) => k?.policy_tags?.length === 0);
            setFilteredRecords(notTagged);
        } else {
            setFilteredRecords(props.data);
        }
    };

    // Search and search by name and tags
    const onSearchIdentites = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = props?.data?.filter((data: any) => {
                    if (selectedFilerValue === 1) {
                        return data.identity_name.toLowerCase().includes(searchString.toLowerCase());
                    }
                    if (selectedFilerValue === 2) {
                        return data?.policy_tags?.some((tags: any) => {
                            return (
                                tags?.Key.toLowerCase().includes(searchString.toLowerCase()) ||
                                tags?.Value.toLowerCase().includes(searchString.toLowerCase())
                            );
                        });
                    } else if (selectedFilerValue === 3) {
                        return data?.platformTags?.some((tags: any) => {
                            return (
                                tags?.tag_key.toLowerCase().includes(searchString.toLowerCase()) ||
                                tags?.tag_value.toLowerCase().includes(searchString.toLowerCase())
                            );
                        });
                    } else {
                        return (
                            data.identity_name.toLowerCase().includes(searchString.toLowerCase()) ||
                            data?.policy_tags?.some((tags: any) => {
                                return (
                                    tags?.Key.toLowerCase().includes(searchString.toLowerCase()) ||
                                    tags?.Value.toLowerCase().includes(searchString.toLowerCase())
                                );
                            }) ||
                            data?.policy_tags?.some((tags: any) => {
                                return (
                                    tags?.Key.toLowerCase().includes(searchString.toLowerCase()) ||
                                    tags?.Value.toLowerCase().includes(searchString.toLowerCase())
                                );
                            }) ||
                            data?.platformTags?.some((tags: any) => {
                                return (
                                    tags?.tag_key.toLowerCase().includes(searchString.toLowerCase()) ||
                                    tags?.tag_value.toLowerCase().includes(searchString.toLowerCase())
                                );
                            })
                        );
                    }
                });

                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(props.data);
            }
        },
        [props.data, selectedFilerValue],
    );

    return (
        <>
            <div className="container-fluid my-5 px-0">
                <div className="container d-flex flex-row align-content-around my-3">
                    <button
                        type="button"
                        className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                        onClick={() => getSummaryDetails('invisible_access')}
                    >
                        <CTooltip content="An identity can assume a role and thus obtain different set of permissions to resources in an environment">
                            <span data-si-qa-key={'identity-Tab-invisible_access'}>
                                {t('invisible_access')} ({accessCounts.invisible_access})
                            </span>
                        </CTooltip>
                    </button>
                    <button
                        type="button"
                        className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                        onClick={() => getSummaryDetails('excessive_access')}
                    >
                        <CTooltip content="An identity would be given some permissions initially, but it might use only a subset of the attached permissions.">
                            <span data-si-qa-key={'identity-Tab-excessive_access'}>
                                {t('excessive_access')} ({accessCounts.excessive_access})
                            </span>
                        </CTooltip>{' '}
                    </button>
                    <button
                        type="button"
                        className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                        onClick={() => getSummaryDetails('unused_access')}
                    >
                        <CTooltip content="An identity would be given some permissions initially, but it might not be using all those permissions.">
                            <span data-si-qa-key={'identity-Tab-unused_access'}>
                                {t('unused_access')} ({accessCounts.unused_access})
                            </span>
                        </CTooltip>{' '}
                    </button>
                    {props?.identityType == 'aws_IAMRole' && (
                        <button
                            type="button"
                            className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                            onClick={() => getCrossOriginAccess()}
                        >
                            <CTooltip content="Identities from other cloud accounts that have access to this data asset by assuming a role in this account.">
                                <span data-si-qa-key={'identity-Tab-cross_account_access'}>
                                    {t('cross_account_access')}({crossOriginData?.length || 0})
                                </span>
                            </CTooltip>{' '}
                        </button>
                    )}
                </div>

                <div className="header-background py-2">
                    <div className="container d-flex flex-row align-content-around ">
                        <button
                            onClick={allData}
                            type="button"
                            className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center ${
                                btnSeleted.length <= 0 ? 'btn-selected' : 'disable-border'
                            }`}
                            data-si-qa-key={'identities-total-count'}
                        >
                            {t('identities')} ({allAccess.length})
                        </button>
                        <button
                            onClick={() => filterAdminRecord('admin_permission')}
                            type="button"
                            className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                                btnSeleted.find((e) => e === 'admin_permission') ? 'btn-selected' : 'disable-border'
                            }`}
                            data-si-qa-key={'identities-admin-permission'}
                        >
                            {t('admin_permission')} ({adminAccess.length || 0})
                        </button>
                        <button
                            onClick={() => filterAdminRecord('permission_management')}
                            type="button"
                            className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                                btnSeleted.find((e) => e === 'permission_management')
                                    ? 'btn-selected'
                                    : 'disable-border'
                            }`}
                            data-si-qa-key={'identities-permission-management'}
                        >
                            {t('permission_management')} ({adminPermission.length || 0})
                        </button>
                        <button
                            onClick={() => filterAdminRecord('not_tagged')}
                            type="button"
                            className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                                btnSeleted.find((e) => e === 'not_tagged') ? 'btn-selected' : 'disable-border'
                            }`}
                            data-si-qa-key={'identities-not-tagged'}
                        >
                            {t('not_tagged')} ({notTagged.length || 0})
                        </button>
                    </div>
                </div>
                <div className="container">
                    <div className="d-flex align-items-center mx-0 mt-4  justify-content-between">
                        <div className="d-flex align-items-center mx-0 mt-4 w-80">
                            <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded">
                                <div className="font-x-small-bold">{t('filter')}</div>
                                <div className="w-100">
                                    <CDropdown placement="bottom" className="mx-1 p-2 w-90">
                                        <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                            <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                            {FilterItems.map((item: any, index: number) => (
                                                <CDropdownItem
                                                    key={index}
                                                    onClick={() => filteredRecordsData(item.id)}
                                                    data-si-qa-key={`identities-filter-${item.id}`}
                                                >
                                                    {item.name}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                            <SearchInput
                                data-si-qa-key={`identities-search-bar`}
                                onSearch={onSearchIdentites}
                                placeholder="Search"
                            />
                        </div>
                        {cloudAccountType !== 'GCP' && (
                            <div className="mx-0 mt-4">
                                <button
                                    className="float-end btn-custom btn btn-link border me-2"
                                    onClick={(e) => openPlatformTags(e)}
                                    data-si-qa-key={`identities-bulk-tagging`}
                                >
                                    Bulk Tagging
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="container">
                    {(props?.identityType === IdentityType.AwsIAMUserHuman ||
                        props?.identityType === IdentityType.AwsIAMUserApplication ||
                        props?.identityType === IdentityType.AwsIAMRole) && (
                        <UsersTableComponent
                            currentPageNo={props.currentPage}
                            onClickRow={(identityId: string) => props.onClickRow(identityId)}
                            data={filteredRecords}
                            translate={t}
                            isLoading={props.isLoading}
                            accessType={props.accessType}
                            identityType={props.identityType}
                            setRefreshData={setRefreshData}
                            refresh={refresh}
                            showBulkTagging={showBulkTagging}
                            setShowBulkTagging={setShowBulkTagging}
                            openPlatformTags={openPlatformTags}
                        />
                    )}

                    {(props?.identityType === IdentityType.GCPUserHuman ||
                        props?.identityType === IdentityType.GCPUserApplication) && (
                        <GCPIdentitiesTableComponent
                            currentPageNo={props.currentPage}
                            onClickRow={(identityId: string) => props.onClickRow(identityId)}
                            data={filteredRecords}
                            translate={t}
                            isLoading={props.isLoading}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(IdentitiesTableView);
