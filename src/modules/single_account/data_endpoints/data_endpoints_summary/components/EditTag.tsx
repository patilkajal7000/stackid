import React, { useEffect, useState } from 'react';
import { CButton, CInputGroup, CInputGroupText, CModal, CModalContent, CModalHeader, CTooltip } from '@coreui/react';
import './ManageTags.scss';
import DeletePopup from './models/deletePopup';
import ShowAllTags from './ShowAllTags';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilX } from '@coreui/icons';
const EditTag = (props: any) => {
    const {
        tagKey,
        tagValue,
        data,
        open,
        setOpen,
        translte,
        resource_id,
        handleUpdate,
        handleDelete,
        cloudAccountId,
        resourceType,
        handleAddTag,
        tag_id,
        data1,
    } = props;
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<any>([]);
    const [showDeletePopup, setshowDeletePopup] = useState<boolean>(false);
    const [showAllTags, setShowAllTags] = useState<boolean>(false);
    useEffect(() => {
        const arr: any = [];
        data.map((item1: any) => {
            item1?.platformTags?.map((item: any) => {
                if (item.tag_id == tag_id) {
                    arr.push(item1.id || item1.identity_id);
                }
            });
        });

        setIsChecked(arr);
    }, [resource_id]);
    const handleRemoveTag = (event: any, tag_id: string) => {
        event.stopPropagation();
        handleDelete(event, tag_id, 'soft_delete');
    };
    const handleDeleteTag = (e: any) => {
        setshowDeletePopup(false);

        handleDelete(e, tag_id);
    };
    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsChecked(data.map((d: any) => d.id || d.identity_id));
        if (isCheckAll) {
            setIsChecked([]);
        }
    };

    const body = {
        tag_key: tagKey,
        tag_value: tagValue,
        cloud_account_id: `${cloudAccountId}`,
        resource_type: `${resourceType}`,
        resource_ids: isChecked,
    };

    // const handleDeleteTag = (e: any) => {
    //     setshowDeletePopup(false);
    //     handleDelete(e, tag_id);
    // };
    const handleCheck = (event: any, name: any) => {
        const { checked } = event.target;
        setIsChecked([...isChecked, name]);
        if (!checked) {
            setIsChecked(isChecked.filter((item: any) => item !== name));
        }
    };

    return (
        <>
            <CModal alignment="center" className="tag-modal" visible={open} onClose={() => setOpen(false)} size="lg">
                <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                    <div className="h4">Manage {tagKey}</div>
                </CModalHeader>
                <CModalContent className="border-0">
                    <div className="container p-1">
                        <CInputGroup className="mb-3">
                            <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                                {translte('key')}
                            </CInputGroupText>
                            <input
                                type="text"
                                disabled
                                onChange={(e: any) => console.log(e.target.value)}
                                defaultValue={tagKey}
                                className="custom-input custom-input-box form-control border"
                                aria-label="Text input with dropdown button"
                            />
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                            <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                                {translte('value')}
                            </CInputGroupText>
                            <input
                                disabled
                                type="text"
                                defaultValue={tagValue}
                                onChange={(e: any) => console.log(e.target.value)}
                                className="custom-input custom-input-box form-control border"
                                aria-label="Text input with dropdown button"
                            />
                        </CInputGroup>

                        <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                            <thead className="edit-tags-thead">
                                <tr className="header-background">
                                    <th className="px-3 no-pointer w-10">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectAll()}
                                            checked={isCheckAll}
                                        />
                                    </th>
                                    <th className="px-4 no-pointer">{translte('bucket_name')}</th>
                                </tr>
                            </thead>
                            <tbody className="edit-tags">
                                {/* <div className="manage-tags"> */}
                                {data?.map((bucket: any, index: any) => (
                                    <tr key={index}>
                                        <td className="no-pointer  w-10">
                                            <input
                                                type="checkbox"
                                                checked={isChecked.includes(bucket.id || bucket.identity_id)}
                                                onChange={(e) => handleCheck(e, bucket.id || bucket.identity_id)}
                                            />
                                        </td>
                                        <td className="px-4 no-pointer">{bucket.name || bucket.identity_name} </td>
                                    </tr>
                                ))}
                                {/* </div> */}
                            </tbody>
                        </table>

                        <CButton
                            className="float-end ms-3 btn-custom-link text-white"
                            // onClick={() => setOpenSaveModal(false)}
                            onClick={() => {
                                handleAddTag(body);
                                setOpen(false);
                            }}
                        >
                            Save
                        </CButton>
                        <CTooltip trigger="hover" placement="bottom" content="Edit Tag">
                            <CIcon
                                icon={cilPencil}
                                className="ms-3 text-neutral-400 pointer float-end m-2"
                                onClick={() => setShowAllTags(true)}
                            />
                        </CTooltip>
                        <CTooltip trigger="hover" placement="bottom" content="Delete Tag">
                            <CIcon
                                icon={cilTrash}
                                className="ms-2 text-neutral-400 pointer c-primary float-end  m-2"
                                onClick={() => {
                                    setshowDeletePopup(true);
                                    //  handleDeleteTag(e, data.tag_key, data.tag_value)
                                }}
                            />
                        </CTooltip>

                        <CTooltip trigger="hover" placement="bottom" content="Remove Tag">
                            <CIcon
                                icon={cilX}
                                className="ms-2 text-neutral-400 pointer c-primary float-end  m-2"
                                onClick={(e: any) => {
                                    // setshowDeletePopup(true);
                                    handleRemoveTag(e, tag_id);
                                }}
                            />
                        </CTooltip>
                    </div>
                </CModalContent>
            </CModal>
            {showAllTags && (
                <ShowAllTags
                    selectedId={isChecked}
                    data={data1}
                    single={true}
                    open={showAllTags}
                    setOpen={setShowAllTags}
                    translte={translte}
                    handleUpdate={(event: any, data: any) => handleUpdate(event, data)}
                    handleDelete={(event: any, data: any, type: string) => handleDelete(event, data, type)}
                />
            )}
            {showDeletePopup && (
                <DeletePopup
                    show={showDeletePopup}
                    tag={tagValue}
                    handleClose={() => setshowDeletePopup(!showDeletePopup)}
                    handleSave={(e: any) => {
                        handleDeleteTag(e);
                    }}
                />
            )}
        </>
    );
};

export default EditTag;
