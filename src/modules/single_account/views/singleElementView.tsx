import React from 'react';
import { useParams } from 'react-router-dom';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
const SingleDataElement = React.lazy(() => import('../data_endpoints/single_data_element/SingleDataElement'));
const SingleIdentityElement = React.lazy(() => import('../identities/single_identity_element/SingleIdentitiyElement'));

const SignelElementViews = () => {
    const params = useParams<any>();
    const selectedTabName: string = params?.tName || NAV_TABS_VALUE.DATA_ENDPOINTS;
    return (
        <div>
            {selectedTabName == NAV_TABS_VALUE.DATA_ENDPOINTS && <SingleDataElement />}
            {selectedTabName == NAV_TABS_VALUE.IDENTITIES && <SingleIdentityElement />}
        </div>
    );
};

export default SignelElementViews;
