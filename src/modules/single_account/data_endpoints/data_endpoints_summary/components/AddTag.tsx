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
} from '@coreui/react';
import './ManageTags.scss';
import React, { useEffect, useMemo, useState } from 'react';
import Pagination from 'shared/components/pagination/Pagination';

const AddTag = (props: any) => {
    const {
        type,
        data,
        open,
        setOpen,
        translte,
        cloudAccountId,
        resourceType,
        genericTags,
        selectedBucketId,
        handleAddTag,
        setSelectedBucketIds,
    } = props;
    const [key, setKey] = useState<any>('');
    const [value, setValue] = useState<any>('');
    const [dropdownDisabled, setDropdownDisabled] = useState<boolean>(true);
    const [currentData, setCurrentData] = useState<any>(data);
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const PageSize = 15;
    const currentPageNo = 1;
    const body = {
        tag_key: `${key}`,
        tag_value: `${value}`,
        cloud_account_id: `${cloudAccountId}`,
        resource_type: `${resourceType}`,
        resource_ids: selectedBucketId,
    };
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return currentData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, currentData]);

    useEffect(() => {
        if (data && data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
        setCurrentData(data);
    }, [data]);

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsChecked(data.map((d: any) => d.id || d.identity_id));

        setSelectedBucketIds(data.map((d: any) => d.id || d.identity_id));

        if (isCheckAll) {
            setIsChecked([]);
        }
    };

    const handleCheck = (event: any, name: any) => {
        const { checked } = event.target;
        setIsChecked([...isChecked, name]);
        setSelectedBucketIds(data.map((d: any) => d.id || d.identity_id));
        setSelectedBucketIds([...isChecked, name]);
        if (!checked) {
            setIsChecked(isChecked.filter((item: any) => item !== name));
        }
    };

    useEffect(() => {
        if (key) {
            Object.entries(genericTags).map((data: any) => {
                if (data[0] === key) {
                    data[1] === '' ? setDropdownDisabled(true) : setDropdownDisabled(false);
                }
            });
        }
    }, [key]);

    return (
        <CModal alignment="center" className="tag-modal" visible={open} onClose={() => setOpen(false)} size="lg">
            <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                <div className="h4">{type === 'Add' ? translte('add_tag') : translte('bulk_tagging')}</div>
            </CModalHeader>
            <CModalContent className="border-0">
                <div className="container p-1">
                    <CInputGroup className="mb-3">
                        <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                            {translte('key')}
                        </CInputGroupText>
                        <CDropdown className="custom-input custom-input-box" alignment={{ xs: 'start', lg: 'end' }}>
                            <input
                                type="text"
                                value={key}
                                disabled={true}
                                className="form-control border-0"
                                aria-label="Text input with dropdown button"
                            />
                            <CDropdownToggle
                                color="secondary"
                                className="ms-1 custom-input custom-input-box border-0"
                            />
                            <CDropdownMenu>
                                {genericTags &&
                                    Object.keys(genericTags).map((data: any, i: any) => (
                                        <CDropdownItem key={i} className="border-0" onClick={() => setKey(data)}>
                                            {data}
                                        </CDropdownItem>
                                    ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                        <CInputGroupText className="form-control custom-input-box-label align-items-center dropdown">
                            {translte('value')}
                        </CInputGroupText>
                        <CDropdown className="custom-input custom-input-box" alignment={{ xs: 'start', lg: 'end' }}>
                            {dropdownDisabled ? (
                                <input
                                    type="text"
                                    onChange={(e) => setValue(e.target.value)}
                                    className="form-control border-0"
                                    aria-label="Text input with dropdown button"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={value}
                                    className="form-control border-0"
                                    aria-label="Text input with dropdown button"
                                />
                            )}
                            <CDropdownToggle
                                className="ms-1 custom-input custom-input-box border-0 bg-light
"
                                disabled={dropdownDisabled}
                            />
                            <CDropdownMenu className="select-tags">
                                {genericTags &&
                                    Object.entries(genericTags).map(
                                        (data: any, i: any) =>
                                            data[1] !== '' &&
                                            data[0] === key &&
                                            data[1]?.map((value: any) => (
                                                <CDropdownItem
                                                    key={i}
                                                    className="border-0"
                                                    onClick={() => setValue(value)}
                                                >
                                                    {value}
                                                </CDropdownItem>
                                            )),
                                    )}
                            </CDropdownMenu>
                        </CDropdown>
                    </CInputGroup>

                    {type === 'Bulk' && (
                        <>
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
                                    {currentTableData?.map((bucket: any, index: any) => (
                                        <tr key={index}>
                                            <td className="no-pointer w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked.includes(bucket.id || bucket.identity_id)}
                                                    onChange={(e) => handleCheck(e, bucket.id || bucket.identity_id)}
                                                />
                                            </td>
                                            <td className="px-4 no-pointer">{bucket.name || bucket.identity_name}</td>
                                        </tr>
                                    ))}
                                    {/* </div> */}
                                </tbody>
                            </table>
                            <Pagination
                                className="pagination-bar justify-content-end"
                                currentPage={currentPage}
                                totalCount={currentData.length}
                                pageSize={PageSize}
                                siblingCount={1}
                                onPageChange={(page: number) => {
                                    setCurrentPage(page);
                                    // navigate('?pageNo=' + page);
                                }}
                            />
                        </>
                    )}

                    <CButton
                        className="float-end btn-custom-link text-white"
                        disabled={key === '' || value === ''}
                        onClick={() => {
                            handleAddTag(body);
                            setOpen(false);
                        }}
                    >
                        {type === 'Add' ? translte('add_tag') : translte('update')}
                    </CButton>
                </div>
            </CModalContent>
        </CModal>
    );
};

export default AddTag;
