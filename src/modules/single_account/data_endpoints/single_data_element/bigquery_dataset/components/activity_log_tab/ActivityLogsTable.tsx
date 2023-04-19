import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { DatasetActivityLog } from 'shared/models/BigQueryDatasetModels';

import dayjs from 'dayjs';
type ActivityLogsTableProps = {
    data: DatasetActivityLog[];
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
};

const PageSize = 15;

const ActivityLogsTable = ({ data, isLoading, translate, currentPageNo }: ActivityLogsTableProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const naviagte = useNavigate();

    useEffect(() => {
        if (data && data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [data]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, data]);

    return (
        <>
            <table className="table table-borderless custom-table container mt-4">
                <thead>
                    <tr className="text-start">
                        <th className="ps-4 "> {translate('activity')}</th>
                        <th className="">{translate('event_details')} </th>
                        <th className="">{translate('table_name')}</th>
                        <th className="">{translate('identity')} </th>
                        <th className="">{translate('date')} </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="p-0">
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData.length > 0 &&
                                currentTableData?.map((item: DatasetActivityLog, index: number) => (
                                    <tr key={index} className="ps-4 text-start">
                                        <td className="ps-4">
                                            {' '}
                                            <div className="font-small-semibold"> {item.activity} </div>
                                        </td>
                                        <td>{item.event_details}</td>
                                        <td>{item.table_name}</td>
                                        <td>{item.identity}</td>
                                        <td className="text-start">
                                            {item?.date && item?.date > -1 ? (
                                                <div>
                                                    <div>{dayjs.unix(item?.date).format('hh:mm A')}</div>
                                                    <div>
                                                        {dayjs.unix(item?.date).format('MMMM DD, YYYY').toString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div> - </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            {currentTableData.length == 0 && (
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
                totalCount={data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    naviagte('?pageNo=' + page);
                }}
            />
        </>
    );
};

export default React.memo(ActivityLogsTable);
