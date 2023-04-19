import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import Pagination from 'shared/components/pagination/Pagination';
import { GCPIdentityDetails } from 'shared/models/IdentityAccessModel';
import dayjs from 'dayjs';
type TableComponentProps = {
    data: GCPIdentityDetails[];
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
    onClickView: (identityDetails: GCPIdentityDetails) => void;
};

const PageSize = 15;

const DatasetIdentitiesTable = ({ data, isLoading, translate, currentPageNo, onClickView }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

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
                    <tr>
                        <th className="ps-4 text-start w-50"> {translate('name')}</th>
                        <th className="">{translate('permission_type')} </th>
                        <th className="">{translate('permission_details')}</th>
                        <th className="text-start">{translate('last_activity')} </th>
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
                            {currentTableData.length > 0 &&
                                currentTableData?.map((item: GCPIdentityDetails, index: number) => (
                                    <tr key={index}>
                                        <td className="ps-4 text-start w-50"> {item.name}</td>
                                        <td>{item.permission_type}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-custom btn btn-link"
                                                onClick={() => onClickView(item)}
                                            >
                                                {translate('view')}
                                            </button>
                                        </td>
                                        <td className="text-start">
                                            {item?.last_activity && item?.last_activity > -1 ? (
                                                <div>
                                                    <div>{dayjs.unix(item?.last_activity).format('hh:mm A')}</div>
                                                    <div>{dayjs.unix(item?.last_activity).format('MMMM DD, YYYY')}</div>
                                                </div>
                                            ) : (
                                                <div> - </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            {currentTableData.length == 0 && (
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
                totalCount={data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    navigate('?pageNo=' + page);
                }}
            />
        </>
    );
};

export default React.memo(DatasetIdentitiesTable);
