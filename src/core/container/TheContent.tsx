import React, { Suspense, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import NavTabs from 'shared/components/nav_tabs/NavTabs';
import { SCREEN_NAME, USER_DETAILS_COOKIE } from 'shared/utils/Constants';
import { setAuthTokens } from 'store/actions/AuthActions';
import modules from '../../modules';
import { AppState } from '../../store/store';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
);

const TheContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies();

    useEffect(() => {
        if (cookies && cookies[USER_DETAILS_COOKIE]) {
            dispatch(setAuthTokens(cookies[USER_DETAILS_COOKIE]));
            navigate(location.pathname);
        }
    }, []);

    const accessToken = useSelector((state: AppState) => state.authState.accessToken);
    const tabsState = useSelector((state: AppState) => state.tabsState);

    return (
        <main>
            <div className="main-view-container">
                <Suspense fallback={loading}>
                    {tabsState?.parentTab != '' && (
                        <NavTabs
                            activeTab={tabsState?.parentTab}
                            screenName={SCREEN_NAME.DATA_ENDPOINTS_SUMMARY}
                        ></NavTabs>
                    )}
                    {tabsState?.screenName != '' && (
                        <NavTabs activeTab={tabsState?.activeTab} screenName={tabsState?.screenName}></NavTabs>
                    )}
                    <div>
                        <Routes>
                            {!!accessToken &&
                                modules.map((module: any) =>
                                    module.map((component: any) => (
                                        // (<Route exact {...component.routeProps} key={component.name} />)

                                        <Route
                                            element={<component.routeProps.component />}
                                            path={component.routeProps.path}
                                            key={component.name}
                                        />
                                    )),
                                )}
                            {accessToken ? (
                                <Route path="/*" element={<Navigate to={CLOUDACCOUNT} />} />
                            ) : (
                                <Route path="/*" element={<Navigate to={'/login'} />} />
                            )}
                            {/* <Route path="/" render={() => <Redirect to={CLOUDACCOUNT} />} /> */}
                            {/* {accessToken ? <Redirect from="/" to={CLOUDACCOUNT} /> : <Redirect from="/" to="/login" />} */}
                        </Routes>
                    </div>
                </Suspense>
            </div>
        </main>
    );
};

export default React.memo(TheContent);
