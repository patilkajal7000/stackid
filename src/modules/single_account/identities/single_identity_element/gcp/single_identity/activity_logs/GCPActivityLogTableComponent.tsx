import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GCPIdentityActivityLog } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import dayjs from 'dayjs';

type TableComponentProps = {
    data: GCPIdentityActivityLog[];
    isLoading: boolean;
    translate: any;
    selectedPage: number;
};

const PageSize = 15;

const AcivityLogTableComponent = ({ data, isLoading, translate, selectedPage }: TableComponentProps) => {
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
            <table className="table table-borderless custom-table container mt-4">
                <thead>
                    <tr>
                        {/* <th className="w-1"></th> */}
                        <th> {translate('event')} </th>
                        <th> {translate('event_details')} </th>
                        <th> {translate('date')} </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="p-0">
                                <Skeleton count={4} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: GCPIdentityActivityLog, index: number) => (
                                    <tr key={'activity_log_' + index} className="font-small">
                                        <td>
                                            {' '}
                                            <div className="font-small-semibold"> {item.activity} </div>
                                        </td>
                                        {/* <td> {item.event_name} </td> */}
                                        <td> {item.event_details} </td>
                                        <td>
                                            {' '}
                                            {item?.date && item?.date > -1 ? (
                                                <div>
                                                    <div>{dayjs.unix(item?.date).format('hh:mm A')}</div>
                                                    <div>{dayjs.unix(item?.date).format('MMMM DD, YYYY')}</div>
                                                </div>
                                            ) : (
                                                <div> - </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            {currentTableData?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={4}>{translate('no_records_available')} </td>
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

export default React.memo(AcivityLogTableComponent);
