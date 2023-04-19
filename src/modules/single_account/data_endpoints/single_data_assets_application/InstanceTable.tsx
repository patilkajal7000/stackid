import React, { useEffect, useMemo, useState } from 'react';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ApplicationsInstaceTable = (props: any) => {
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

    const currentTableData: any = useMemo(() => {
        if (allData) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return allData.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, allData]);

    return props.isError ? (
        <> </>
    ) : (
        <div className="container mt-3">
            {currentTableData && currentTableData?.length > 0 && (
                <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                    <thead className="border-bottom font-small-semibold">
                        <tr>
                            <th className="px-3 no-pointer">Instance Id</th>
                            <th className="px-4 no-pointer">Instance Name</th>
                            <th className="px-4 no-pointer">VPC ID</th>
                            <th className="px-4 no-pointer">SUBNET ID</th>
                            <th className="px-4 no-pointer">Security Groups</th>
                            <th className="px-4 no-pointer">Instace Profile</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentTableData?.map((app: any, index: number) => {
                            app['security_groups'] =
                                typeof app?.security_groups == 'string'
                                    ? JSON.parse(app?.security_groups)
                                    : app?.security_groups;
                            app['iam_instance_profile'] =
                                typeof app?.iam_instance_profile == 'string'
                                    ? JSON.parse(app?.iam_instance_profile)
                                    : app?.iam_instance_profile;

                            return (
                                <tr key={index}>
                                    <td className="px-4 no-pointer">{app?.instance_id}</td>
                                    <td className="px-4 no-pointer">{app?.name}</td>
                                    <td className="px-4 no-pointer">{app?.vpc_id}</td>
                                    <td className="px-4 no-pointer">{app?.subnet_id}</td>
                                    <td className="px-4 no-pointer">
                                        {app?.security_groups &&
                                            app?.security_groups.map((item1: any, i: any) => (
                                                <p key={i}>{item1?.GroupName}</p>
                                            ))}
                                    </td>
                                    <td className="px-4 no-pointer">
                                        {app?.iam_instance_profile && app?.iam_instance_profile?.Arn}
                                    </td>
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
            )}
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

export default ApplicationsInstaceTable;
