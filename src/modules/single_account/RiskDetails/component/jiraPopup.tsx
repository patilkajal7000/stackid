import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
type GraphPopoverProps = {
    show: boolean;
    handleClose?: any;
    riskDetails: any;
    cloudAccountId: any;
    handleSave: any;
};
function JiraPopup({ show, handleSave, handleClose, riskDetails, cloudAccountId }: GraphPopoverProps) {
    return (
        <>
            <CModal visible={show} size="lg" onClose={handleClose}>
                <CModalHeader closeButton>
                    <CModalTitle>Send BPI Risk Details to Jira</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="h6 mx-2  ">
                        <React.Fragment>
                            <b className="h6">
                                <b>Summary : </b>
                                {riskDetails?.rule_name} : {cloudAccountId} : {riskDetails?.entity_pattern_type} :
                                {riskDetails?.sub_resource_name}
                            </b>
                            <p className="h6 my-3">
                                <b>Description : </b>
                                {riskDetails?.pattern_description} : {riskDetails?.sub_resource_name}{' '}
                                {riskDetails?.risk_occurence_reason}
                                <br />
                                AWS ACCOUNT : {cloudAccountId}
                                <br />
                                PRIORITY : {riskDetails?.priority_label}
                                <br />
                                Discovery On : {riskDetails?.found_on}
                            </p>
                            <p className="h6 my-3">
                                <b>Labels : </b>[{cloudAccountId} , {riskDetails?.entity_pattern_type} ,
                                {riskDetails?.sub_resource_name} , {riskDetails?.rule_id}]
                            </p>
                        </React.Fragment>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn-custom-link text-white" onClick={handleSave}>
                        Send
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default JiraPopup;
