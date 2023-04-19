import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ResourcePermissionDetails } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';

type TableComponentProps = {
    data: ResourcePermissionDetails[];
    isLoading: boolean;
    translate: any;
};

const PageSize = 15;

const GCPResourcePermissionsTable = ({ data, isLoading, translate }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) setCurrentPage(1);
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
                        <th className="ps-5"> {translate('permission_name')} </th>
                        <th> {translate('permission_type')} </th>
                        <th> {translate('policy_name')} </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} className="p-0">
                                <Skeleton count={6} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: ResourcePermissionDetails, index: number) => (
                                    <tr key={index}>
                                        <td className="w-30 text-truncate ps-5" title={item.permission_name}>
                                            {' '}
                                            {item.permission_name}{' '}
                                        </td>
                                        <td> {item.permission_type}</td>
                                        <td>
                                            {item.role.map((policy: string, i: number) => (
                                                <span key={i}>
                                                    <span> {policy}</span>
                                                    {i <= item.role.length - 2 && <span>, </span>}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            {currentTableData?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={3}>{translate('no_records_available')} </td>
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

export default React.memo(GCPResourcePermissionsTable);
