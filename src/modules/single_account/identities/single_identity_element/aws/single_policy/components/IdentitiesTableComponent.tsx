import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Identity, IdentityType } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';

type TableComponentProps = {
    data: Identity[];
    isLoading: boolean;
    translate: any;
    selectedPage?: number;
};

const PageSize = 15;

const IdentitiesTableComponent = ({ data, isLoading, translate, selectedPage }: TableComponentProps) => {
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

    // const renderTooltip = (propsSingle: any) => (
    //     <CTooltip id="button-tooltip" className="custom-tooltip normal" {...propsSingle}>
    //         {translate('admin') + ' ' + translate('permission')}
    //     </CTooltip>
    // );

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
                                currentTableData?.map((item: Identity) => (
                                    <tr key={item.id} className="font-small">
                                        <td className="ps-5">
                                            {item.is_admin_permission && (
                                                <React.Fragment>
                                                    <CTooltip
                                                        trigger="hover"
                                                        placement="bottom"
                                                        content={translate('admin') + ' ' + translate('permission')}
                                                    >
                                                        <div className="cursor-pointer d-inline mt-1 me-2">
                                                            <CIcon icon={cilUser} className="pe-1" />
                                                        </div>
                                                    </CTooltip>
                                                </React.Fragment>
                                            )}
                                            {item.name}
                                        </td>
                                        <td>
                                            {item.identity_type == IdentityType.AwsIAMUser && translate('user')}
                                            {item.identity_type == IdentityType.AwsIAMRole && translate('role')}
                                            {item.identity_type == IdentityType.AwsIAMGroup && translate('group')}
                                        </td>
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

export default React.memo(IdentitiesTableComponent);
