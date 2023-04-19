import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CSpinner, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilElevator, cilSortAlphaDown, cilSortAlphaUp, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';

type TableComponentProps = {
    data: any[];
    onClickRow: (identityId: string) => void;
    isLoading: boolean;
    translate: any;
    idType: any;
};

const PageSize = 15;
const currentPageNo = 1;

const IdentitiesPopupTable = ({ data, onClickRow, isLoading, translate, idType }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const [allData, setAllData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [sortOrderUser, setSortOrderUser] = useState('');

    useEffect(() => {
        setAllData(data);
        if (data && data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [data]);

    //sorting Data column
    const sorting = (title: any) => {
        if (sortOrder === 'ascending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] > b[title] ? 1 : -1));
            if (title === 'identity_name') {
                setSortOrderUser('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'identity_name') {
                setSortOrderUser('descending');
            }
            setAllData(sortedData);
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };

    const currentTableData = useMemo(() => {
        if (allData) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return allData.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, allData]);

    return (
        <>
            {isLoading ? (
                <CSpinner color="primary" />
            ) : (
                <>
                    <table className="table table-borderless table-hover custom-table container mt-4 rounded overflow-hidden">
                        <thead>
                            <tr>
                                <th onClick={() => sorting('identity_name')} className="px-3 w-45">
                                    {sortOrderUser === 'ascending' ? (
                                        <CIcon icon={cilSortAlphaDown} className="me-1" />
                                    ) : sortOrderUser === 'descending' ? (
                                        <CIcon icon={cilSortAlphaUp} className="me-1" />
                                    ) : (
                                        <CIcon icon={cilElevator} className="me-1" />
                                    )}
                                    {allData && allData[0]?.identity_type === IdentityType.AwsIAMRole
                                        ? translate('role')
                                        : translate('user')}
                                </th>
                                <th className="w-10 no-pointer px-3 text-nowrap">{translate('is_admin')}</th>
                                {idType !== 'role' && (
                                    <th className="w-15 no-pointer text-nowrap">{translate('mfa_enabled')}</th>
                                )}
                                <th className="w-10 no-pointer px-3 text-nowrap">{translate('created_at')}</th>
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
                                    {currentTableData &&
                                        currentTableData?.length > 0 &&
                                        currentTableData?.map((item: any, index: number) => (
                                            <tr key={index} onClick={() => onClickRow(item?.identity_id)}>
                                                <td className={`${!item?.is_admin}`}>
                                                    {item?.is_admin && (
                                                        <React.Fragment>
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content={
                                                                    translate('admin') + ' ' + translate('permission')
                                                                }
                                                            >
                                                                <div className="cursor-pointer d-inline mt-1 me-2">
                                                                    <CIcon icon={cilUser} className="pe-1" />
                                                                </div>
                                                            </CTooltip>
                                                        </React.Fragment>
                                                    )}
                                                    {item?.identity_name}
                                                </td>
                                                <td>{item?.is_admin !== null ? item?.is_admin.toString() : '-'}</td>
                                                {idType !== 'role' && (
                                                    <td>
                                                        {item?.mfa_enabled !== null
                                                            ? item?.mfa_enabled.toString()
                                                            : '-'}
                                                    </td>
                                                )}
                                                <td>
                                                    {item?.created_at ? (
                                                        <div>
                                                            <div>{dayjs(item?.created_at).format('hh:mm A')}</div>
                                                            <div>{dayjs(item?.created_at).format('MMMM DD, YYYY')}</div>
                                                        </div>
                                                    ) : (
                                                        <div> - </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {currentTableData?.length == 0 && (
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
                        totalCount={data?.length}
                        pageSize={PageSize}
                        siblingCount={1}
                        onPageChange={(page: number) => {
                            setCurrentPage(page);
                            navigate('?pageNo=' + page);
                        }}
                    />
                </>
            )}
        </>
    );
};

export default React.memo(IdentitiesPopupTable);
