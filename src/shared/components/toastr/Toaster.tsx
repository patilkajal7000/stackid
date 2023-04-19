import { CImage, CToast, CToaster, CToastHeader } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastVariant } from 'shared/utils/Constants';
import { AppState } from 'store/store';

const Toaster = () => {
    const toastState = useSelector((state: AppState) => state.toaster);
    const [toasts, setToasts] = useState<
        Array<{
            autohide: boolean | number;
            closeButton: boolean;
            fade: boolean;
            variant: ToastVariant;
            message: string;
        }>
    >([]);
    const [autohide] = useState(true);
    const [autohideValue] = useState(2000);
    const [closeButton] = useState(true);
    const [fade] = useState(true);
    const addToast = (variant: ToastVariant, message: string) => {
        setToasts([...toasts, { autohide: autohide && autohideValue, closeButton, fade, variant, message }]);
    };

    useEffect(() => {
        if (toastState && toastState.variant) {
            addToast(toastState.variant, toastState.message);
        }
    }, [toastState]);

    return (
        <CToaster placement="top-end">
            {toasts.map((toast: any, key: any) => {
                return (
                    <React.Fragment key={'toast' + key}>
                        <CToast
                            className={`custom-toast ${toast.variant}`}
                            visible={true}
                            autohide={toast.autohide ? true : false}
                            animation={toast.fade}
                        >
                            <CToastHeader
                                className={`${toast.variant} font-small p-3 d-flex justify-content-between text-break custom-toast`}
                                closeButton={toast.closeButton}
                            >
                                <CImage
                                    src={getIcons(toast.variant)}
                                    className="mx-2"
                                    style={{
                                        filter: 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(195deg) brightness(106%) contrast(102%)',
                                    }}
                                />
                                {toast.message}
                            </CToastHeader>
                        </CToast>
                    </React.Fragment>
                );
            })}
        </CToaster>
    );
};

export default Toaster;

const getIcons = (variant: ToastVariant) => {
    switch (variant) {
        case ToastVariant.SUCCESS:
            return require('assets/images/check_circle.svg');
        case ToastVariant.DANGER:
            return require('assets/images/exclamation_circle.svg');
        case ToastVariant.WARNING:
            return require('assets/images/exclamation_triangle.svg');
        default:
            return require('assets/images/check_circle.svg');
    }
};
