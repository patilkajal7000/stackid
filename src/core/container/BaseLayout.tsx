import React from 'react';
import { CContainer } from '@coreui/react';

type BaseLayoutProps = {
    children: React.ReactNode;
    columnSize?: string;
    classes?: string;
};
const BaseLayout = (props: BaseLayoutProps) => {
    return (
        <div className="c-app c-default-layout mt-3 justify-content-start">
            <CContainer fluid className={`${props.classes} col-8 col-md-10 col-sm-10 col-lg-10 col-xl-10`}>
                {props.children}
            </CContainer>
        </div>
    );
};

export default BaseLayout;
