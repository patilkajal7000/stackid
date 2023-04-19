import { CCard } from '@coreui/react';
import React from 'react';
import { MINVIEW, MAXVIEW } from 'shared/utils/Constants';

type AuthLayoutProps = {
    children: React.ReactNode;
    withIcon: boolean;
    columSize: typeof MINVIEW | typeof MAXVIEW;
};

const AuthLayout = (props: AuthLayoutProps) => {
    return (
        <div className="c-app c-default-layout auth-contianer align-items-center">
            {props.withIcon && (
                <div className="logo">
                    <img src={require('assets/images/Logo.png')} alt="Logo" />
                </div>
            )}
            <div className="login-left"></div>
            <div className="login-right"></div>
            <div className="container-fluid">
                <div className="container d-flex justify-content-center align-items-center">
                    <CCard
                        className={`custom-card d-flex alig-items-start auth-card mb-0 ${
                            props.columSize === MINVIEW ? 'w-50' : 'w-100'
                        }`}
                    >
                        {props.children}
                    </CCard>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

AuthLayout.defaultProps = {
    withIcon: true,
    columSize: MINVIEW,
};
