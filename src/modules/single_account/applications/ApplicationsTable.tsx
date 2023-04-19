import React, { useEffect, useMemo, useState } from 'react';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ApplicationsTable = (props: any) => {
    const { t } = useTranslation();
    const { applicationsData, isError } = props;
    const [allData, setAllData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const PageSize = 15;
    const currentPageNo = 1;

    useEffect(() => {
        setAllData(applicationsData);
        if (applicationsData && applicationsData.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [applicationsData]);

    const currentTableData = useMemo(() => {
        if (allData) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return allData.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, allData]);

    return (
        <div className="container mt-3">
            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                <thead className="border-bottom font-small-semibold">
                    <tr>
                        <th className="px-3">
                            Application Name ({applicationsData?.length ? applicationsData?.length : 0})
                        </th>
                        <th className="no-pointer px-3">Type</th>

                        <th className="no-pointer px-3">Exposed To Internet</th>
                        <th className="no-pointer px-3">Environment</th>
                    </tr>
                </thead>

                <tbody>
                    {currentTableData &&
                        currentTableData?.length > 0 &&
                        currentTableData?.map((app: any, index: number) => {
                            return (
                                <tr key={index} onClick={() => props.onClickRow(app.application_id, app)}>
                                    <td>{app?.application_name}</td>
                                    <td>{app?.application_type}</td>
                                    <td>{app?.exposed_to_internet ? app?.exposed_to_internet : 'N/A'}</td>
                                    <td>{app?.application_environment}</td>
                                </tr>
                            );
                        })}

                    {currentTableData?.length == 0 ||
                        (isError && (
                            <tr className="text-center">
                                <td colSpan={5}>{t('no_records_available')} </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="fs-6 pagination-text-spacing text-end mb-3">
                {/* was used for current show data {getDisplayedLogsCount()} */}
                Showing {currentTableData?.length} out of {applicationsData?.length}
            </div>
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={applicationsData?.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    navigate('?pageNo=' + page);
                }}
            />
        </div>
    );
};

export default ApplicationsTable;
