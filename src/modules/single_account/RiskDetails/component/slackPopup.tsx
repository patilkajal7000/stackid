import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
type GraphPopoverProps = {
    show: boolean;
    handleClose?: any;
    riskDetails: any;
    cloudAccountName: any;
    cloudAccountId: any;
    handleSave: any;
};
function SlackPopup({ show, handleClose, cloudAccountName, riskDetails, handleSave }: GraphPopoverProps) {
    return (
        <>
            <CModal visible={show} onClose={handleClose}>
                <CModalHeader closeButton>
                    <CModalTitle>Send BPI Risk Details to Slack</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <b className="h6 mx-2">
                        <b>Cloud Account Name : </b>
                        {cloudAccountName}
                    </b>

                    <div className="h6 mx-2  ">
                        <h6> Critical Risk({riskDetails.length})</h6>
                        {riskDetails?.slice(0, 1).map((item: any, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <b>Type : </b>
                                    <span>{item?.risk_dimension}</span>

                                    <h6>Risk Name : {item?.rule_name}</h6>
                                    <p>
                                        <b>Risk Detail : </b>
                                        {item?.risk_occurence_reason}...
                                    </p>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </CModalBody>
                <CModalFooter>
                    {/* <CButton color="secondary" onClick={handleClose}>
                        Cancel
                    </CButton> */}
                    <CButton className="btn-custom-link text-white" onClick={handleSave}>
                        Send
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default SlackPopup;
