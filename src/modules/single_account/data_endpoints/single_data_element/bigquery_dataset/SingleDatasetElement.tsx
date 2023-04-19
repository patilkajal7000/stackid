import { getDataSetInsights } from 'core/services/DataEndpointsAPIService';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setTabsAction } from 'store/actions/TabsStateActions';
import DatasetActivityLogs from './components/activity_log_tab/DatasetActivityLogs';
import DatasetInsights from './components/dataset_insights/DatasetInsights';
import DatasetIdentities from './components/identities_tab/DatasetIdentities';
import DatasetTablesView from './components/tables_tab/dataset_tables_details/DatasetTablesView';

export type DatasetDetails = {
    id: string;
    name: string;
    project_name: string;
    is_encrypted: string;
    is_public: string;
    tags: any;
};

const SingleDatasetElement = () => {
    const params = useParams<any>();
    const selectedTabName: string = params?.SETName || NAV_TABS_VALUE.TABLES;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const resourceId = params?.rid || '';
    const [datasetDetails, setDatasetDetails] = useState<DatasetDetails | undefined>();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT_DATASET, selectedTabName, NAV_TABS_VALUE.DATA_ENDPOINTS),
        );

        // dispatch(setTabsAction(SCREEN_NAME.SINGLE_DATASET_TABLE, selectedTabName, NAV_TABS_VALUE.DATA_ENDPOINTS));
    }, [selectedTabName]);
    useEffect(() => {
        dispatch(
            setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT_DATASET, selectedTabName, NAV_TABS_VALUE.DATA_ENDPOINTS),
        );

        getDataSetInsights(cloudAccountId, resourceId)
            .then((response: any) => {
                if (response) {
                    setDatasetDetails(response);
                }
            })
            .catch((error: any) => {
                console.log('in error', error);
            });
    }, []);

    return (
        <div>
            <> {datasetDetails && <DatasetInsights {...datasetDetails} />} </>
            <div>
                {selectedTabName == NAV_TABS_VALUE.TABLES && (
                    <div className="text-center mt-4">
                        <DatasetTablesView
                            cloudAccountId={cloudAccountId}
                            datasetName={resourceId}
                            selectedTabName={selectedTabName}
                        />
                    </div>
                )}
                {selectedTabName == NAV_TABS_VALUE.IDENTITIES && (
                    <div className="text-center mt-4">
                        <DatasetIdentities cloudAccountId={cloudAccountId} datasetName={resourceId} />
                    </div>
                )}
                {selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && (
                    <div className="text-center mt-4">
                        <DatasetActivityLogs cloudAccountId={cloudAccountId} datasetName={resourceId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleDatasetElement;
