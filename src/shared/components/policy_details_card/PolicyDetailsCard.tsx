import { CCard, CCardBody } from '@coreui/react';
import React from 'react';
import { CHECK_VALUE, MAX_VALUE } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilChevronRight, cilStorage, cilXCircle } from '@coreui/icons';

type PolicyDetailsCardProps = {
    showDetails: (val: string) => void;
    heading: string;
    t: any;
    failedOrPassValue: number;
    category: string;
};
const PolicyDetailsCard = (props: PolicyDetailsCardProps) => {
    const isFailed = MAX_VALUE - props.failedOrPassValue < CHECK_VALUE;
    return (
        <CCard className="custom-card long-details-card m-1 p-0">
            <CCardBody className="card-body-details p-0 flex-column">
                <div
                    className={`d-flex flex-row-reverse align-items-center font-caption-bold ${
                        isFailed ? 'Critical' : 'Low'
                    }-icon-color`}
                >
                    {isFailed ? (
                        <>
                            <CIcon icon={cilXCircle} className="mx-2" />
                            {props.failedOrPassValue} %{' '}
                            {props.category.includes(props.t('compliance').toLowerCase())
                                ? props.t('non') + '-' + props.t('compliant')
                                : props.t('failed')}
                        </>
                    ) : (
                        <>
                            <CIcon icon={cilCheckCircle} className="mx-2" />
                            {props.failedOrPassValue}
                            {props.category.includes(props.t('compliance')) ? props.t('compliant') : props.t('pass')}
                        </>
                    )}
                </div>
                <div className="d-flex align-items-center">
                    <div className="card-icon">
                        <CIcon icon={cilStorage} className="mx-2 fa-2x" />
                    </div>
                    <div className="font-medium ">{props.heading}</div>
                </div>
                <div className="d-flex flex-row-reverse">
                    <button
                        type="button"
                        className="btn-custom btn btn-link"
                        onClick={() => props.showDetails(props.heading)}
                    >
                        {props.t('view_details')}
                        <CIcon icon={cilChevronRight} className="mx-2" />
                    </button>
                </div>
            </CCardBody>
        </CCard>
    );
};

export default PolicyDetailsCard;
