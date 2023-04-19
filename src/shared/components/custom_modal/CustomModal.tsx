import React from 'react';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

type CustomModalProps = {
    show: boolean;
    onHide: () => void;
    children: React.ReactNode;
    className?: string;
    size?: 'lg' | 'sm' | 'xl';
    fullScreen?: boolean;
    dialogClassName?: any;
};
const CustomModal = (props: CustomModalProps) => {
    const { t } = useTranslation();

    return (
        <CModal
            // fullscreen={true}
            size={props.size ? props.size : 'lg'}
            visible={props.show}
            backdrop="static"
            className={`custom-modal ${props.className}`}
        >
            <CModalBody>
                <div
                    className="position-absolute header-icon cursor-pointer"
                    onClick={props.onHide}
                    title={t('close') + ''}
                    role="presentation"
                >
                    <CIcon icon={cilX} size="lg" />
                </div>
                {props.children}
            </CModalBody>
        </CModal>
    );
};

export default CustomModal;
