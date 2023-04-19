import React from 'react';
const Dashboard = React.lazy(() => import('./Dashboard'));

export const DASHBOARD = '/dashboard';

export default [
    {
        routeProps: {
            path: DASHBOARD,
            component: Dashboard,
            name: 'Dashboard',
        },
        name: 'Dashboard',
    },
];
