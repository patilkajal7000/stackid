import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { CCard, CCardBody, CCardFooter, CTooltip } from '@coreui/react';

import { getSeverityScoreColor } from 'shared/service/Severity.service';
import { DataEndpointResorceModel } from 'shared/models/DataEndpointSummaryModel';
import CIcon from '@coreui/icons-react';
import { cilChevronRight } from '@coreui/icons';
type FixTodayCardProps = {
    bucketData: DataEndpointResorceModel[];
    onClickView: (bucketData: DataEndpointResorceModel) => void;
    translate: any;
    isLoading: boolean;
};

const FixTodayCards = ({ bucketData, onClickView, translate, isLoading }: FixTodayCardProps) => {
    return (
        <div className="container-fluid mx-0">
            {isLoading ? (
                <div className="d-flex justify-content-between container px-0">
                    <Skeleton width={350} height={100} />
                    <Skeleton width={350} height={100} />
                    <Skeleton width={350} height={100} />
                </div>
            ) : (
                <div className="d-flex justify-content-between container  px-0">
                    {bucketData.map((bucket: DataEndpointResorceModel) => {
                        const risk_score_percentage = bucket.risk_score | 0;
                        return (
                            <CCard className="custom-card long-details-card mx-0 p-2" key={bucket.id}>
                                <CCardBody className="card-body-details p-0">
                                    <div className="justify-content-start">
                                        <em
                                            className={`${getSeverityScoreColor(
                                                risk_score_percentage,
                                            )}-icon-color mx-2 icon-${getSeverityScoreColor(
                                                risk_score_percentage,
                                            ).toLowerCase()}`}
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div
                                            title={bucket.name}
                                            className="card-title font-medium-semibold overflow-hidden"
                                        >
                                            {bucket.name}
                                        </div>
                                        <div className="mb-1 card-sub-text font-small">
                                            <CTooltip content="Breach Prediction Index">
                                                <span>{translate('bpi')}</span>
                                            </CTooltip>
                                            :<span className="percentage-text"> {risk_score_percentage}%</span>
                                        </div>
                                    </div>
                                </CCardBody>
                                <CCardFooter className="p-0">
                                    <button
                                        title={translate('view_details')}
                                        type="button"
                                        className="btn-custom btn btn-link float-end"
                                        onClick={() => onClickView(bucket)}
                                    >
                                        {translate('view_details')}
                                        <CIcon icon={cilChevronRight} className="mx-2" size="sm" />
                                    </button>
                                </CCardFooter>
                            </CCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default React.memo(FixTodayCards);
