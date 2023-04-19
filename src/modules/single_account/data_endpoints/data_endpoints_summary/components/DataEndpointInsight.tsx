import { cibAmazonAws } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CImage } from '@coreui/react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import SeverityCard from 'shared/components/severity_card/SeverityCard';
import { SeverityType } from 'shared/models/RHSModel';

type DataEndpointInsightProps = {
    data: any;
    isLoading: boolean;
    translate: any;
    dataAssestsTypeDisplayText: string;
    iconName: string;
    type?: any;
};

const DataEndpointInsight = (props: DataEndpointInsightProps) => {
    return (
        <div className="shadow-7 p-3">
            {props.isLoading ? (
                <div className="container px-0">
                    <Skeleton height={100} />
                </div>
            ) : (
                <div className="d-flex container px-0">
                    <div className="d-flex flex-column justify-content-between my-3">
                        {/* 
                        // TODO : Add confluence public page link for BPI definition
                        <CTooltip
                            placement="top"
                            trigger="click"
                            content={
                                <a href="https://stackidentity.com/" target="blank">
                                    Visit confluence page for more info on BPI
                                </a>
                            }
                        > */}
                        <div className="h4">Breach Prediction Index</div>
                        {/* </CTooltip> */}
                        <div>
                            <div className="font-small-semibold">
                                {props.translate('total')}{' '}
                                {props.type == 'aws_S3'
                                    ? 'S3 Buckets'
                                    : props.translate(props.dataAssestsTypeDisplayText)}{' '}
                                : {props.data?.length}
                            </div>
                        </div>
                        <div className="mt-2">
                            {props.iconName === 'gcp-icon' ? (
                                <CImage src={require('assets/images/gcp-icon.png')} />
                            ) : (
                                <CIcon icon={cibAmazonAws} size={'xxl'} />
                            )}
                        </div>
                    </div>
                    {props.data && (
                        <div className="d-flex">
                            <SeverityCard s3data={props.data} title={SeverityType.CRITICAL} />
                            <SeverityCard s3data={props.data} title={SeverityType.HIGH} />
                            <SeverityCard s3data={props.data} title={SeverityType.MEDIUM} />
                            <SeverityCard s3data={props.data} title={SeverityType.LOW} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(DataEndpointInsight);
