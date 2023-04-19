import React from 'react';
const Admin = React.lazy(() => import('./Admin'));

export const ADMIN = '/admin';

export default [
    {
        routeProps: {
            path: ADMIN,
            component: Admin,
            name: 'Admin',
        },
        name: 'Admin',
    },
];
