import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CButton,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalContent,
    CModalHeader,
    CTooltip,
} from '@coreui/react';
import { getGenericTags } from 'core/services/DataEndpointsAPIService';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './ManageTags.scss';

import DeletePopup from './models/deletePopup';

const ShowAllTags = (props: any) => {
    const { data, open, setOpen, translte, handleUpdate, handleDelete, single, selectedId } = props;
    const [editKey, setEditKey] = useState<any>();

    const [editValue, setEditValue] = useState<any>();
    const [tag_id, setTagId] = useState<any>();

    const [, setOpenEditTag] = useState<boolean>(false);
    const [able, setAble] = useState<boolean>(false);
    const [showTable, setShowTable] = useState<boolean>(true);
    const [showEditFields, setShowEditFields] = useState<boolean>(false);
    const [showDeletePopup, setshowDeletePopup] = useState<boolean>(false);
    const [dropdownDisabled, setDropdownDisabled] = useState<boolean>(false);

    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    useEffect(() => {
        if (editKey) {
            Object.entries(ganericTagData).map((data: any) => {
                if (data[0] === editKey) {
                    data[1] === '' ? setDropdownDisabled(true) : setDropdownDisabled(false);
                }
            });
        }
    }, [editKey]);
    const { data: ganericTagData, isSuccess: ganericTagDataSucess } = getGenericTags(cloudAccountId);
    useEffect(() => {
        if (ganericTagDataSucess) {
            if (single) {
                single && setShowTable(false);
                setAble(true);
                setShowEditFields(true);
                setEditKey(data[0]?.tag_key);
                setEditValue(data[0]?.tag_value);
                setTagId(data[0]?.tag_id);
            }
        }
    }, [ganericTagData]);

    const handleEditTag = (event: any, key: any, value: any, tag_id: any) => {
        single && setShowTable(false);
        setAble(true);
        event.stopPropagation();
        setShowEditFields(true);
        setEditKey(key);
        setEditValue(value);
        setTagId(tag_id);
    };

    const handleRemoveTag = (event: any, tag_id: string) => {
        event.stopPropagation();
        handleDelete(event, tag_id, 'soft_delete');
    };

    const handleDeleteTag = (e: any) => {
        setshowDeletePopup(false);
        handleDelete(e, tag_id);
    };

    return (
        <CModal alignment="center" className="tag-modal" visible={open} onClose={() => setOpen(false)} size="xl">
            <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                <div className="h4">{translte('edit_tag')}</div>
            </CModalHeader>
            <CModalContent className="border-0">
                <div className="mb-3 px-1">
                    {showEditFields && (
                        <>
                            <CInputGroup className="mb-3">
                                <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                                    {translte('key')}
                                </CInputGroupText>
                                <CDropdown
                                    className="custom-input custom-input-box"
                                    alignment={{ xs: 'start', lg: 'end' }}
                                >
                                    <input
                                        type="text"
                                        defaultValue={editKey}
                                        value={editKey}
                                        className="form-control border-0"
                                        aria-label="Text input with dropdown button"
                                    />
                                    <CDropdownToggle
                                        className="ms-1 custom-input custom-input-box border-0"
                                        color="secondary"
                                    />
                                    <CDropdownMenu>
                                        {Object.keys(ganericTagData).map((x: any, i: any) => (
                                            <CDropdownItem key={i} className="border-0" onClick={() => setEditKey(x)}>
                                                {x}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </CInputGroup>

                            <CInputGroup className="mb-3">
                                <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                                    {translte('value')}
                                </CInputGroupText>
                                <CDropdown
                                    className="custom-input custom-input-box"
                                    alignment={{ xs: 'start', lg: 'end' }}
                                >
                                    {dropdownDisabled ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            defaultValue={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="form-control border-0"
                                            aria-label="Text input with dropdown button"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={editValue}
                                            defaultValue={editValue}
                                            onChange={(e) => console.log(e.target.value)}
                                            className="form-control border-0"
                                            aria-label="Text input with dropdown button"
                                        />
                                    )}
                                    <CDropdownToggle
                                        className="ms-1 custom-input custom-input-box border-0 bg-light"
                                        disabled={dropdownDisabled}
                                    />
                                    <CDropdownMenu className="select-tags">
                                        {ganericTagData &&
                                            Object.entries(ganericTagData).map(
                                                (data: any, i: any) =>
                                                    data[1] !== '' &&
                                                    data[0] === editKey &&
                                                    data[1]?.map((value: any) => (
                                                        <CDropdownItem
                                                            key={i}
                                                            className="border-0"
                                                            onClick={() => {
                                                                setEditValue(value);
                                                            }}
                                                        >
                                                            {value}
                                                        </CDropdownItem>
                                                    )),
                                            )}
                                    </CDropdownMenu>
                                </CDropdown>
                            </CInputGroup>
                        </>
                    )}
                    {showTable && (
                        <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                            {/* <div className="edit-tags"> */}
                            <thead className="border-bottom edit-tags-thead">
                                <tr>
                                    <th className="px-3 no-pointer">{translte('key')}</th>
                                    <th className="px-3 no-pointer">{translte('value')}</th>
                                    <th className="px-3 no-pointer">{translte('actions')}</th>
                                </tr>
                            </thead>

                            <tbody className="edit-tags">
                                {data.map((data: any, index: any) => (
                                    <tr
                                        key={index}
                                        onClick={() => {
                                            setOpenEditTag(true);
                                            setEditKey(data.tag_key);
                                            setEditValue(data.tag_value);
                                            setTagId(data.tag_id);
                                        }}
                                    >
                                        <td className="px-3">{data.tag_key}</td>
                                        <td className="px-4 text-break">{data.tag_value}</td>
                                        <td className="px-3 no-pointer">
                                            <CTooltip trigger="hover" placement="bottom" content="Edit Tag">
                                                <CIcon
                                                    icon={cilPencil}
                                                    className="ms-2 text-neutral-400 pointer"
                                                    onClick={(e) =>
                                                        handleEditTag(e, data.tag_key, data.tag_value, data.tag_id)
                                                    }
                                                />
                                            </CTooltip>
                                            <CTooltip trigger="hover" placement="bottom" content="Remove Tag">
                                                <button
                                                    type="button"
                                                    className="btn-close ms-2"
                                                    aria-label="Close"
                                                    onClick={(e) => {
                                                        setTagId(data.tag_id);
                                                        handleRemoveTag(e, data.tag_id);
                                                    }}
                                                />
                                            </CTooltip>
                                            <CTooltip trigger="hover" placement="bottom" content="Delete Tag">
                                                <CIcon
                                                    icon={cilTrash}
                                                    className="ms-2 text-neutral-400 pointer"
                                                    onClick={() => {
                                                        setEditKey(data.tag_key);
                                                        setEditValue(data.tag_value);
                                                        setTagId(data.tag_id);
                                                        setshowDeletePopup(true);
                                                        //  handleDeleteTag(e, data.tag_key, data.tag_value)
                                                    }}
                                                />
                                            </CTooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* </div> */}
                        </table>
                    )}
                    <CButton
                        className="float-end btn-custom-link text-white"
                        disabled={!able}
                        // onClick={() => setOpenSaveModal(false)}
                        onClick={(event: any) => {
                            setShowEditFields(true);
                            handleUpdate(event, { editKey, editValue, tag_id, selectedId });
                        }}
                    >
                        Update
                    </CButton>
                </div>
            </CModalContent>

            {showDeletePopup && (
                <DeletePopup
                    show={showDeletePopup}
                    tag={editValue}
                    handleClose={() => setshowDeletePopup(!showDeletePopup)}
                    handleSave={(e: any) => {
                        handleDeleteTag(e);
                    }}
                />
            )}
        </CModal>
    );
};

export default ShowAllTags;
