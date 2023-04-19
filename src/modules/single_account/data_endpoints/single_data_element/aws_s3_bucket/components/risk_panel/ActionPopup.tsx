import { CModal, CModalContent, CModalHeader } from '@coreui/react';
import React from 'react';

const ActionPopup = (props: any) => {
    const { actionPopupData, setOpen, open, translte } = props;

    return (
        <div>
            <CModal
                alignment="center"
                className="tag-modal shadow-8"
                visible={open}
                onClose={() => setOpen(false)}
                size="xl"
            >
                <CModalHeader className="border-0 pt-3 pb-1" closeButton>
                    <div className="h4">{`${translte('action')} (${actionPopupData.length})`}</div>
                </CModalHeader>

                <CModalContent className="border-0">
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        <tbody className="">
                            {actionPopupData?.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="px-3 no-pointer">{item}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CModalContent>
            </CModal>
        </div>
    );
};

export default ActionPopup;
