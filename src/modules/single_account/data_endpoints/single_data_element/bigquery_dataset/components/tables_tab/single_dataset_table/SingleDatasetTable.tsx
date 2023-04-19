import { getDatasetTableInsights } from 'core/services/DataEndpointsAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DatasetTableInsights } from 'shared/models/BigQueryDatasetModels';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { SCREEN_NAME, NAV_TABS_VALUE, ResourceType } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import SingleTableColumnsView from './column_tab/SingleTableColumnsView';
import TableIdentities from './identities_tab/TableIdentities';
import TableInsights from './table_insights/TableInsights';

const SingleDatasetTable = () => {
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type ? params?.type : '';
    const resourceId = params?.rid ? params?.rid : '';
    const selectedTabName: string = params?.datasetTableTabName ? params?.datasetTableTabName : '';
    const datasetTableId: string = params?.datasetTableId ? params?.datasetTableId : '';
    const dispatch = useDispatch();
    const [tableDetails, setTableDetails] = useState<DatasetTableInsights | undefined>();

    useEffect(() => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_DATASET_TABLE, selectedTabName, NAV_TABS_VALUE.DATA_ENDPOINTS));
    }, [selectedTabName]);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const DataAssetsPath =
                CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type;
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: ResourceType[type],
                    path: DataAssetsPath,
                },
                {
                    name: resourceId,
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/data_assets/bq_Dataset/' +
                        resourceId +
                        '/' +
                        NAV_TABS_VALUE.TABLES,
                    // type, // DataAssetsPath + '/' + resourceId + '/' + NAV_TABS_VALUE.TABLES,
                },
                {
                    name: tableDetails?.name || 'Columns',
                    path: '', // DataAssetsPath + '/' + resourceId + '/' + NAV_TABS_VALUE.TABLES,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });

        getDatasetTableInsights(cloudAccountId, resourceId, datasetTableId)
            .then((response: any) => {
                if (response) {
                    setTableDetails(response);
                }
            })
            .catch((error: any) => {
                console.log('in error', error);
            });
    }, []);

    return (
        <div>
            <> {tableDetails && <TableInsights {...tableDetails} />} </>
            <div>
                {selectedTabName == NAV_TABS_VALUE.COLUMNS && (
                    <div>
                        <SingleTableColumnsView
                            cloudAccountId={cloudAccountId}
                            datasetName={resourceId}
                            tableId={datasetTableId}
                            selectedTabName={selectedTabName}
                        />
                    </div>
                )}
                {selectedTabName == NAV_TABS_VALUE.IDENTITIES && (
                    <div className="text-center m-4">
                        <TableIdentities
                            cloudAccountId={cloudAccountId}
                            datasetName={resourceId}
                            tableId={datasetTableId}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleDatasetTable;
