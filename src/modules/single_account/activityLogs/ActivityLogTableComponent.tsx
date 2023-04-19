import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentityActivityLog } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import dayjs from 'dayjs';

type TableComponentProps = {
    data: IdentityActivityLog[];
    isLoading: boolean;
    translate: any;
    selectedPage: number;
    setSelectedPage: any;
    totalLogs?: number;
    totalSearchedLogs?: number;
    identityActivityLogs?: any;
};

const PageSize = 15;

const ActivityLogTableComponent = ({
    data,
    isLoading,
    translate,
    selectedPage,
    setSelectedPage,
    totalLogs,
}: // totalSearchedLogs,
// identityActivityLogs,
TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) {
            selectedPage ? setCurrentPage(selectedPage) : setCurrentPage(1);
        }
    }, [data]);

    // const getDisplayedLogsCount = () => {
    //     const lastPageIndex = Math.floor(totalLogs / PageSize + 1);
    //     if (data?.length === PageSize) return currentPage * PageSize;
    //     else {
    //         if (currentPage === lastPageIndex) return totalLogs;
    //         else if (totalSearchedLogs !== 0) {
    //             return (currentPage - 1) * PageSize + totalSearchedLogs;
    //         }
    //     }
    // };

    // console.log('identityActivityLogs', identityActivityLogs);

    return (
        <>
            <table className="table table-borderless custom-table container mt-4 rounded overflow-hidden">
                <thead>
                    <tr>
                        <th> {translate('ConfigChangeEvent')} </th>
                        <th> {translate('event_name')} </th>
                        <th> {translate('event_source')} </th>
                        <th> {translate('event_time')} </th>
                        <th> {translate('org_id')} </th>
                        <th> {translate('user_identity_principal_id')} </th>
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
                            {data?.length > 0 &&
                                data?.map((item: IdentityActivityLog, index: number) => (
                                    <tr key={'activity_log_' + index} className="font-small">
                                        <td> {item.IsConfigChangeEvent.toString()} </td>
                                        <td>
                                            <div className="font-small-semibold"> {item?.event_name} </div>
                                        </td>
                                        <td> {item?.event_source} </td>

                                        <td> {dayjs(item?.start_time).format('DD/MM/YYYY | hh:mm')}</td>
                                        <td> {item?.org_id} </td>
                                        <td>
                                            {item?.user_identity_principal_id ? item?.user_identity_principal_id : '-'}
                                        </td>
                                    </tr>
                                ))}
                            {data?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={6}>{translate('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            {!isLoading && data?.length > 0 && (
                <div className={`container p-0 `} style={{ marginTop: '1.5rem' }}>
                    <div className="fs-6 pagination-text-spacing text-end mb-3">
                        {/* was used for current show data {getDisplayedLogsCount()} */}
                        Showing {data.length} out of {totalLogs}
                    </div>
                    <div className="d-block">
                        <Pagination
                            className="pagination-bar justify-content-end"
                            currentPage={currentPage}
                            totalCount={totalLogs}
                            pageSize={PageSize}
                            siblingCount={1}
                            onPageChange={(page: number) => {
                                setCurrentPage(page);
                                setSelectedPage(page);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(ActivityLogTableComponent);
