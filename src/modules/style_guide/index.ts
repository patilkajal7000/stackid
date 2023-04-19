import React from 'react';
const StyleGuide = React.lazy(() => import('./StyleGuide'));

export const STYLEGUIDE = '/styleguide';

export default [
    {
        routeProps: {
            path: STYLEGUIDE,
            component: StyleGuide,
            name: 'StyleGuide',
        },
        name: 'StyleGuide',
    },
];
