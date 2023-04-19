import React, { useEffect, useState } from 'react';

import { CLOUDACCOUNT } from 'modules/cloud_accounts';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';

import { getCloudAccountNameById } from 'shared/service/AppService';
import { DATA_ASSETS, NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { changeRightSidebarAction, toggleRHSPanelAction } from 'store/actions/SidebarAction';
import { setTabsAction } from 'store/actions/TabsStateActions';
import 'translation/i18n';
import DataEndpointHeader from './components/DataEndpointHeader';
import S3BucketDetails from './S3BucketDetails';
import BigQueryDetails from './BigQueryDetails';

const DataEndpointSummary = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';
    const selectedTabName: string | undefined = params && params?.tName;
    const [selectedDataAssest, setSelectedDataAssest] = useState<string>();

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                { name: 'Data Assets', path: '' },
            ];

            dispatch(setBreadcrumbAction(breadcrumbData));
        });

        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, ''));

        return () => {
            dispatch(changeRightSidebarAction(false));
            dispatch(toggleRHSPanelAction(false));
        };
    }, []);

    const onDataAssestsChange = (selectedDataAssest: { id: string; resource_type: string }) => {
        setSelectedDataAssest(selectedDataAssest.id);
        navigate(`/accounts/${cloudAccountId}/${cloudAccountType}/data_assets/${selectedDataAssest.resource_type}`);
    };

    return (
        <div>
            {selectedTabName == NAV_TABS_VALUE.DATA_ENDPOINTS && (
                <>
                    <DataEndpointHeader resourceType={type} onDataAssestsChange={onDataAssestsChange} />

                    {selectedDataAssest == DATA_ASSETS.S3_BUCKET && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.RED_SHIFT && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.RDS_INSTANCE && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.RDS_CLUSTER && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.DYNAMODB_TABLE && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.DYNAMODB_EXPORT && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {/* {selectedDataAssest == DATA_ASSETS.RDS && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}
                    {selectedDataAssest == DATA_ASSETS.DYNAMODB && (
                        <S3BucketDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )} */}
                    {selectedDataAssest == DATA_ASSETS.BIG_QUERY && (
                        <BigQueryDetails cloudAccountId={cloudAccountId} resource_type={type} />
                    )}

                    {selectedDataAssest == DATA_ASSETS.DATA_WAREHOUSE && (
                        <div className="container-fluid text-center mt-5"> Comming soon </div>
                    )}

                    {selectedDataAssest == DATA_ASSETS.DATABASE && (
                        <div className="container-fluid text-center mt-5"> Comming soon </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DataEndpointSummary;
