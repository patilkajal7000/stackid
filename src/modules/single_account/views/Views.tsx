import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import AccountSettings from '../account_settings/AccountSettings';
import IdentitiesOverview from '../identities/identities_overview/IdentitiesOverview';
import ActionsOverview from '../actions/ActionsOverview';
import AnalyticsOverview from '../analytics/AnalyticsOverview';
import ApplicationsOverview from '../applications/ApplicationsOverview';
import { setGraphAllDataAction } from 'store/actions/GraphActions';
import { useDispatch } from 'react-redux';
const Policy = React.lazy(() => import('../policy/Policy'));
const DataEndpointSummary = React.lazy(() => import('../data_endpoints/data_endpoints_summary/DataEndpointSummary'));
const SingleAccountDashboard = React.lazy(() => import('../single_account_dashboard/SingleAccountDashboard'));

const Views = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setGraphAllDataAction({ trevalList: [], parent: [], selectedList: [] }));
    }, []);

    const params = useParams<any>();
    const selectedTabName: string = (params && params?.tName) || NAV_TABS_VALUE.DASHBOARD;
    return (
        <div>
            {selectedTabName == NAV_TABS_VALUE.DASHBOARD && <SingleAccountDashboard />}
            {selectedTabName == NAV_TABS_VALUE.APPLICATIONS && <ApplicationsOverview />}
            {selectedTabName == NAV_TABS_VALUE.DATA_ENDPOINTS && <DataEndpointSummary />}
            {selectedTabName == NAV_TABS_VALUE.POLICIES && <Policy />}
            {selectedTabName == NAV_TABS_VALUE.RISKS && <ActionsOverview />} {/* change the name Action To Risk */}
            {selectedTabName == NAV_TABS_VALUE.IDENTITIES && <IdentitiesOverview />}
            {selectedTabName == NAV_TABS_VALUE.CONFIGURATION && <AccountSettings />}
            {selectedTabName == NAV_TABS_VALUE.ANALYTICS && <AnalyticsOverview />}
        </div>
    );
};

export default Views;
