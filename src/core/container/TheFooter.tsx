import React from 'react';
import { CFooter } from '@coreui/react';

const TheFooter = () => {
    return (
        <CFooter position={'sticky'}>
            <div className="mfs-auto">
                <span className="me-1">Powered by</span>
                <a href="/" target="_blank" rel="noopener noreferrer">
                    Stack Identity
                </a>
            </div>
        </CFooter>
    );
};

export default React.memo(TheFooter);
