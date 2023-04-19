import React from 'react';
const Report = React.lazy(() => import('./Report'));

export const REPORT = '/report';

export default [
    {
        routeProps: {
            path: REPORT,
            component: Report,
            name: 'Report',
        },
        name: 'Report',
    },
];
