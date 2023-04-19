import React, { useEffect, useRef, useState } from 'react';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import { getNotificationsURL } from 'core/services/DataEndpointsAPIService';
import 'translation/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store/store';
import CIcon from '@coreui/icons-react';
import { cilBell } from '@coreui/icons';
import { ToastVariant } from 'shared/utils/Constants';
import { setToastMessageAction } from 'store/actions/SingleActions';

const NotificationsDropdown = (props: any) => {
    const { setModalOpen, setNotificationContent } = props;
    const [notificationsArray, setNotificationsArray] = useState<any[]>([]);
    const [notificationDelayFlag, setNotificationDelayFlag] = useState<boolean>(false);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const onSelectNotification = (item: any) => {
        setNotificationContent(item);
        setModalOpen(true);
        item.viewed = true;
    };
    const dispatch = useDispatch();
    const intervalRef = useRef<any>();
    useEffect(() => {
        if (
            sessionStorage?.getItem('org') === 'undefined' ||
            sessionStorage?.getItem('org') === null ||
            sessionStorage?.getItem('org') === undefined
        ) {
            sessionStorage.setItem('org', JSON.stringify(orgId));
        } else if (JSON.parse(sessionStorage?.getItem('org') ?? '{}') !== orgId) {
            sessionStorage.setItem('notificationLen', JSON.stringify(null));
            sessionStorage.setItem('org', JSON.stringify(orgId));
        }
    }, []);
    useEffect(() => {
        const apiCall = () => {
            if (!notificationDelayFlag) {
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(apiCall, 5 * 60 * 1000);
                setNotificationDelayFlag(true);
            }
            if (
                sessionStorage?.getItem('org') == 'undefined' ||
                sessionStorage?.getItem('org') === null ||
                sessionStorage?.getItem('org') === undefined
            ) {
                sessionStorage.setItem('org', JSON.stringify(orgId));
            }
            if (orgId != undefined && orgId) {
                const temp = JSON.parse(sessionStorage?.getItem('org') ?? '{}');

                getNotificationsURL(temp)
                    .then((response: any) => {
                        if (response && response.length > 0) {
                            const notificationArr: any[] = [];
                            Object.values(response).map((notification: any) => {
                                notificationArr.push(notification);
                            });
                            setNotificationsArray(notificationArr);

                            if (
                                sessionStorage?.getItem('notificationLen') === 'null' ||
                                sessionStorage?.getItem('notificationLen') === null
                            ) {
                                sessionStorage.setItem('notificationLen', JSON.stringify(notificationArr?.length));
                            } else if (
                                JSON.parse(sessionStorage?.getItem('notificationLen') ?? '{}') < notificationArr.length
                            ) {
                                sessionStorage.setItem('notificationLen', JSON.stringify(notificationArr?.length));

                                dispatch(
                                    setToastMessageAction(
                                        ToastVariant.SUCCESS,
                                        notificationArr[0].notification_data.details,
                                    ),
                                );
                            }
                        }
                    })
                    .catch((error: any) => {
                        console.log('in error', error);
                    });
            }
        };
        if (!notificationDelayFlag) {
            intervalRef.current = setInterval(apiCall, 10 * 1000);
        }
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [orgId]);

    return (
        <CDropdown variant="nav-item" placement="bottom-end" className="c-header-nav-items">
            <CDropdownToggle className="c-header-nav-link" caret={false}>
                <CIcon icon={cilBell} size="xl" className="mt-2" />
            </CDropdownToggle>
            <CDropdownMenu className="w-30rem  h-25rem overflow-auto p-0">
                <div className="container notification-dialog-color">
                    <p className="fw-bold fs-3 py-2 pb-0">Notifications ({notificationsArray.length}) </p>
                </div>
                <hr className="mb-0 mt-0" />
                {notificationsArray.map((item: any, index: number) => (
                    <div key={index}>
                        <CDropdownItem
                            key={index}
                            onClick={() => {
                                onSelectNotification(item);
                            }}
                        >
                            <span className="pe-2">
                                <span className="d-inline-block bg-grey rounded-circle w-10px h-10px" />
                            </span>
                            {item.viewed ? (
                                <span className="p-1 fw-bold">{item?.notification_data?.notification_title}</span>
                            ) : (
                                <span className="p-1 fw-bold">{item?.notification_data?.notification_title}</span>
                            )}
                        </CDropdownItem>
                    </div>
                ))}
            </CDropdownMenu>
        </CDropdown>
    );
};

export default NotificationsDropdown;
