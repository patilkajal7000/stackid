import React from 'react';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CAvatar } from '@coreui/react';
import { logoutUserDeails } from 'shared/service/AuthService';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { useNavigate } from 'react-router-dom';
import { PROFILE } from 'modules/user';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import CIcon from '@coreui/icons-react';
import { getInitials } from 'shared/utils/Services';
import { cilLockLocked, cilUser } from '@coreui/icons';
const TheHeaderDropdown = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const user = useSelector((state: AppState) => state.authState.user);
    const logoutUserDetailsAction = () => {
        logoutUserDeails();
        navigate('/login');
    };
    return (
        <div>
            <CDropdown variant="nav-item" alignment={'end'} className="w-75">
                <CDropdownToggle caret={false}>
                    <CAvatar color="primary" size="30px" textColor="white">
                        {user?.name && getInitials(user?.name)}
                    </CAvatar>
                </CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem onClick={() => navigate(PROFILE)} className="d-flex align-items-center">
                        {/* <AccountCircleIcon className="mx-2" /> */}
                        <CIcon icon={cilUser} size="lg" className="mx-2" />
                        {t('profile')}
                    </CDropdownItem>
                    <CDropdownItem onClick={logoutUserDetailsAction} className="d-flex align-items-center">
                        <CIcon icon={cilLockLocked} size="xl" className="mx-2" />
                        {t('logout')}
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </div>
    );
};

export default TheHeaderDropdown;
