import React from 'react';
import './InsightsDetails.scss';
import { SEVERITY_CATEGORIES, SEVERITY_NAME } from '../../../utils/Constants';
import { ResourcesSeverity } from 'shared/models/DataEndpointSummaryModel';
import { CAccordion, CAccordionCollapse, CAccordionItem, CCard, CCardBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronBottom } from '@coreui/icons';

export type InsightsDetailsProps = {
    title: string;
    count?: number;
    body?: Record<typeof SEVERITY_NAME, ResourcesSeverity[]>;
    showCount: boolean;
    index: number;
};

const InsightsDetails = (props: InsightsDetailsProps) => {
    return (
        <CAccordion activeItemKey="0">
            <CCard className="insights-details">
                <CAccordionItem
                    className="d-flex insights-details justify-content-between align-items-center"
                    itemKey={props.index.toString()}
                >
                    <span className="h5 font-weight-bold ">{SEVERITY_CATEGORIES[props.title ? props.title : '']}</span>
                    <div className="d-flex">
                        <CIcon icon={cilChevronBottom} className="mx-2" />
                        {props.showCount && (
                            <span className="btn btn-success disabled h5 font-weight-bold fix-button-width">
                                {props.count}
                            </span>
                        )}
                    </div>
                </CAccordionItem>
                {props.body && (
                    <CAccordionCollapse>
                        <CCardBody className="insights-details-body">
                            {Object.keys(props?.body).map((d: any, index: number) => (
                                <div key={index} className="d-flex justify-content-between align-items-center">
                                    <span className="h5">{SEVERITY_NAME[d]}</span>
                                    <div className="d-flex">
                                        {props.showCount && (
                                            <span className="btn disabled h6 font-weight-bold accordion-body-button">
                                                {props?.body?.[d].length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CCardBody>
                    </CAccordionCollapse>
                )}
            </CCard>
        </CAccordion>
    );
};

export default InsightsDetails;
