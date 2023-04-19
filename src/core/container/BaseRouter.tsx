import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
);

const domainName = window.location.hostname;

// Containers
const TheLayout = React.lazy(() => import('core/container/TheLayout'));

// Pages
const Login = React.lazy(() => import('modules/auth/login/Login'));
const Register = React.lazy(() => import('modules/auth/register/Register'));
const Page404 = React.lazy(() => import('modules/auth/page404/Page404'));
const Page500 = React.lazy(() => import('modules/auth/page500/Page500'));
const ForgotPassword = React.lazy(() => import('modules/auth/forgot_password/ForgotPassword'));
const ResetPassword = React.lazy(() => import('modules/auth/reset_password/ResetPassword'));
const ActivateUser = React.lazy(() => import('modules/auth/activate_user/ActivateUser'));
const InvitedUser = React.lazy(() => import('modules/auth/invited_user/InvitedUser'));
const RiskDetail = React.lazy(() => import('modules/single_account/RiskDetails'));

const BaseRouter = () => {
    return (
        <HashRouter>
            <React.Suspense fallback={loading}>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {domainName === 'staging-portal.acs.stackidentity.com' ||
                    domainName === 'portal.acs.stackidentity.com' ? (
                        <Route path="/login" element={<Login />} />
                    ) : (
                        <Route path="/register" element={<Register />} />
                    )}
                    <Route path="/404" element={<Page404 />} />
                    <Route path="/500" element={<Page500 />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/activate-user" element={<ActivateUser />} />
                    <Route path="/invited-user" element={<InvitedUser />} />
                    <Route path="/*" element={<TheLayout />} />
                    <Route path="/risk-details" element={<RiskDetail risk={undefined} />} />
                </Routes>
            </React.Suspense>
        </HashRouter>
    );
};

export default BaseRouter;
