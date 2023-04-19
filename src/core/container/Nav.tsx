import React from 'react';
import CIcon from '@coreui/icons-react';
import { SINGLE_ACCOUNT_URL } from '../../modules/single_account';
import { DASHBOARD } from '../../modules/dashboard';
import { STYLEGUIDE } from 'modules/style_guide';
import { CLOUDACCOUNT } from '../../modules/cloud_accounts';
import { ADMIN } from '../../modules/admin';
import { cilSpeedometer } from '@coreui/icons';

const CLOUDACCOUNT_ID = '/1';

const Nav = [
    {
        _tag: 'CSidebarNavItem',
        name: 'Dashboard',
        to: DASHBOARD,
        icon: { cilSpeedometer },
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'StyleGuide',
        to: STYLEGUIDE,
        icon: { cilSpeedometer },
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Cloud Accounts',
        to: CLOUDACCOUNT,
        icon: { cilSpeedometer },
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Views',
        icon: 'cil-puzzle',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Data Assets',
                to: SINGLE_ACCOUNT_URL.ACCOUNTS_URL + CLOUDACCOUNT_ID + SINGLE_ACCOUNT_URL.OVERVIEW_SCREEN,
                icon: <CIcon icon={cilSpeedometer} customClassName="c-sidebar-nav-icon" />,
            },
        ],
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Admin',
        to: ADMIN,
        icon: { cilSpeedometer },
    },
];

export default Nav;
