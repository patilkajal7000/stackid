import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentityDetails } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { CTooltip } from '@coreui/react';
import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';

type TableComponentProps = {
    data: IdentityDetails[];
    onClickRow: (identityId: string) => void;
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
};

const PageSize = 15;

const GCPIdentitiesTableComponent = ({
    data,
    onClickRow,
    isLoading,
    translate,
    currentPageNo,
}: TableComponentProps) => {
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

    // const getAccessInfo = (accessTypes: string[]) => {
    //     if (accessTypes.includes('Console Access') && accessTypes.includes('programmatic_access')) {
    //         return 'Programmatic & Console Access';
    //     } else if (accessTypes.includes('Console Access')) {
    //         return 'Console Access';
    //     } else if (accessTypes.includes('programmatic_access')) {
    //         return 'Programmatic Access';
    //     } else {
    //         return '';
    //     }
    // };

    // const renderTooltip = (propsSingle: any) => (
    //     <CTooltip id="button-tooltip" className="custom-tooltip normal" {...propsSingle}>
    //         {translate('admin') + ' ' + translate('permission')}
    //     </CTooltip>
    // );

    return (
        <>
            <table className="table table-borderless table-hover custom-table container mt-4 rounded overflow-hidden">
                <thead>
                    <tr>
                        <th className="ps-4 w-20"> {translate('risk_type')}</th>
                        <th className="ps-4">{translate('user')} </th>
                        {/* <th className="ps-4">{translate('')} </th> */}
                        <CTooltip content="Last activity by User">
                            <th className="w-15">{translate('last_activity')}</th>
                        </CTooltip>
                        <th className="w-15"># {translate('dataset_access')} </th>
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
                                currentTableData?.map((item: IdentityDetails, index: number) => (
                                    <tr key={index} onClick={() => onClickRow(item.identity_id)}>
                                        <td className="ps-4">
                                            {item.risk_type
                                                ? item.risk_type.map((risk: string, i: number) => (
                                                      <span key={'risk_type_' + i}>
                                                          <span> {risk}</span>
                                                          {item.risk_type && i <= item.risk_type.length - 2 && (
                                                              <span>, </span>
                                                          )}
                                                      </span>
                                                  ))
                                                : '-'}
                                        </td>
                                        <td className="d-flex align-items-center">
                                            {item.permissions.includes('bigquery.admin') && (
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
                                            {item.identity_name}
                                        </td>
                                        {/* <td>
                                            <div>
                                                {item.is_admin_permission ? (
                                                    <><CheckCircle className="text-neutral-300" />Admin Permission  </>
                                                ) : ""}
                                            </div>
                                            <div>
                                                {item.permissions.length > 0 ? (
                                                    <>
                                                        <CheckCircle className="text-neutral-300" />
                                                        {getAccessInfo(item.permissions)}
                                                    </>) : ""}

                                            </div>
                                        </td> */}

                                        <td>
                                            {item?.last_activity && item?.last_activity > -1 ? (
                                                <div>
                                                    <div>{dayjs.unix(item?.last_activity).format('hh:mm A')}</div>
                                                    <div>{dayjs.unix(item?.last_activity).format('MMMM DD, YYYY')}</div>
                                                </div>
                                            ) : (
                                                <div> - </div>
                                            )}
                                        </td>
                                        <td> {item.resource_ids_count}</td>
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

export default React.memo(GCPIdentitiesTableComponent);
