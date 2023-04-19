import { getInsights } from 'core/services/DataEndpointsAPIService';
import ExposedApplications from 'modules/single_account/exposed_application/ExposedApplications';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RiskCardModel } from 'shared/models/RiskModel';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';

import { setSelectedBucketDetailsAction } from 'store/actions/SidebarAction';

import { AppState } from 'store/store';
import DataAssetActivityLog from '../../../activityLogs/DataAssetActivityLog';
import DataAssetIdentity from '../../single_data_asset_identity/DataAssetIdentity';
import DataElmentDetails from './components/data_element_details/DataElementDetails';
import { BucketDetails } from './risk_map/RiskMap';
const RiskMap = React.lazy(() => import('./risk_map/RiskMap'));
const RiskDetail = React.lazy(() => import('./../../../RiskDetails'));
const Policy = React.lazy(() => import('./single_data_elemet_policy/SingleDataElementPolicy'));

const SingleS3Element = () => {
    const rightSidebarState = useSelector((state: AppState) => state.rightSidebarState);
    const params = useParams<any>();
    const selectedTabName: string = (params && params?.SETName) || NAV_TABS_VALUE.RISK_MAP;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const type = params?.type || '';
    const resourceId = params?.rid || '';
    const [bucketDetails, setBucketDetails] = useState<BucketDetails | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const ref = useRef<any>();
    const rhsState = useSelector((state: AppState) => state.rightSidebarState);
    const risks: RiskCardModel[] = rhsState.sidebarJSON?.risks || [];

    useEffect(() => {
        // dispatch(setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT, NAV_TABS_VALUE.RISK_MAP));
        setIsLoading(true);
        window.scrollTo(0, 0);
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        getInsights(resourceId, cloudAccountId, type)
            .then((response: any) => {
                setIsLoading(false);

                if (response) {
                    const bucketDetailsObj: BucketDetails = {
                        name: response.resource_details.name,
                        creationDate: response.resource_details?.resource_details?.Details?.CreationDate,
                        createdBy: response.resource_details?.resource_details?.Acl?.Owner?.DisplayName,
                        resourceDetails: response.resource_details?.resource_details,
                        native_tags: response.resource_details?.native_tags,
                        data_security: response.resource_details?.data_security,
                    };

                    setBucketDetails(bucketDetailsObj);
                    dispatch(setSelectedBucketDetailsAction(response.resource_details));
                }
            })
            .catch((error: any) => {
                setIsLoading(false);
                console.log('in error', error);
            });
    }, []);

    return (
        // <div ref={ref}>
        <div ref={ref}>
            <>{bucketDetails && <DataElmentDetails isLoading={isLoading} {...bucketDetails} />}</>
            <div className={`${!rightSidebarState.sidebarShow ? 'sidebar-close-wrapper' : 'sidebar-open-wrapper'}`}>
                {selectedTabName == NAV_TABS_VALUE.RISK_MAP && <RiskMap />}
                {selectedTabName == NAV_TABS_VALUE.ACCESS_DETAILS && <DataAssetIdentity />}
                {selectedTabName == NAV_TABS_VALUE.POLICY && (
                    <Policy resourceId={resourceId} cloudAccountId={cloudAccountId} type={type} />
                )}
                {selectedTabName == NAV_TABS_VALUE.RISK_DETAILS && <RiskDetail risk={risks} />}
                {selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && <DataAssetActivityLog />}
                {selectedTabName == NAV_TABS_VALUE.APPLICATIONS_EXPOSED && <ExposedApplications />}
                {/*selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && (
                    <div className="text-center mt-4"> Activity logs details coming soon </div>
                )*/}
                {/* {rightSidebarState.showPanelToggler && (
                    <RightSidePanelToggler customClass={''} customStyle={{ backgroundColor: '#619EA5' }} iconColor="" />
                )}
                <RHSPanel /> */}
            </div>
        </div>
    );
};

export default SingleS3Element;
