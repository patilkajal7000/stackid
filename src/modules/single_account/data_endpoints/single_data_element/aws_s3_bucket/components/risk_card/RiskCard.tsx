import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CCard, CCardBody } from '@coreui/react';
import { RiskCardModel } from 'shared/models/RiskModel';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';

type RiskCardProps = {
    risk: RiskCardModel;
    onCardClick: (risk: RiskCardModel) => void;
    className: string;
    color?: any;
};

const RiskCard = (props: RiskCardProps) => {
    const navigate = useNavigate();
    const [, setShow] = useState(false);
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type;
    const rid = params?.rid;

    const color = props.risk?.priority_label;

    return (
        <CCard
            className={`custom-card risk-card ${color} pointer  ${props.className} `}
            onClick={() => {
                props.onCardClick(props.risk);
                setShow(true);
                // dispatch(showIdentitiesDetailsAction(false, props));

                navigate(
                    CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.DATA_ENDPOINTS +
                        '/' +
                        type +
                        '/' +
                        rid +
                        '/' +
                        NAV_TABS_VALUE.RISK_DETAILS,
                );
            }}
        >
            <span className="badge font-x-small ms-auto">{props.risk.risk_dimension}</span>
            <CCardBody className="card-body-details pt-1 pb-2">
                <div className={`card-side ${color}`}></div>
                <div className="h6 mb-0 pb-2">{props.risk.rule_name}</div>
                {/* <div> {getSeverityNameWithColor(props.risk.attribution)} </div> */}
                <div className="font-small mt-1">
                    {/* {t('risk_found_on')} {converStringToDateFormat(props.risk.found_on)}{' '} */}
                </div>
            </CCardBody>
            {/* <CCardFooter>
                    <div
                        className="btn-custom btn btn-link"
                        onClick={() => {
                            props.onCardClick(props.risk);
                            setShow(true);
                            // dispatch(showIdentitiesDetailsAction(false, props));

                            history.push(NAV_TABS_VALUE.RISK_DETAILS, { state: true });
                        }}
                        // onClick={() => setShow(true)}
                    >
                        {t('view_details')}
                        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
                    </div>
                </CCardFooter> */}
        </CCard>
        // </CLink>
    );
};
export default RiskCard;
