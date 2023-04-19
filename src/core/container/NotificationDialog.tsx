import React from 'react';
import { CHeader, CModal, CImage } from '@coreui/react';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
import { useDispatch } from 'react-redux';
import CIcon from '@coreui/icons-react';
import { cilCopy } from '@coreui/icons';

const NotificationTypes = {
    ORG_DISCOVERY_INFO: 'Discovery Information',
    ORG_DISCOVERY_ERROR: 'Discovery Error',
    SI_PLATFORM_ERROR: 'SI Platform Error',
    SI_DISCOVERY_ERROR: 'SI Discovery Error',
    SI_BROADCAST: 'SI Broadcast',
};

const NotificationDialog = (props: any) => {
    const dispatch = useDispatch();
    const { notificationContent, open, setOpen } = props;
    const { notification_title, cloud_account_name, details } = notificationContent.notification_data;
    const { notification_type } = notificationContent;

    return (
        <>
            <CModal visible={open} alignment="center">
                <CHeader>
                    <div className="float-start mx-4">
                        {Object.entries(NotificationTypes).map((types: any) => {
                            if (types[0] === notification_type) return types[1];
                        })}
                    </div>
                    <div className="mx-4">
                        <CImage
                            src={require('assets/images/close.png')}
                            className="pointer mx-4"
                            onClick={() => {
                                setOpen(false);
                            }}
                        />
                    </div>
                </CHeader>
                <div className="notification-dialog-spacing">
                    <table className="border-card">
                        <tr>
                            <td className={`p-1 fs-6`}>Notification Title:</td>
                            <td className="p-1">
                                <span className="fs-6 notification-dialog-color">{notification_title}</span>
                                <CIcon
                                    icon={cilCopy}
                                    className="ms-2 text-neutral-400"
                                    onClick={() => {
                                        navigator.clipboard.writeText(notification_title);
                                        dispatch(
                                            setToastMessageAction(ToastVariant.SUCCESS, 'title copied to clipboard.'),
                                        );
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className={`p-1 fs-6 `}>Cloud Account Name:</td>
                            <td className="p-1">
                                <span className="fs-6 notification-dialog-color">{cloud_account_name}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className={`p-1 fs-6 `}>Details:</td>
                            <td className="p-1">
                                <span className="fs-6 notification-dialog-color">{details}</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </CModal>
        </>
    );
};

export default NotificationDialog;
