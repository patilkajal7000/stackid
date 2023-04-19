import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, ResourceType } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import SingleDatasetElement from './bigquery_dataset/SingleDatasetElement';
import SingleS3Element from './aws_s3_bucket/SingleS3Element';
import { AppState } from 'store/store';

const SingleDataElement = () => {
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type ? params?.type : '';
    const resourceId: any = params?.rid;
    const dispatch = useDispatch();
    const selectedData: any = useSelector((state: AppState) => state.graphState.selectedData);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: ResourceType[type],
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.DATA_ENDPOINTS +
                        '/' +
                        type,
                },
                {
                    name: resourceId,
                    path: '',
                    // CLOUDACCOUNT +
                    // '/' +
                    // cloudAccountId +
                    // '/' +
                    // cloudAccountType +
                    // '/' +
                    // NAV_TABS_VALUE.DATA_ENDPOINTS +
                    // '/' +
                    // type +
                    // '/' +
                    // resourceId +
                    // '/' +
                    // NAV_TABS_VALUE.RISK_MAP,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
    }, [selectedData]);

    return (
        <>{type == 'bq_Dataset' ? <SingleDatasetElement /> : <SingleS3Element />}</>
        // <div ref={ref}>
        //     <>{bucketDetails && <DataElmentDetails isLoading={isLoading} {...bucketDetails} />}</>
        //     <div className={`${!rightSidebarState.sidebarShow ? 'sidebar-close' : 'sidebar-open'}`}>
        //         {selectedTabName == NAV_TABS_VALUE.RISK_MAP && <RiskMap />}
        //         {selectedTabName == NAV_TABS_VALUE.POLICY && (
        //             <Policy resourceId={resourceId} cloudAccountId={cloudAccountId} type={type} />
        //         )}
        //         {selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && (
        //             <div className="text-center mt-4"> Activity logs details coming soon </div>
        //         )}
        //         {rightSidebarState.showPanelToggler && (
        //             <RightSidePanelToggler customClass={''} customStyle={{ backgroundColor: '#619EA5' }} iconColor="" />
        //         )}
        //         <RHSPanel />
        //     </div>
        // </div>
    );
};

export default SingleDataElement;
