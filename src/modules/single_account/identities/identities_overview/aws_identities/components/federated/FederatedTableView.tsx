import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import UsersTableComponent from '../users/UsersTableComponent';
import SearchInput from 'shared/components/search_input/SearchInput';
import { getFederatedOverview } from 'core/services/IdentitiesAPIService';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE } from 'shared/utils/Constants';
import { IdentityDetails } from 'shared/models/IdentityAccessModel';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CTooltip } from '@coreui/react';

const FilterItems: any = [
    { id: 0, name: 'All' },
    { id: 1, name: 'FedOkta' },
    { id: 2, name: 'SCIMUser' },
    { id: 3, name: 'SCIMGroup' },
];

const FederatedTableView = (props: any) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRecords, setFilteredRecords] = useState<IdentityDetails[]>([]);
    const [federatedOverviewList, setFederatedOverviewList] = useState<IdentityDetails[]>([]);
    const [isLoading, setIsFederatedOverviewAPILoading] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo'); // bar
    const params = useParams<any>();
    const { accessCounts, getSummaryDetails, identityNames } = props;
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [fedType, setFedType] = useState('all');

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    // useEffect(() => {
    //     setFilteredRecords(props.data);
    // }, [props.data]);

    useEffect(() => {
        let isMounted = true;
        if (pageNo) {
            setCurrentPage(+pageNo);
        }
        setIsFederatedOverviewAPILoading(true);
        getFederatedOverview(cloudAccountId, fedType).then((response: any) => {
            if (isMounted) {
                if (response && response.fed_identities) {
                    setFederatedOverviewList(response.fed_identities);
                    setFilteredRecords(response.fed_identities);
                    setIsFederatedOverviewAPILoading(false);
                }
                setIsFederatedOverviewAPILoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [setFedType, fedType]);

    const onSearcePolicies = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = federatedOverviewList?.filter((data: IdentityDetails) => {
                    return (
                        data.identity_name.toLowerCase().includes(searchString.toLowerCase()) ||
                        data?.platformTags?.some((tags: any) => {
                            return (
                                tags?.tag_key.toLowerCase().includes(searchString.toLowerCase()) ||
                                tags?.tag_value.toLowerCase().includes(searchString.toLowerCase())
                            );
                        })
                    );
                });
                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(federatedOverviewList);
            }
        },
        [federatedOverviewList],
    );

    const naviagateToSingleIdentityScreen = (identityId: string) => {
        navigate(location.pathname + '/' + identityId + '/' + NAV_TABS_VALUE.RISK);
    };

    useEffect(() => {
        if (identityNames) {
            setFilteredRecords(
                federatedOverviewList?.filter((d: IdentityDetails) => identityNames.includes(d.identity_name)),
            );
        }
    }, [identityNames]);

    // filter Record
    const filteredRecordsData = (recordID: number) => {
        setSelectedFilerValue(recordID);
        if (recordID === 1) {
            setFedType('aws_FedOkta');
        } else if (recordID === 2) {
            setFedType('aws_SCIMUser');
        } else if (recordID === 3) {
            setFedType('aws_SCIMGroup');
        } else {
            setFedType('all');
        }
    };

    return (
        <>
            <div className="container my-5">
                <div className="d-flex flex-row align-content-around">
                    {/* <button
                        type="button"
                        className="btn btn-custom btn-filter justify-content-center align-items-center"
                    >
                        {t('all')} ({filteredRecords.length})
                    </button> */}
                    <CTooltip
                        content="An identity can assume a role and thus obtain different set of permissions to resources in an environment"
                        placement="bottom"
                    >
                        <button
                            type="button"
                            className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                            onClick={() => getSummaryDetails('invisible_access')}
                        >
                            {t('invisible_access')} ({accessCounts.invisible_access})
                        </button>
                    </CTooltip>
                    <CTooltip
                        content="An identity would be given some permissions initially, but it might use only a subset of the attached permissions."
                        placement="bottom"
                    >
                        <button
                            type="button"
                            className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                            onClick={() => getSummaryDetails('excessive_access')}
                        >
                            {t('excessive_access')} ({accessCounts.excessive_access})
                        </button>
                    </CTooltip>
                    <CTooltip
                        content="An identity would be given some permissions initially, but it might not be using all those permissions."
                        placement="bottom"
                    >
                        <button
                            type="button"
                            className="btn btn-custom btn-filter justify-content-center align-items-center me-2"
                            onClick={() => getSummaryDetails('unused_access')}
                        >
                            {t('unused_access')} ({accessCounts.unused_access})
                        </button>
                    </CTooltip>
                    {/* <button
                        type="button"
                        className="btn btn-custom btn-filter justify-content-center align-items-center ms-2 no-pointer"
                    >
                        {t('admin_access')} (0)
                    </button> */}
                </div>

                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded w-200">
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
                                            data-si-qa-key={`fedOcta-filter-${item.id}`}
                                        >
                                            {item.name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </div>
                    <SearchInput onSearch={onSearcePolicies} placeholder="Search" />
                </div>

                <UsersTableComponent
                    translate={t}
                    isLoading={isLoading}
                    data={filteredRecords}
                    currentPageNo={currentPage}
                    onClickRow={(identityId: string) => naviagateToSingleIdentityScreen(identityId)}
                    accessType={props.accessType}
                    selectedTab={props.selectedTab}
                />
            </div>
        </>
    );
};

export default React.memo(FederatedTableView);
