import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import ApplicationDetails from './ApplicationDetails';

const ApplicationMap = React.lazy(() => import('./ApplicationMap'));
function SingleApplication() {
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';
    const sid: any = params?.sid;
    const selectedTabName: string = (params && params?.tName) || NAV_TABS_VALUE.APPLICATIONS_MAP;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_APPLICATION_ELEMENT, selectedTabName, NAV_TABS_VALUE.APPLICATIONS));
    }, [selectedTabName]);
    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: NAV_TABS_VALUE.APPLICATIONS,
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.APPLICATIONS +
                        '/Overview',
                },
                { name: sid, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
    }, []);

    return (
        <div>
            {selectedTabName == NAV_TABS_VALUE.APPLICATIONS_DETAILS && <ApplicationDetails />}
            {selectedTabName == NAV_TABS_VALUE.APPLICATIONS_MAP && <ApplicationMap />}
        </div>
    );
}

export default SingleApplication;
