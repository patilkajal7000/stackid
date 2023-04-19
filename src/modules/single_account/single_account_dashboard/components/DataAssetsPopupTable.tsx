import React, { useState, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilElevator, cilSortAlphaDown, cilSortAlphaUp } from '@coreui/icons';
import dayjs from 'dayjs';

type TableComponentProps = {
    data: any[];
    onClickRow: (data: any, e: any) => void;
    isLoading: boolean;
    translate: any;
    resourceType: string;
};

const DataAssetsPopupTable = ({
    data: s3Data,
    onClickRow,
    isLoading,
    translate: translte,
    resourceType,
}: TableComponentProps) => {
    const [allData, setAllData] = useState<any[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [sortOrderName, setSortOrderName] = useState('');
    const PageSize = 15;
    const currentPageNo = 1;
    useEffect(() => {
        setAllData(s3Data);
        if (s3Data && s3Data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [s3Data]);

    const currentTableData = useMemo(() => {
        if (allData) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return allData.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, allData]);

    const sorting = (title: any) => {
        if (sortOrder === 'ascending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] > b[title] ? 1 : -1));
            if (title === 'name') {
                setSortOrderName('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'name') {
                setSortOrderName('descending');
            }
            setAllData(sortedData);
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };

    return (
        <>
            {isLoading ? (
                <CSpinner color="primary" />
            ) : (
                <div className="container px-0">
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        <thead className="border-bottom font-small-semibold">
                            <tr>
                                <th onClick={() => sorting('name')} className="w-40 px-3">
                                    {sortOrderName === 'ascending' ? (
                                        <CIcon icon={cilSortAlphaDown} className="me-1" />
                                    ) : sortOrderName === 'descending' ? (
                                        <CIcon icon={cilSortAlphaUp} className="me-1" />
                                    ) : (
                                        <CIcon icon={cilElevator} className="me-1" />
                                    )}
                                    {translte('bucket_name')}
                                </th>
                                <th className="w-5 text-nowrap">{translte('region')}</th>
                                <th className="w-15 no-pointer text-nowrap">{translte('created_at')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <Skeleton count={3} height={48} />
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {currentTableData &&
                                        currentTableData?.length > 0 &&
                                        currentTableData?.map((data: any, index: number) => {
                                            return (
                                                <tr
                                                    key={data?.resource_id}
                                                    className={` cursor-pointer w-40 text-nowrap ${
                                                        s3Data.length - 1 !== index ? 'border-bottom' : ''
                                                    }`}
                                                >
                                                    <td>
                                                        <div
                                                            role="presentation"
                                                            onClick={(e) =>
                                                                resourceType === 'aws_RelationalDatabaseService'
                                                                    ? null
                                                                    : onClickRow(data, e)
                                                            }
                                                        >
                                                            {data?.resource_name}
                                                        </div>
                                                    </td>
                                                    <td className="w-20 text-nowrap">
                                                        <div className="d-flex flex-row align-items-center justify-content-start ">
                                                            {data?.region}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {data?.created_at ? (
                                                            <div>
                                                                <div>{dayjs(data?.created_at).format('hh:mm A')}</div>
                                                                <div>
                                                                    {dayjs(data?.created_at).format('MMMM DD, YYYY')}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div> - </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    {currentTableData?.length == 0 && (
                                        <tr className="text-center">
                                            <td colSpan={5}>{translte('no_records_available')} </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar justify-content-end"
                        currentPage={currentPage}
                        totalCount={s3Data?.length}
                        pageSize={PageSize}
                        siblingCount={1}
                        onPageChange={(page: number) => {
                            setCurrentPage(page);
                            navigate('?pageNo=' + page);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default React.memo(DataAssetsPopupTable);
