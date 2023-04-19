import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentityResourceDetails } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { NAV_TABS_VALUE, ResourceType } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import {
    cilElevator,
    cilSortAlphaDown,
    cilSortAlphaUp,
    cilList,
    cilTag,
    cilPencil,
    cilNotes,
    cilLockUnlocked,
    cilLockLocked,
} from '@coreui/icons';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router';
import { CTooltip } from '@coreui/react';
type TableComponentProps = {
    handleOnCSV: (data: IdentityResourceDetails[]) => void;
    handleOnPDF: (data: IdentityResourceDetails[]) => void;
    data: IdentityResourceDetails[];
    onClickRow: (data: IdentityResourceDetails, currentPage: number, e: any) => void;
    isLoading: boolean;
    translate: any;
    selectedPage: number;
    showFullTable: boolean;
};

const PageSize = 15;

const TableComponent = ({
    handleOnCSV,
    handleOnPDF,
    data,
    onClickRow,
    isLoading,
    translate,
    selectedPage,
    showFullTable,
}: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [allData, setAllData] = useState<IdentityResourceDetails[]>([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [sortOrderName, setSortOrderName] = useState('');
    const [sortOrderType, setSortOrderType] = useState('');
    const [sortOrderPermission, setSortOrderPermission] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams<any>();
    useEffect(() => {
        setAllData(data);
    }, [data]);

    useEffect(() => {
        if (allData && allData.length > 0) {
            selectedPage ? setCurrentPage(selectedPage) : setCurrentPage(1);
        }
    }, [allData]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return allData?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, allData]);

    //sorting Data column
    const sorting = (title: any) => {
        if (sortOrder === 'ascending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] > b[title] ? 1 : -1));
            if (title === 'resource_name') {
                setSortOrderName('ascending');
            } else if (title === 'resource_type') {
                setSortOrderType('ascending');
            } else if (title === 'permissions') {
                setSortOrderPermission('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'resource_name') {
                setSortOrderName('descending');
            } else if (title === 'resource_type') {
                setSortOrderType('descending');
            } else if (title === 'permissions') {
                setSortOrderPermission('descending');
            }
            setAllData(sortedData);
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };
    useEffect(() => {
        handleOnPDF(allData);
        handleOnCSV(allData);
    }, [allData]);

    const showIdentitiesDetails = (record: any, evt: any) => {
        evt.stopPropagation();
        if (!record) {
            return false;
        }
        const cloudAccountType = record.resource_type;
        if (
            cloudAccountType === 'aws_S3' ||
            cloudAccountType === 'aws_RedshiftCluster' ||
            cloudAccountType === 'aws_RelationalDatabaseService'
        ) {
            const riskID = params.rid;
            const riskType = params.type;
            const path: any = location.pathname.replace(`identities/${riskType}/${riskID}/resources`, 'data_assets');
            navigate(path + '/' + cloudAccountType + '/' + record.resource_id + '/' + NAV_TABS_VALUE.RISK_MAP);
        }
    };

    return (
        <>
            <table
                id="export-pdf"
                className="table table-borderless table-hover custom-table container mt-4 rounded overflow-hidden"
            >
                <thead>
                    <tr>
                        {/* <th className="w-1"></th> */}
                        <th
                            onClick={() => sorting('resource_name')}
                            className={`${!showFullTable ? 'w-50' : 'w-30'} first-col`}
                        >
                            {sortOrderName === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="mx-1" />
                            ) : sortOrderName === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="mx-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="mx-1" />
                            )}
                            {translate('resource_name')}
                        </th>
                        <th onClick={() => sorting('resource_type')}>
                            {sortOrderType === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="mx-1" />
                            ) : sortOrderType === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="mx-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="mx-1" />
                            )}
                            {translate('resource_type')}
                        </th>
                        {showFullTable && (
                            <>
                                <th onClick={() => sorting('permissions')}>
                                    {sortOrderPermission === 'ascending' ? (
                                        <CIcon icon={cilSortAlphaDown} className="mx-1" />
                                    ) : sortOrderPermission === 'descending' ? (
                                        <CIcon icon={cilSortAlphaUp} className="mx-1" />
                                    ) : (
                                        <CIcon icon={cilElevator} className="mx-1" />
                                    )}
                                    {translate('permission_type')}
                                </th>
                                <CTooltip content="Last activity on the resource">
                                    <th className="no-pointer">
                                        {' '}
                                        {translate('last_activity')} <br /> {'(' + translate('data_assets') + ')'}{' '}
                                    </th>
                                </CTooltip>
                                <th className="no-pointer"> {translate('permission_details')} </th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <Skeleton count={6} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: IdentityResourceDetails) => (
                                    <tr key={item.resource_id} className="font-small">
                                        {/* <td><ReportProblemOutlined className="text-danger-dark" /> </td> */}
                                        <td
                                            role="presentation"
                                            onClick={(evt) => showIdentitiesDetails(item, evt)}
                                            className={`w-30 text-truncate first-col ${
                                                item?.resource_type === 'aws_S3' ||
                                                item?.resource_type === 'aws_RedshiftCluster' ||
                                                item?.resource_type === 'aws_RelationalDatabaseService'
                                                    ? 'pointer'
                                                    : 'no-pointer'
                                            }`}
                                            title={item.resource_name}
                                        >
                                            {item.resource_name}
                                        </td>
                                        <td className="no-pointer"> {ResourceType[item.resource_type]}</td>
                                        {showFullTable && (
                                            <>
                                                <td className="no-pointer d-flex flex-row">
                                                    {item?.permissions?.includes('Tagging') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Tagging Enabled"
                                                            >
                                                                <CIcon icon={cilTag} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Tagging Disabled"
                                                            >
                                                                <CIcon icon={cilTag} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {item?.permissions?.includes('Write') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Write Enabled"
                                                            >
                                                                <CIcon icon={cilPencil} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Write Disabled"
                                                            >
                                                                <CIcon icon={cilPencil} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {item?.permissions?.includes('Read') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Read Enabled"
                                                            >
                                                                <CIcon icon={cilNotes} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Read Disabled"
                                                            >
                                                                <CIcon icon={cilNotes} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {item?.permissions?.includes('List') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="List Enabled"
                                                            >
                                                                <CIcon icon={cilList} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="List Disabled"
                                                            >
                                                                <CIcon icon={cilList} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {item?.permissions?.includes('Permissions management') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Permissions Management Enabled"
                                                            >
                                                                <CIcon icon={cilLockLocked} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Permissions Management Disabled"
                                                            >
                                                                <CIcon icon={cilLockUnlocked} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}

                                                    {/*  {item.permissions && i <= item.permissions.length - 2 && (
                                                                <span>, </span>
                                                            )} */}
                                                </td>
                                                <td className="no-pointer">
                                                    {item?.last_activity && item?.last_activity > -1 ? (
                                                        <div>
                                                            <div>{dayjs(item?.last_activity).format('hh:mm A')}</div>
                                                            <div>
                                                                {dayjs(item?.last_activity).format('MMMM DD, YYYY')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div> - </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn-custom btn btn-link p-0"
                                                        onClick={(e) => {
                                                            onClickRow(item, currentPage, e);
                                                        }}
                                                    >
                                                        {translate('view')}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            {currentTableData?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={6}>{translate('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={data?.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>
    );
};

export default React.memo(TableComponent);
