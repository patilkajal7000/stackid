import { getDatasetActivityLogs } from 'core/services/DataEndpointsAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SearchInput from 'shared/components/search_input/SearchInput';
import { DatasetActivityLog } from 'shared/models/BigQueryDatasetModels';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import ActivityLogsTable from './ActivityLogsTable';

type DatasetActivityLogsProps = {
    cloudAccountId: number;
    datasetName: string;
};

const DatasetActivityLogs = (props: DatasetActivityLogsProps) => {
    const [datasetActivityLogs, setDatasetActivityLogs] = useState<DatasetActivityLog[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<DatasetActivityLog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo'); // bar
    const { t } = useTranslation();

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
        }
        setIsLoading(true);
        getDatasetActivityLogs(props.cloudAccountId, props.datasetName)
            .then((response: any) => {
                setIsLoading(false);
                if (response) {
                    setDatasetActivityLogs(response);
                    setFilteredRecords(response);
                }
            })
            .catch((error: any) => {
                setIsLoading(false);
                console.log('in error', error);
            });
    }, []);

    const onSearchTables = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedTables = datasetActivityLogs?.filter((data: DatasetActivityLog) =>
                    data.table_name.toLowerCase().includes(searchString.toLowerCase()),
                );
                if (selectedTables && selectedTables.length > 0) {
                    setFilteredRecords(selectedTables);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(datasetActivityLogs);
            }
        },
        [datasetActivityLogs],
    );

    return (
        <>
            <div className="container my-5">
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchTables} placeholder="Search" />
                </div>

                <ActivityLogsTable
                    currentPageNo={currentPage}
                    data={filteredRecords}
                    isLoading={isLoading}
                    translate={t}
                />
            </div>
        </>
    );
};

export default React.memo(DatasetActivityLogs);
