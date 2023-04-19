import { activate_user } from 'core/services/AuthAPISerivce';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpinnerLoader from 'shared/components/loaders/SpinnerLoader';

const ActivateUser = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const tk = new URLSearchParams(location.search).get('tk');
        const verify = new URLSearchParams(location.search).get('verify');
        if (tk && verify) {
            /* TODO AlertBoxes */
            activate_user(tk, location.search)
                .then(() => {
                    navigate('/login');
                })
                .catch(() => {
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, []);
    return (
        <div className="c-app c-default-layout auth-contianer justify-content-center align-items-center">
            Activating User &nbsp; <SpinnerLoader />
        </div>
    );
};

export default ActivateUser;
