import React from 'react';
const Settings = React.lazy(() => import('./Settings'));

export const SETTINGS = '/settings';

export default [
    {
        routeProps: {
            path: SETTINGS,
            component: Settings,
            name: 'Settings',
        },
        name: 'Settings',
    },
];
