import {
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CNav,
    CNavItem,
    CNavLink,
} from '@coreui/react';
import { getInternetRiskDetails } from 'core/services/DataEndpointsAPIService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import Pagination from 'shared/components/pagination/Pagination';
import SearchInput from 'shared/components/search_input/SearchInput';
import { useDispatch } from 'react-redux';
import { NAV_TABS_VALUE, SCREEN_NAME, MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import { setTabsAction } from 'store/actions/TabsStateActions';
const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Application Name' },
    { id: 2, name: 'Application Details' },
    { id: 3, name: 'Application Category' },
];
const PageSize = 15;

const ExposedApplications = () => {
    const [riskDetail, setRiskDetail] = useState<any>([]);
    const params = useParams<any>();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [displayData, setDisplayData] = useState<any>();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const [selectedMainTab, setSelectedMainTab] = useState<any>(NAV_TABS_VALUE.APPLICATIONS_EXPOSED_TO_INTERNET);

    const Tabs = [
        {
            tabName: t(NAV_TABS_VALUE.APPLICATIONS_EXPOSED_TO_INTERNET),
            tabValue: NAV_TABS_VALUE.APPLICATIONS_EXPOSED_TO_INTERNET,
        },
    ];

    useEffect(() => {
        getInternetRiskDetails(cloudAccountId).then((response: any) => {
            const values = Object.values(response);
            setRiskDetail(values);
        });
    }, []);

    useEffect(() => {
        if (riskDetail) {
            setDisplayData(riskDetail);
            dispatch(
                setTabsAction(
                    SCREEN_NAME.SINGLE_DATA_ELEMENT,
                    NAV_TABS_VALUE.APPLICATIONS_EXPOSED,
                    NAV_TABS_VALUE.DATA_ENDPOINTS,
                ),
            );
        }
    }, [riskDetail]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return displayData?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, displayData]);

    useEffect(() => {
        if (displayData && displayData.length > 0) {
            currentPage ? setCurrentPage(currentPage) : setCurrentPage(1);
        }
    }, [displayData]);

    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedBuckets = riskDetail?.map((data: any) => {
                    return Object.values(data).filter((risk: any) => {
                        switch (selectedFilerValue) {
                            case 0:
                                return (
                                    risk?.name.toLowerCase().includes(searchString.toLowerCase()) ||
                                    risk?.PlatformDetails.toLowerCase().includes(searchString.toLowerCase()) ||
                                    risk?.resource_category.toLowerCase().includes(searchString.toLowerCase())
                                );
                            case 1:
                                return risk?.name.toLowerCase().includes(searchString.toLowerCase());
                            case 2:
                                return risk?.PlatformDetails.toLowerCase().includes(searchString.toLowerCase());
                            case 3:
                                return risk?.resource_category.toLowerCase().includes(searchString.toLowerCase());
                            default:
                                return risk;
                        }
                    });
                });
                if (selectedBuckets.length > 0) {
                    setDisplayData(selectedBuckets);
                    callback && callback('');
                } else {
                    setDisplayData([]);
                    callback && callback('No Items found.');
                }
            } else {
                setDisplayData(riskDetail);
            }
        },
        [riskDetail, selectedFilerValue],
    );
    return (
        <>
            <div className="container d-flex px-0">
                <CHeader className="border-0 c-subheader">
                    <CNav variant="tabs" className="tabs-custom border-0">
                        {Tabs &&
                            Tabs.map((tab: any, index: number) => (
                                <CNavItem key={index}>
                                    <CNavLink
                                        className="p-0"
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
            {selectedMainTab === NAV_TABS_VALUE.APPLICATIONS_EXPOSED_TO_INTERNET && (
                <div className="container my-4 p-0">
                    <div className="d-flex align-items-center my-3">
                        <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded">
                            <div className="font-x-small-bold">{t('filter')}</div>
                            <div className="w-100">
                                <CDropdown placement="bottom" className="mx-1 p-2 w-100">
                                    <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                        <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {FilterItems.map((item: any, index: number) => (
                                            <CDropdownItem key={index} onClick={() => setSelectedFilerValue(item.id)}>
                                                {item.name}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                        </div>
                        <SearchInput customClass="w-50" onSearch={onSearch} placeholder="Search" />
                    </div>

                    <table className="table table-borderless table-hover container custom-table shadow-6 rounded overflow-hidden">
                        <thead>
                            <tr>
                                <th className=" px-3">Application Name</th>
                                <th className=" px-3">Application Details</th>
                                <th className=" px-3">Application Category</th>
                                <th className=" px-3">Application Type</th>
                                <th className=" px-3">Application ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableData?.length == 0 && (
                                <tr>
                                    <td colSpan={5} className="w-20">
                                        <Skeleton count={5} height={48} />
                                    </td>
                                </tr>
                            )}
                            {currentTableData?.length > 0 &&
                                currentTableData.map((risks: any) =>
                                    Object.values(risks).map((risk: any, index: any) => (
                                        <tr key={index}>
                                            <td>{risk.name}</td>
                                            <td>{risk.PlatformDetails}</td>
                                            <td>{risk.resource_category}</td>
                                            <td>{risk.resource_type} </td>
                                            <td>{risk.id} </td>
                                        </tr>
                                    )),
                                )}
                        </tbody>
                    </table>
                    <div className="fs-6 pagination-text-spacing text-end mb-3">
                        {/* was used for current show data {getDisplayedLogsCount()} */}
                        Showing {currentTableData?.length} out of {riskDetail?.length}
                    </div>
                    <Pagination
                        className="pagination-bar justify-content-end"
                        currentPage={currentPage}
                        totalCount={riskDetail?.length}
                        pageSize={PageSize}
                        siblingCount={1}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </div>
            )}
        </>
    );
};
export default ExposedApplications;
