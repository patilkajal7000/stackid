import React from 'react';
import { CImage, CModal, CModalContent, CModalTitle } from '@coreui/react';
import './SchemaPopover.scss';

const SchemaInfoPopover = (props: any) => {
    const { schemaContent, open, setOpen } = props;
    const { name } = schemaContent;

    return (
        <>
            <CModal className="schemaInfo" visible={open} size="lg">
                <CModalTitle>
                    <div className="font-medium fs-3 float-start mx-4 mt-2">{name}</div>
                    <CImage
                        src={require('assets/images/close.png')}
                        className="float-end pointer mx-4 mt-2"
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                </CModalTitle>
                <CModalContent className="border-0 schemaInfo">
                    <table className={`table-border font-medium m-3 p-3`}>
                        <tbody>
                            <th className="p-3">Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Description</th>
                            {schemaContent?.columns.map((col: any, index: any) => (
                                <tr key={index} className="border">
                                    <td className="d-inline-flex p-3">{col?.name}</td>
                                    <td className="p-3">{col?.type}</td>
                                    <td className="p-3">{col?.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CModalContent>
            </CModal>
        </>
    );
};

export default SchemaInfoPopover;
