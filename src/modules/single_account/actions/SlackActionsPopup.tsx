import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
type ActionsPopoverProps = {
    show: boolean;
    handleClose: any;
    ruleId: string;
    ruleName: string;
    subResource: string;
    priority: string;
    patternDescription: string;
    riskType: string;
    handleSave: any;
};
function SlackActionsPopup({
    show,
    ruleId,
    ruleName,
    subResource,
    priority,
    patternDescription,
    riskType,
    handleClose,
    handleSave,
}: ActionsPopoverProps) {
    return (
        <>
            <CModal visible={show} onClose={handleClose}>
                <CModalHeader closeButton>
                    <CModalTitle>Send Risk Details to Slack</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="h6">
                        <b>Resource Name: </b>
                        {subResource}
                    </div>
                    <div className="h6">
                        <b>Rule ID: </b>
                        {ruleId}
                    </div>
                    <div className="h6">
                        <b>Rule Name: </b>
                        {ruleName}
                    </div>

                    <div className="h6">
                        <b>Priority: </b>
                        {priority}
                    </div>
                    <div className="h6">
                        <b>Risk Type: </b>
                        {riskType}
                    </div>

                    <div className="h6">
                        <b>Pattern Description: </b>
                        {patternDescription}
                    </div>
                </CModalBody>
                <CModalFooter>
                    {/* <CButton color="secondary" onClick={handleClose}>
                        Cancel
                    </CButton> */}
                    <CButton
                        data-si-qa-key={`risks-action-slack-send`}
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

export default SlackActionsPopup;
