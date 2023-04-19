import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GCPIdentityResourceDetails } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import dayjs from 'dayjs';
import { CTooltip } from '@coreui/react';

type TableComponentProps = {
    data: GCPIdentityResourceDetails[];
    onClickRow: (data: GCPIdentityResourceDetails, currentPage: number, e: any) => void;
    isLoading: boolean;
    translate: any;
    selectedPage: number;
    showFullTable: boolean;
};

const PageSize = 15;

const IdentityTableComponent = ({ data, isLoading, translate, selectedPage }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) {
            selectedPage ? setCurrentPage(selectedPage) : setCurrentPage(1);
        }
    }, [data]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, data]);

    return (
        <>
            <table className="table table-borderless custom-table container mt-4 rounded overflow-hidden">
                <thead>
                    <tr>
                        {/* <th className="w-1"></th> */}
                        <th className={`w-30 first-col`}>{translate('resource_name')}</th>
                        <th> {translate('resource_type')} </th>
                        <th> {translate('classification')} </th>
                        <th> {translate('permission_type')} </th>
                        <CTooltip content="Last activity on the resource">
                            <th> {translate('last_activity')} </th>
                        </CTooltip>
                        {/* <th> {translate('permission_details')} </th> */}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="p-0">
                                <Skeleton count={7} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: GCPIdentityResourceDetails) => (
                                    <tr key={item.resource_id} className="font-small">
                                        {/* <td><ReportProblemOutlined className="text-danger-dark" /> </td> */}
                                        <td className="w-30 text-truncate first-col" title={item.resource_name}>
                                            {item.resource_name}
                                        </td>
                                        <td> {translate(item.resource_type)}</td>
                                        <td> {item.classification} </td>
                                        <td> {item.permission_type} </td>
                                        <td>
                                            {' '}
                                            {item?.last_activity && item?.last_activity > -1 ? (
                                                <div>
                                                    <div>{dayjs.unix(item?.last_activity).format('hh:mm A')}</div>
                                                    <div>{dayjs.unix(item?.last_activity).format('MMMM DD, YYYY')}</div>
                                                </div>
                                            ) : (
                                                <div> - </div>
                                            )}
                                        </td>
                                        {/* <td>
                                            <button
                                                type="button"
                                                className="btn-custom btn btn-link"
                                                onClick={(e) => {
                                                    onClickRow(item, currentPage, e);
                                                }}
                                            >
                                                {translate('view')}
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            {currentTableData?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={5}>{translate('no_records_available')} </td>
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

export default React.memo(IdentityTableComponent);
