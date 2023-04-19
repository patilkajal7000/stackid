import { getDatasetTables } from 'core/services/DataEndpointsAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate, useLocation } from 'react-router-dom';
import SearchInput from 'shared/components/search_input/SearchInput';
import { DatasetTableDetails } from 'shared/models/BigQueryDatasetModels';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE } from 'shared/utils/Constants';

import DatasetTableComponent from './DatasetTableComponent';

type DatasetTablesViewProps = {
    cloudAccountId: number;
    datasetName: string;
    selectedTabName: string;
};

const DatasetTablesView = (props: DatasetTablesViewProps) => {
    const [dataTablesRecords, setDataTablesRecords] = useState<DatasetTableDetails[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<DatasetTableDetails[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo'); // bar
    const { t } = useTranslation();

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
        }
        setIsLoading(true);
        getDatasetTables(props.cloudAccountId, props.datasetName)
            .then((response: any) => {
                setIsLoading(false);
                if (response) {
                    setDataTablesRecords(response);
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
                const selectedTables = dataTablesRecords?.filter((data: DatasetTableDetails) =>
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
                setFilteredRecords(dataTablesRecords);
            }
        },
        [dataTablesRecords],
    );

    const onClickRow = (tableId: string) => {
        navigate('table/' + tableId + '/' + NAV_TABS_VALUE.COLUMNS);
    };

    return (
        <>
            <div className="container my-5">
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchTables} placeholder="Search" />
                </div>

                <DatasetTableComponent
                    currentPageNo={currentPage}
                    onClickRow={(tableId: string) => onClickRow(tableId)}
                    data={filteredRecords}
                    isLoading={isLoading}
                    translate={t}
                />
            </div>
        </>
    );
};

export default React.memo(DatasetTablesView);
