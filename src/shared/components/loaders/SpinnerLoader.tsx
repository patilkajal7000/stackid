import React from 'react';

const SpinnerLoader = () => {
    return (
        <div className="d-flex justify-content-center  text-dark">
            <div className="spinner-border custom-loader" role="status"></div>
            <div className="ms-2">Loading...</div>
        </div>
    );
};

export default SpinnerLoader;
