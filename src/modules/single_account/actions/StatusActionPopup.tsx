import React, { useCallback, useEffect, useMemo, useState } from 'react';
import validator from 'validator';
import {
    CButton,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormInput,
    CFormTextarea,
    CImage,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTooltip,
} from '@coreui/react';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate, useParams } from 'react-router';
import SearchInput from 'shared/components/search_input/SearchInput';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { t } from 'i18next';
type ActionPopoverProps = {
    submitBulkStatusAction?: any;
    submitStatusAction?: any;
    currStatusData?: any;
    show: boolean;
    handleClose: any;
    dropdownValues: any;
    showBulkDataTable?: any;
    displayData?: any;
    submitPopData?: any;
    bulkData?: any;
    setBulkData?: any;
    orgId?: any;
};

const assignValuesObj: any = {
    NEW: [
        { id: '0', value: 'NEW' },
        { id: '1', value: 'OPEN' },
    ],
    OPEN: [
        { id: '1', value: 'OPEN' },
        { id: '2', value: 'ASSIGNED' },
        { id: '3', value: 'CANCELED' },
    ],
    ASSIGNED: [
        { id: '2', value: 'ASSIGNED' },
        { id: '4', value: 'INPROGRESS' },
    ],
    INPROGRESS: [
        { id: '4', value: 'INPROGRESS' },
        { id: '5', value: 'RESOLVE' },
    ],
    RESOLVE: [
        { id: '5', value: 'RESOLVE' },
        { id: '6', value: 'VERIFIED' },
    ],
    VERIFIED: [
        { id: '6', value: 'VERIFIED' },
        { id: '7', value: 'CLOSE' },
    ],
    CANCELED: [{ id: '7', value: 'CLOSE' }],
    DEFAULT: [
        { id: '0', value: 'NEW' },
        { id: '1', value: 'OPEN' },
        { id: '2', value: 'ASSIGNED' },
        { id: '3', value: 'CANCELED' },
        { id: '4', value: 'INPROGRESS' },
        { id: '5', value: 'RESOLVE' },
        { id: '6', value: 'VERIFIED' },
        { id: '7', value: 'CLOSE' },
    ],
};

const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Risk Name' },
    { id: 2, name: 'Resource Name' },
    { id: 3, name: 'Resource Type' },
];

const StatusActionPopup = ({
    bulkData,
    setBulkData,
    submitBulkStatusAction,
    submitStatusAction,
    show,
    handleClose,
    dropdownValues,
    showBulkDataTable,
    displayData,
    submitPopData,
    orgId,
}: ActionPopoverProps) => {
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const [statusValue, setStatusValue] = useState(assignValuesObj['NEW'][0].id);
    const [liveLabel, setLiveLabel] = useState('');
    const [count, setCount] = useState(0);
    const [note, setNote] = useState('');
    const [linkVal, setLinkVal] = useState('');
    const [statusLabel, setStatusLabel] = useState('');
    const [assignLabel, setassignLabel] = useState('');
    const [err, setErr] = useState(false);
    const [assignUser, setAssignUser] = useState(dropdownValues[0]?.email);
    const [filteredRecords, setFilteredData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const PageSize = 15;
    const currentPageNo = 1;
    const [btnStatus, setBtnStatus] = useState(false);
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const [bulkRisk, setBulkRisk] = useState<any>([]);

    useEffect(() => {
        setFilteredData(displayData);
    }, [displayData]);

    useEffect(() => {
        if (bulkRisk?.length === 0 || bulkRisk?.length === undefined) {
            setBtnStatus(true);
        } else {
            setBtnStatus(false);
        }
    }, [bulkData]);
    // Submit handler

    const submitStatus = () => {
        const body = {
            risk_id: submitPopData?.risk_unique_id,
            account_id: cloudAccountId,
            org_id: orgId,
            current_state: liveLabel,
            current_state_assignee: assignLabel,
            current_notes: note,
            current_link: linkVal,
        };
        setStatusLabel(liveLabel);
        submitStatusAction(body);
    };

    const submitBulkStatus = () => {
        const body = {
            risk_ids: bulkRisk,
            account_id: cloudAccountId,
            org_id: orgId,
            current_state: liveLabel,
            current_state_assignee: assignLabel,
            current_notes: note,
            current_link: linkVal,
        };
        setStatusLabel(liveLabel);
        submitBulkStatusAction(body);
    };

    useEffect(() => {
        if (filteredRecords && filteredRecords.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [filteredRecords]);

    const currentTableData = useMemo(() => {
        if (filteredRecords) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return filteredRecords.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, filteredRecords]);

    useEffect(() => {
        const userid = dropdownValues.find((data: any) => {
            return data?.id === userDetails?.id;
        });
        setAssignUser(userid?.name);
    }, [userDetails, dropdownValues, submitPopData]);

    useEffect(() => {
        if (submitPopData?.currentState?.current_state) {
            setLiveLabel(submitPopData?.currentState?.current_state);
        } else {
            setLiveLabel(assignValuesObj['NEW'][statusValue]?.value);
        }
        // if (submitPopData?.currentState?.current_state) {
        //     setStatusLabel(submitPopData?.currentState?.current_state);
        // }
    }, [submitPopData]);

    useEffect(() => {
        submitPopData?.currentState?.current_state
            ? setStatusLabel(submitPopData?.currentState?.current_state)
            : showBulkDataTable
            ? setStatusLabel('DEFAULT')
            : setStatusLabel(assignValuesObj['NEW'][statusValue]?.value);

        submitPopData?.currentState?.current_state_assignee
            ? setassignLabel(submitPopData?.currentState?.current_state_assignee)
            : setassignLabel(assignUser);

        submitPopData?.currentState?.current_notes
            ? setNote(submitPopData?.currentState?.current_notes)
            : setNote(note);

        submitPopData?.currentState?.current_link
            ? setLinkVal(submitPopData?.currentState?.current_link)
            : setLinkVal(note);
    }, [submitPopData, submitBulkStatusAction]);

    const statushandler = (val: any) => {
        setLiveLabel(val.value);
        // setStatusLabel(val.value);
        setStatusValue(val.id);
    };

    const assignUserHandler = (val: any) => {
        setAssignUser(val?.name);
        setassignLabel(val?.name);
    };

    const isLinkValid = (e: any) => {
        setLinkVal(e.target.value);
        if (!validator.isURL(linkVal)) {
            setErr(true);
        } else {
            setErr(false);
        }
    };

    const noteHandler = (e: any) => {
        setCount(e.target.value.length);
        setNote(e.target.value);
    };

    const bulkAssign = (e: any, data: any) => {
        const bulkId: any = data?.risk_unique_id;
        if (bulkRisk?.includes(bulkId)) {
            const pos: any = bulkRisk?.findIndex((data: any) => data == bulkId);
            bulkRisk.splice(pos, 1);
        } else {
            setBulkRisk([...bulkRisk, bulkId]);
        }

        const isPresent: any = bulkData?.includes(bulkId);
        if (isPresent == false) {
            setBulkData(bulkData + bulkId);
        } else {
            setBulkData(bulkData.replace(bulkId, ''));
        }
    };
    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (displayData) {
                if (searchString.length >= MIN_SEARCH_LENGTH) {
                    const selectedIdentities = displayData?.filter((data: any) => {
                        switch (selectedFilerValue) {
                            case 0:
                                return (
                                    data?.rule_name.toLowerCase().includes(searchString.toLowerCase()) ||
                                    data?.resource_name.toLowerCase().includes(searchString.toLowerCase()) ||
                                    data?.resource_type.toLowerCase().includes(searchString.toLowerCase())
                                );
                            case 1:
                                return data.rule_name.toLowerCase().includes(searchString.toLowerCase());
                            case 2:
                                return data?.resource_name.toLowerCase().includes(searchString.toLowerCase());
                            case 3:
                                return data?.resource_type.toLowerCase().includes(searchString.toLowerCase());
                            default:
                                return data;
                        }
                    });
                    if (selectedIdentities && selectedIdentities.length > 0) {
                        setFilteredData(selectedIdentities);
                        callback && callback('');
                    } else {
                        setFilteredData([]);
                        callback && callback('No Items found.');
                    }
                } else {
                    setFilteredData(displayData);
                }
            }
        },
        [displayData, selectedFilerValue],
    );

    return (
        <>
            <CModal
                size="xl"
                visible={show}
                onClose={() => {
                    handleClose(), setBulkRisk([]);
                }}
            >
                <CModalHeader className="py-1" closeButton>
                    <CModalTitle className="h1">Status</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="h6">
                        <CInputGroup className={'mb-3'}>
                            <CInputGroupText className={'form-control custom-input-box-label  align-items-center'}>
                                Status
                            </CInputGroupText>
                            <CDropdown
                                placement="bottom"
                                className={`custom-input custom-input-box w-65 
                            } `}
                            >
                                <CDropdownToggle className="d-flex justify-content-between align-items-center w-100 float-end">
                                    <div style={{ minHeight: '20px' }}>{liveLabel}</div>
                                </CDropdownToggle>
                                <CDropdownMenu className="w-100 p-0">
                                    {assignValuesObj[statusLabel]?.map((val: any, i: any) => (
                                        <div key={i}>
                                            <CDropdownItem
                                                data-si-qa-key={`risks-status-dropdown-${val?.id}`}
                                                className="border-bottom "
                                                onClick={() => statushandler(val)}
                                            >
                                                <h6 className="my-1"> {val?.value}</h6>
                                            </CDropdownItem>
                                        </div>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </CInputGroup>
                    </div>
                    <div className="h6">
                        <CInputGroup className={'mb-3'}>
                            <CInputGroupText className={'form-control custom-input-box-label align-items-center'}>
                                Assigned to
                            </CInputGroupText>
                            <CDropdown placement="bottom" className={`custom-input custom-input-box w-65 `}>
                                <CDropdownToggle className="d-flex justify-content-between align-items-center w-100 float-end">
                                    <div style={{ minHeight: '20px' }}>{assignLabel}</div>
                                </CDropdownToggle>
                                <CDropdownMenu className="w-100 p-0">
                                    {dropdownValues?.length > 0 &&
                                        dropdownValues?.map((val: any, i: any) => (
                                            <div key={i}>
                                                <CDropdownItem
                                                    data-si-qa-key={`risks-status-assignedTo-${val?.id}`}
                                                    className="border-bottom"
                                                    onClick={() => assignUserHandler(val)}
                                                >
                                                    <h6 className="my-1">
                                                        {val?.name} - {val?.email}
                                                    </h6>
                                                </CDropdownItem>
                                            </div>
                                        ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </CInputGroup>
                    </div>
                    <div className="h6">
                        <CInputGroup className={'mb-3'}>
                            <CInputGroupText className={'form-control custom-input-box-label align-items-center w-35'}>
                                Link
                            </CInputGroupText>
                            <CInputGroup className={'custom-input custom-input-box w-65 '}>
                                <CFormInput
                                    data-si-qa-key={`risks-status-link-${linkVal}`}
                                    style={{ border: '0', height: '34px' }}
                                    className={'w-100 custom-input custom-input-box '}
                                    defaultValue={submitPopData?.currentState?.current_link}
                                    placeholder={'Link'}
                                    onChange={(e) => isLinkValid(e)}
                                />
                            </CInputGroup>
                            {err && (
                                <CInputGroupText className={`input-error-icon align-items-center clear-effect`}>
                                    <CTooltip trigger="hover" placement="bottom" content={'Please Enter Valid URL'}>
                                        <div className="cursor-pointer mr-4 mt-4" style={{ position: 'absolute' }}>
                                            <CImage
                                                src={require('assets/images/exclamation_circle.svg')}
                                                style={{
                                                    filter: 'invert(26%) sepia(45%) saturate(4911%) hue-rotate(357deg) brightness(77%) contrast(87%)',
                                                }}
                                            />
                                        </div>
                                    </CTooltip>
                                </CInputGroupText>
                            )}
                        </CInputGroup>
                    </div>
                    <div className="h6">
                        <CInputGroup className={'mb-1'}>
                            {/* <CInputGroupText className={'form-control custom-input-box-label align-items-center w-35'}>
                                Note
                            </CInputGroupText> */}
                            <CInputGroup className={'w-100 '}>
                                <CFormTextarea
                                    data-si-qa-key={`risks-status-note-${note}`}
                                    maxLength={500}
                                    onChange={(e) => noteHandler(e)}
                                    defaultValue={submitPopData?.currentState?.current_notes}
                                    rows={4}
                                    className={'p-2'}
                                    placeholder={'Note'}
                                />
                            </CInputGroup>
                        </CInputGroup>
                        <p className="muted text-end m-0 p-0" data-si-qa-key={`risks-status-character-count-${count}`}>
                            {count} out of 500 characters
                        </p>
                    </div>{' '}
                    {showBulkDataTable && (
                        <div className="">
                            <div
                                className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded"
                                style={{ height: '46px', float: 'left' }}
                            >
                                <div className="font-x-small-bold">{t('filter')}</div>
                                <div className="w-100">
                                    <CDropdown placement="bottom" className="p-2 w-100">
                                        <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                            <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                            {FilterItems.map((item: any, index: number) => (
                                                <CDropdownItem
                                                    data-si-qa-key={`risks-status-filter-${item.id}`}
                                                    key={index}
                                                    onClick={() => setSelectedFilerValue(item.id)}
                                                >
                                                    {item.name}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                            <SearchInput
                                data-si-qa-key={`risks-status-search-bar`}
                                customClass="w-50"
                                onSearch={onSearch}
                                placeholder="Search"
                            />

                            <div className="risk-table-heigth">
                                <table className="table table-borderless table-hover custom-table shadow-6 mt-3 overflow-auto">
                                    <thead className="border-bottom font-small-semibold">
                                        <tr>
                                            <th align="center" className="no-pointer px-3 w-10 text-center">
                                                ({filteredRecords?.length || 0})
                                            </th>
                                            <th className="no-pointer px-3 w-30">Risk Name</th>
                                            <th className="no-pointer px-3 w-30">Resource Name</th>
                                            <th className="no-pointer px-3 w-30">Resource Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTableData &&
                                            currentTableData?.map((item: any, ind: number) => {
                                                return (
                                                    <tr key={ind}>
                                                        <td align="center" className="no-pointer px-3">
                                                            <input
                                                                data-si-qa-key={`risks-status-checked-${item?.risk_unique_id}`}
                                                                checked={
                                                                    bulkData?.includes(item?.risk_unique_id)
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) => bulkAssign(e, item)}
                                                                type="checkbox"
                                                            />
                                                        </td>
                                                        <td className="no-pointer px-3">{item?.rule_name}</td>
                                                        <td className="no-pointer px-3">{item?.resource_name}</td>
                                                        <td className="no-pointer px-3">{item?.resource_type}</td>
                                                    </tr>
                                                );
                                            })}
                                        {currentTableData?.length == 0 && (
                                            <tr className="text-center">
                                                <td colSpan={3}>{t('no_records_available')} </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                className="pagination-bar justify-content-end mb-0 mt-2"
                                currentPage={currentPage}
                                totalCount={filteredRecords?.length}
                                pageSize={PageSize}
                                siblingCount={1}
                                onPageChange={(page: number) => {
                                    setCurrentPage(page);
                                    navigate('?pageNo=' + page);
                                }}
                            />
                        </div>
                    )}
                </CModalBody>
                {showBulkDataTable ? (
                    <CModalFooter className="py-1">
                        <CButton
                            data-si-qa-key={`risks-status-bulk-save`}
                            onClick={() => submitBulkStatus()}
                            className="btn-custom-link text-white"
                            disabled={btnStatus}
                        >
                            Bulk Save
                        </CButton>
                    </CModalFooter>
                ) : (
                    <CModalFooter className="py-1">
                        <CButton
                            data-si-qa-key={`risks-status-save`}
                            onClick={() => submitStatus()}
                            className="btn-custom-link text-white"
                        >
                            Save
                        </CButton>
                    </CModalFooter>
                )}
            </CModal>
        </>
    );
};

export default StatusActionPopup;
