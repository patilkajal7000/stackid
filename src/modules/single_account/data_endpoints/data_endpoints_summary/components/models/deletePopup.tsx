import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
type ActionsPopoverProps = {
    show: boolean;
    handleClose: any;
    tag: string;
    handleSave: any;
};
function DeletePopup({ show, tag, handleClose, handleSave }: ActionsPopoverProps) {
    return (
        <>
            <CModal visible={show} onClose={handleClose}>
                <CModalHeader>
                    <CModalTitle>Delete {tag}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    This operation will delete all the mappings between the tag and all associated resources. Are you
                    sure you want to delete the tag?{' '}
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn-custom-link text-white" onClick={handleClose}>
                        Close
                    </CButton>
                    <CButton className="text-white" color="danger" onClick={handleSave}>
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default DeletePopup;
