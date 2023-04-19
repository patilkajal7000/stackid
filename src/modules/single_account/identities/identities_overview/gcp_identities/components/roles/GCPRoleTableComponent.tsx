import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import Pagination from 'shared/components/pagination/Pagination';
import { GCPRoleDetails } from 'shared/models/IdentityAccessModel';

type TableComponentProps = {
    data: GCPRoleDetails[];
    onClickRow: (identityId: string) => void;
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
};

const PageSize = 15;

const GCPRoleTableComponent = ({ data, onClickRow, isLoading, translate, currentPageNo }: TableComponentProps) => {
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
            <table className="table table-borderless table-hover custom-table container mt-4 rounded overflow-hidden">
                <thead>
                    <tr>
                        <th className="ps-4 w-40"> {translate('role_name')}</th>
                        <th className="ps-4">{translate('management')} </th>
                        <th className="w-15">{translate('identities')}</th>
                        <th className="w-15">{translate('resource_type')} </th>
                        <th className="w-15">{translate('permission_type')} </th>
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
                                currentTableData?.map((item: GCPRoleDetails, index: number) => (
                                    <tr key={index} onClick={() => onClickRow(item.role_id)}>
                                        <td className="ps-4 w-40"> {item.role_name} </td>
                                        <td> {item.management}</td>
                                        <td>
                                            {' '}
                                            {Object.keys(item.identities).map((key, index) => (
                                                <div key={index}>
                                                    {translate(key)}: {item.identities[key]}
                                                </div>
                                            ))}{' '}
                                        </td>
                                        <td> {translate(item.resource_type)}</td>
                                        <td> {item.permission_type}</td>
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
                    navigate('?pageNo=' + page);
                }}
            />
        </>
    );
};

export default React.memo(GCPRoleTableComponent);
