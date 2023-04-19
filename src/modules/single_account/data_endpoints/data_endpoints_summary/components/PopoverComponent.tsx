import React from 'react';
import { CCard, CCardBody, CCardFooter } from '@coreui/react';
import { SeverityType } from '../../../../../shared/models/RHSModel';
import { DataEndpointResorceModel, ResourcesSeverity } from 'shared/models/DataEndpointSummaryModel';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilChevronRight, cilFolder, cilXCircle } from '@coreui/icons';

type Props = {
    singleBucketData: DataEndpointResorceModel;
    gotoSingleBucket: (data: any) => void;
    s3SeverityData: ResourcesSeverity[];
    onClose: () => any;
    translate: any;
};

const PopoverComponent = (props: Props) => {
    return (
        <CCard className="custom-card long-details-card">
            <CCardBody className="card-body-details flex-column">
                <div className="d-flex">
                    <div className="card-icon">
                        <CIcon icon={cilFolder} className="mx-2 fa-2x" size="xxl" />
                    </div>
                    <div className="w-100 overflow-hidden">
                        <div className="d-flex justify-content-between">
                            <div title={props.singleBucketData.name} className="card-title overflow-hidden w-90">
                                {props.singleBucketData.name}
                            </div>
                            <div className="btn cursor-select" onClick={props.onClose} role="presentation">
                                <CIcon icon={cilXCircle} className="mx-2" />
                            </div>
                        </div>
                        <div className="card-sub-text">
                            {props.translate('bpi')}:
                            <span className="percentage-text">
                                {props.singleBucketData?.risk_score}%
                                <CIcon icon={cilArrowTop} className="mx-2" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    {Object.values(SeverityType).map(
                        (value: any, index: number) =>
                            value !== SeverityType.ZERO && (
                                <div key={index} className={`me-2 p-2 d-flex flex-column align-items-center col-sm-3`}>
                                    <span className={`${value}-icon-color body-small-semibold`}>{value}</span>
                                    <span className="body-small-semibold">
                                        {
                                            props.s3SeverityData
                                                ?.filter(
                                                    (data: ResourcesSeverity) =>
                                                        data.Name === props.singleBucketData.name,
                                                )
                                                .filter((data: ResourcesSeverity) => data.severity === value).length
                                        }
                                    </span>
                                </div>
                            ),
                    )}
                </div>
            </CCardBody>
            <CCardFooter>
                <button type="button" className="btn-custom btn btn-link" title={props.translate('context')}>
                    {props.translate('context')}
                    <CIcon icon={cilChevronRight} className="mx-2" />
                </button>
                |
                <button
                    type="button"
                    className="btn-custom btn btn-link"
                    onClick={() => props.gotoSingleBucket(props.singleBucketData)}
                    title={props.translate('view_details')}
                >
                    {props.translate('view_details')}
                    <CIcon icon={cilChevronRight} className="mx-2" />
                </button>
            </CCardFooter>
        </CCard>
    );
};

export default PopoverComponent;
