import React from 'react';

import { CModal, CModalBody } from '@coreui/react';
import RiskPanel from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/risk_panel/RiskPanel';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { RiskCardModel } from 'shared/models/RiskModel';

type CustomModalProps = {
    show: boolean;
    onHide: () => void;
    riskData?: any;
    IdentityRiskData?: [];
    StatementData?: [];
    nodeType?: any;
    subType?: any;
    data?: any;
    // children: React.ReactNode;
    // className: string;
    // size: 'lg' | 'sm' | 'xl';
};
const CustomModalForRisk = (props: CustomModalProps) => {
    const rhsState = useSelector((state: AppState) => state.rightSidebarState);
    const risks: RiskCardModel[] = rhsState.sidebarJSON?.risks || [];
    const graphState = useSelector((state: AppState) => state.graphState);

    return (
        <div>
            {props.subType == 'Statement' ||
                (props.nodeType == 'Policy' && (
                    <>
                        {' '}
                        <CModal visible={props.show} onClose={props.onHide} alignment="center" size="xl">
                            <CModalBody>
                                <RiskPanel
                                    risks={risks}
                                    riskData={graphState}
                                    identityRisk={props?.IdentityRiskData}
                                    statementData={props?.StatementData}
                                    data={props?.data}
                                    nodeType={props?.nodeType}
                                    subType={props.subType}
                                ></RiskPanel>
                            </CModalBody>
                        </CModal>
                    </>
                ))}
            {props.nodeType == 'identity' || props.nodeType == 'risk' ? (
                <>
                    {' '}
                    <CModal visible={props.show} onClose={props.onHide} alignment="center">
                        <CModalBody>
                            <RiskPanel
                                risks={risks}
                                riskData={graphState}
                                identityRisk={props?.IdentityRiskData}
                                statementData={props?.StatementData}
                                nodeType={props?.nodeType}
                            ></RiskPanel>
                        </CModalBody>
                    </CModal>
                </>
            ) : null}
        </div>
    );
};

export default CustomModalForRisk;
