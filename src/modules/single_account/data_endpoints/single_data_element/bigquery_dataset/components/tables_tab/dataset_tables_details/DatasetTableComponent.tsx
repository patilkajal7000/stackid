import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { DatasetTableDetails } from 'shared/models/BigQueryDatasetModels';
import { CImage, CTooltip } from '@coreui/react';

type TableComponentProps = {
    data: DatasetTableDetails[];
    onClickRow: (identityId: string) => void;
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
};

const PageSize = 15;

const DatasetTableComponent = ({ data, onClickRow, isLoading, translate, currentPageNo }: TableComponentProps) => {
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
                        <th className="ps-4 text-start w-50"> {translate('table_name')}</th>
                        <th className="">{translate('classification')} </th>
                        <th className="">{translate('last_access_in_days')}</th>
                        <th className="">{translate('action')} </th>
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
                                currentTableData?.map((item: DatasetTableDetails, index: number) => (
                                    <tr key={index} onClick={() => onClickRow(item.table_id)}>
                                        <td className="ps-4 text-start w-50"> {item.table_name}</td>
                                        <td>{item.classification}</td>
                                        <td>{item.last_access_in_30_days}</td>
                                        <td>
                                            {' '}
                                            <div className="d-flex justify-content-center">
                                                <div className="ms-3">
                                                    <CTooltip trigger="hover" placement="bottom" content="Slack">
                                                        <CImage src={require('assets/images/slack.svg')} />
                                                    </CTooltip>
                                                </div>
                                                <div className="mx-1">
                                                    <CTooltip trigger="hover" placement="bottom" content="Jira">
                                                        <CImage src={require('assets/images/jira.svg')} />
                                                    </CTooltip>
                                                </div>
                                                <div className="mx-1">
                                                    <CTooltip trigger="hover" placement="bottom" content="PagerDuty">
                                                        <CImage src={require('assets/images/pagerduty.svg')} />
                                                    </CTooltip>
                                                </div>
                                            </div>{' '}
                                        </td>
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

export default React.memo(DatasetTableComponent);
