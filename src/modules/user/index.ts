import React from 'react';
const Profile = React.lazy(() => import('./Profile'));

/* --------------- User Profiles ------------- */
export const PROFILE = '/profile';

export default [
    {
        routeProps: {
            path: PROFILE,
            component: Profile,
            name: 'Profile',
        },
        name: 'Profile',
    },
];
