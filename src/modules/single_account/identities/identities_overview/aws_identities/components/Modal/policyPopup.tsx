import { CModal, CModalContent, CModalHeader } from '@coreui/react';
import React from 'react';
import { ResourceType } from 'shared/utils/Constants';
const PolicyPopUp = (props: any) => {
    const { data, open, setOpen } = props;
    return (
        <CModal alignment="center" className="tag-modal" visible={open} onClose={() => setOpen(false)} size="xl">
            <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                Identities Resource Type
                {/* <div className="h4">{translte('edit_tag')}</div> */}
            </CModalHeader>
            <CModalContent className="border-0">
                <div className="mb-3 px-3">
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        {/* <div className="edit-tags"> */}
                        <thead className="border-bottom edit-tags-thead">
                            <tr>
                                <th className="px-4 no-pointer"> Resource Type</th>
                            </tr>
                        </thead>

                        <tbody className="edit-tags">
                            {data.map((data: any, index: any) => (
                                <tr key={index}>
                                    <td className="px-4">
                                        {data == 'All' ? data : ResourceType[data] ? ResourceType[data] : data}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* </div> */}
                    </table>
                </div>
            </CModalContent>
        </CModal>
    );
};
export default PolicyPopUp;
