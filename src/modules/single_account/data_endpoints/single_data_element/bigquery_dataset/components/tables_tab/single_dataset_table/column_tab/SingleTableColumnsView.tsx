import { getTableColumns } from 'core/services/DataEndpointsAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SearchInput from 'shared/components/search_input/SearchInput';
import { SingleTableColumnDetails } from 'shared/models/BigQueryDatasetModels';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import SingleTableCloumsDetails from './SingleTableCloumsDetails';

type SingleTableColumnsViewProps = {
    cloudAccountId: number;
    datasetName: string;
    tableId: string;
    selectedTabName: string;
};

const SingleTableColumnsView = (props: SingleTableColumnsViewProps) => {
    const [columnsRecords, setColumnsRecords] = useState<SingleTableColumnDetails[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<SingleTableColumnDetails[]>([]);
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
        getTableColumns(props.cloudAccountId, props.datasetName, props.tableId)
            .then((response: any) => {
                setIsLoading(false);
                if (response) {
                    setColumnsRecords(response);
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
                const selectedTables = columnsRecords?.filter((data: SingleTableColumnDetails) =>
                    data.col_name.toLowerCase().includes(searchString.toLowerCase()),
                );
                if (selectedTables && selectedTables.length > 0) {
                    setFilteredRecords(selectedTables);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(columnsRecords);
            }
        },
        [columnsRecords],
    );

    const onClickRow = (colId: string) => {
        console.log(colId);
        // history.push(props.selectedTabName + '/table/' + tableId + '/' + NAV_TABS_VALUE.COLUMNS);
    };

    return (
        <>
            <div className="container my-5">
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchTables} placeholder="Search" />
                </div>

                <SingleTableCloumsDetails
                    currentPageNo={currentPage}
                    onClickRow={(colId: string) => onClickRow(colId)}
                    data={filteredRecords}
                    isLoading={isLoading}
                    translate={t}
                />
            </div>
        </>
    );
};

export default React.memo(SingleTableColumnsView);
