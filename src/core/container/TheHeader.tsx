import React, { useEffect, useState } from 'react';
import { CBreadcrumb, CBreadcrumbItem, CHeader, CHeaderNav, CNavItem, CNavLink, CNavbar } from '@coreui/react';
import { TheHeaderDropdown } from './index';
import { AppState } from 'store/store';
import { useSelector } from 'react-redux';
import { DASHBOARD } from 'modules/dashboard';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';

import { SETTINGS } from 'modules/settings';
import NotificationsDropdown from './NotificationsDropdown';
import NotificationsDialog from './NotificationDialog';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';

import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

const TheHeader = () => {
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const [isMenuCollapse, setIsMenuCollapse] = useState(true);
    const [NewUser] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [notificationContent, setNotificationContent] = useState<any>();
    const breadcrumbState = useSelector((state: AppState) => state.breadcrumState);

    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        if (breadcrumbState.breadcrumbData.length > 1) {
            setIsMenuCollapse(true);
        } else {
            setIsMenuCollapse(false);
        }
    }, [breadcrumbState]);

    useEffect(() => {
        // if (userDetails?.org?.organisation_id === userDetails?.org?.name) {
        //     setNewUser(true);
        // }
    }, [userDetails]);

    const toggleMenu = () => {
        setIsMenuCollapse(!isMenuCollapse);
    };

    return (
        <CHeader className="fixed-top shadow-7 p-0 px-2 fixed-header-height">
            <CHeaderNav className="d-md-down-none me-auto">
                <CNavItem>
                    <CNavLink to={DASHBOARD}>
                        <img
                            src={require('assets/images/Logo-in.png')}
                            alt="Logo"
                            style={{ height: '50px', width: '30px' }}
                        />
                    </CNavLink>
                </CNavItem>

                <div className="d-flex flex-row align-items-center ms-2">
                    <div
                        role="presentation"
                        className="toggle-icon align-items-center justify-content-center d-flex cursor-pointer "
                        onClick={toggleMenu}
                    >
                        <em className={`${isMenuCollapse ? 'icon-menu-open' : 'icon-menu-close'} font-xl`} />
                    </div>
                    <CNavbar
                        className={`navbar-custom custom-menu p-1 ${isMenuCollapse ? 'menu-collapse' : 'menu-open'}`}
                    >
                        <div className="d-flex flex-row align-items-center w-100 ms-5 p-1">
                            <div className="d-flex flex-row align-items-center">
                                {/* <Link
                                    to={DASHBOARD}
                                    replace
                                    className={`ps-3 ${
                                        location.pathname.includes(DASHBOARD)
                                            ? 'h5 text-primary mb-0'
                                            : 'font-medium-semibold text-neutral'
                                    }`}
                                >
                                    {t('home')}
                                </Link> */}
                                <Link
                                    to={CLOUDACCOUNT}
                                    replace
                                    className={`ps-3 ${
                                        location.pathname.includes(CLOUDACCOUNT)
                                            ? 'h5 text-primary mb-0'
                                            : 'font-medium-semibold text-neutral'
                                    }`}
                                >
                                    {t('accounts')}
                                </Link>

                                <Link
                                    to={NewUser ? CLOUDACCOUNT : SETTINGS}
                                    replace
                                    className={`ps-3 ${
                                        location.pathname.includes(SETTINGS)
                                            ? 'h5 text-primary mb-0'
                                            : 'font-medium-semibold text-neutral'
                                    }`}
                                >
                                    {t('settings')}
                                </Link>
                                {/* <Link
                                    to={NewUser ? CLOUDACCOUNT : REPORT}
                                    replace
                                    className={`ps-3 ${
                                        location.pathname.includes(REPORT)
                                            ? 'h5 text-primary mb-0'
                                            : 'font-medium-semibold text-neutral'
                                    }`}
                                >
                                    {t('reports')}
                                </Link> */}
                            </div>
                            <CIcon
                                icon={cilX}
                                size="xl"
                                className="me-2 ms-auto cursor-pointer text-primary"
                                onClick={toggleMenu}
                            />
                        </div>
                    </CNavbar>
                </div>
                <div className={`breadcrumb-custom ${isMenuCollapse ? 'show' : 'hide'}`}>
                    <CBreadcrumb className="d-flex flex-row align-items-center mx-1">
                        {breadcrumbState.breadcrumbData.length > 0 &&
                            breadcrumbState.breadcrumbData.map(
                                (breadcrumItem: { name: string; path: string }, index: number) => (
                                    <CBreadcrumbItem
                                        key={index}
                                        href={
                                            index === breadcrumbState.breadcrumbData.length - 1
                                                ? undefined
                                                : '#' + breadcrumItem.path
                                        }
                                        className={
                                            index === breadcrumbState.breadcrumbData.length - 1 ? 'align-items-end' : ''
                                        }
                                    >
                                        {breadcrumItem.name}
                                    </CBreadcrumbItem>
                                ),
                            )}
                    </CBreadcrumb>
                </div>
            </CHeaderNav>
            <CHeaderNav>
                {/* <CButton className="position-relative p-1" title="Sandbox">
                    <FontAwesomeIcon icon={faBoxOpen} className="font-xl ms-2" />
                </CButton> */}
                <NotificationsDropdown setModalOpen={setModalOpen} setNotificationContent={setNotificationContent} />
                {modalOpen ? (
                    <NotificationsDialog
                        notificationContent={notificationContent}
                        open={modalOpen}
                        setOpen={setModalOpen}
                    />
                ) : null}

                <li className="d-flex align-items-center">|</li>
                <li className="d-flex align-items-center font-small mx-2">{userDetails?.org.name}</li>
                <li className="d-flex align-items-center">|</li>
                <li className="d-flex align-items-center font-small mx-2">{userDetails?.name}</li>
                <TheHeaderDropdown />
            </CHeaderNav>
        </CHeader>
    );
};

export default TheHeader;
