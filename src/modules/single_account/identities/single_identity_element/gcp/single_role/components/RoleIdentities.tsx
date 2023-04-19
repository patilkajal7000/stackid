import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'shared/components/pagination/Pagination';
import { GCPRoleIdentity } from 'shared/models/IdentityAccessModel';

type TableComponentProps = {
    data: GCPRoleIdentity[];
    isLoading: boolean;
    translate: any;
    selectedPage?: number;
};

const PageSize = 15;

const RoleIdentities = ({ data, isLoading, translate, selectedPage }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) {
            selectedPage ? setCurrentPage(selectedPage) : setCurrentPage(1);
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
                        <th className="w-75 ps-5"> {translate('name')} </th>
                        <th> {translate('type')} </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={2} className="p-0">
                                <Skeleton count={6} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData.length > 0 &&
                                currentTableData?.map((item: GCPRoleIdentity, index: number) => (
                                    <tr key={'role_identites_' + index} className="font-small">
                                        <td className="ps-5"> {item.identity_name} </td>
                                        <td> {translate(item.identity_type)} </td>
                                    </tr>
                                ))}
                            {currentTableData.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={2}>{translate('no_records_available')} </td>
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
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>
    );
};

export default React.memo(RoleIdentities);
