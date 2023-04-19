import { CCard, CTooltip } from '@coreui/react';
import React from 'react';
import { DataEndpointResorceModel } from 'shared/models/DataEndpointSummaryModel';
import { SeverityType } from 'shared/models/RHSModel';
import { getSeverityBpiScore, getSeverityColor, getSeverityScoreColor } from 'shared/service/Severity.service';

type SeverityCardProps = {
    title: SeverityType;
    s3data: DataEndpointResorceModel[];
};

const SeverityCard = (props: SeverityCardProps) => {
    const color = getSeverityColor(props.title);

    const bpiColor = getSeverityBpiScore(props.title);

    return (
        <CCard className={`custom-card severity-card ${color} bpi-card ms-3`}>
            <div className={`card-side ${color}`}></div>
            <div className="d-flex flex-column m-0 justify-content-start align-items-start">
                <CTooltip content="Breach Prediction Index">
                    <div className="font-x-small-bold m-0 ps-3"> {bpiColor} </div>
                </CTooltip>
                <div className="h2 m-0 ps-3">
                    {
                        props.s3data.filter((data: DataEndpointResorceModel) => {
                            const risk_score_percentage = data.risk_score;

                            return getSeverityScoreColor(risk_score_percentage) === props.title;
                        }).length
                    }
                </div>
            </div>
            <div className="d-flex ">
                <div className="card-bottom d-flex shadow-1 pe-3 align-items-center">
                    <div className={`font-x-small-bold ps-3 severity-text`}>{props.title}</div>
                    <em className={`${color}-icon-color ms-2 icon-${color.toLowerCase()}`} />
                </div>
            </div>
        </CCard>
    );
};

export default React.memo(SeverityCard);
