import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilElevator, cilSortAlphaDown, cilSortAlphaUp } from '@coreui/icons';

type TableComponentProps = {
    data: any[];
    onClickRow: (idType: string) => void;
    isLoading: boolean;
    idType: any;
    translate: any;
};

const PageSize = 15;
const currentPageNo = 1;

const ApplicationsPopupTable = ({ data, onClickRow, isLoading, idType, translate }: TableComponentProps) => {
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
            if (title === 'application_name') {
                setSortOrderUser('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'application_name') {
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
                                <th onClick={() => sorting('application_name')} className="px-3 w-45">
                                    {sortOrderUser === 'ascending' ? (
                                        <CIcon icon={cilSortAlphaDown} className="me-1" />
                                    ) : sortOrderUser === 'descending' ? (
                                        <CIcon icon={cilSortAlphaUp} className="me-1" />
                                    ) : (
                                        <CIcon icon={cilElevator} className="me-1" />
                                    )}
                                    {translate('application_name')}
                                </th>
                                <th className="w-10 no-pointer px-3 text-nowrap">{translate('type')}</th>
                                <th className="w-10 no-pointer px-3 text-nowrap">{translate('exposed_to_internet')}</th>
                                <th className="w-10 no-pointer px-3 text-nowrap">{translate('environment')}</th>
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
                                            <tr key={index}>
                                                <td
                                                    role="presentation"
                                                    className="align-items-center ps-4"
                                                    onClick={() =>
                                                        idType === 'compute'
                                                            ? onClickRow('compute')
                                                            : onClickRow('serverless')
                                                    }
                                                >
                                                    {item?.application_name}
                                                </td>
                                                <td className="align-items-center ps-4">{item?.application_type}</td>
                                                <td className="align-items-center ps-4">
                                                    {item?.exposed_to_internet
                                                        ? item?.exposed_to_internet.toString()
                                                        : 'N/A'}
                                                </td>
                                                <td className="align-items-center ps-4">
                                                    {item?.application_environment}
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

export default React.memo(ApplicationsPopupTable);
