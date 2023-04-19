import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
type ActionsPopoverProps = {
    show: boolean;
    handleClose: any;
    riskDetails: any;
    handleSave: any;
    cloudAccountId: any;
};
function PagerDutyActionsPopup({ show, riskDetails, cloudAccountId, handleClose, handleSave }: ActionsPopoverProps) {
    return (
        <>
            <CModal visible={show} onClose={handleClose}>
                <CModalHeader closeButton>
                    <CModalTitle>Send Risk Details to PagerDuty</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <b className="h6">
                        <b>Title : </b>
                        {riskDetails?.rule_name} : {cloudAccountId} : {riskDetails?.resource_type} :
                        {riskDetails?.resource_name}
                    </b>
                    <p className="h6 my-3">
                        <b>Description : </b>
                        {riskDetails?.pattern_description} : {riskDetails?.resource_name}
                        <br />
                        AWS ACCOUNT : {cloudAccountId}
                        <br />
                        PRIORITY : {riskDetails?.priority_label}
                        <br />
                        Discovery On : {riskDetails?.si_ingestion_time}
                    </p>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        data-si-qa-key={`risks-action-pagerDuty-send`}
                        className="btn-custom-link text-white"
                        onClick={handleSave}
                    >
                        Send
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default PagerDutyActionsPopup;
