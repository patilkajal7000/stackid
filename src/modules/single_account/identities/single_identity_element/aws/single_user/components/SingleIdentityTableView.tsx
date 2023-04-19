import React, { useCallback, useEffect, useState } from 'react';
import SearchInput from 'shared/components/search_input/SearchInput';
import { IdentityDetails, IdentityResourceDetails } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH, ResourceType, logoDataURI } from 'shared/utils/Constants';
import TableComponent from './TableComponent';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import dayjs from 'dayjs';

const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Resource Name' },
    { id: 2, name: 'Resource Type' },
    // { id: 3, name: 'Permission Type' },
];

type IdentitiesTableViewProps = {
    data: IdentityResourceDetails[];
    onClickRow: (resourceData: IdentityResourceDetails, currentPage: number, e: any) => void;
    translate: any;
    isLoading: boolean;
    currentPage: number;
    t: any;
    showFullTable: boolean;
    selectedTab: any;
    singleIdentityInsightDetails: any;
    selectedRoleAndAccount: string;
};

const SingleIdentityTableView = (props: IdentitiesTableViewProps) => {
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [filteredRecords, setFilteredRecords] = useState<IdentityResourceDetails[]>([]);
    const [roleAndAcc, setRoleAndAcc] = useState<string>('');
    const [pdfRecord, setPdfRecord] = useState<IdentityResourceDetails[]>([]);
    const [csvRecord, setCsvRecord] = useState<IdentityResourceDetails[]>([]);
    const [csvRecordData, setCsvRecordData] = useState<IdentityResourceDetails[]>([]);
    const [pdfAccess, setPdfAccess] = useState('');
    const { t } = useTranslation();
    const [lastScan, setLastScan] = useState<any>('');
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const [yAxis, setYAxis] = useState(100);
    const [adminAccess, setAdminAccess] = useState<IdentityDetails[]>([]);
    const [permissionManagement, setPermissionManagement] = useState<IdentityDetails[]>([]);
    // eslint-disable-next-line prefer-const
    let [btnSeleted, setBtnSelected] = useState<string[]>([]);
    let csvheaders: any;
    //last scan time
    const getLastScanTime = () => {
        setLastScan(selectedcloudAccounts?.last_scan_event_ts);
    };
    useEffect(() => {
        getLastScanTime();
    }, [selectedcloudAccounts]);
    const lastActive = () => {
        return dayjs(parseInt(lastScan) * 1000).format('DD MMM YY | hh:mm a');
    };
    const lastScanTime = lastScan ? lastActive() : 'Loading...';
    const pdfIdentityName = props.singleIdentityInsightDetails?.identityName;

    useEffect(() => {
        const csvData: any = csvRecord.map((item: any) => {
            return {
                resource_name: item.resource_name,
                resource_type: item.resource_type,
                permissions: item.permissions,
                last_activity:
                    item.last_activity && item?.last_activity > 1
                        ? dayjs(item.last_activity).format('h:mm:ss a | DD MMM YY ')
                        : '  -',
            };
        });
        setCsvRecordData(csvData);
    }, [pdfRecord, setPdfRecord]);

    // download CSV
    if (props.selectedTab === 'resource_attached') {
        csvheaders = [
            { label: 'Resource Name', key: 'resource_name' },
            { label: 'Resource Type', key: 'resource_type' },
        ];
    } else {
        csvheaders = [
            { label: 'Resource Name', key: 'resource_name' },
            { label: 'Resource Type', key: 'resource_type' },
            { label: 'Permission Type', key: 'permissions' },
            { label: 'Last Activity', key: 'last_activity' },
        ];
    }

    //PDF header data
    useEffect(() => {
        if (props.selectedTab === 'direct_access') {
            setPdfAccess('Direct Access');
        } else if (props.selectedTab === 'indirect_access') {
            setPdfAccess('Indirect Access');
            setRoleAndAcc(props.selectedRoleAndAccount);
        } else {
            setPdfAccess('Resource Attached To');
            setRoleAndAcc(props.selectedRoleAndAccount);
        }
        if (roleAndAcc) {
            setYAxis(100);
        } else {
            setYAxis(80);
        }
    }, [props.selectedTab, roleAndAcc]);

    // download PDF
    const handleOnPDF = (records: IdentityResourceDetails[]) => {
        const doc = new jsPDF('p', 'pt', 'a4');
        let headers: any;
        let data: any;
        if (props.selectedTab === 'resource_attached') {
            headers = [['No ', 'Resource Name', 'Resource Type']];
            data = records?.map((elt: any, i) => [i + 1, elt.resource_name, ResourceType[elt.resource_type]]);
        } else {
            headers = [['No ', 'Resource Name', 'Resource Type', 'Permission Type', 'Last Activity (Data Assets)']];
            data = records?.map((elt: any, i) => [
                i + 1,
                elt.resource_name,
                ResourceType[elt.resource_type],
                elt.permissions,
                elt.last_activity && elt?.last_activity > -1
                    ? dayjs(elt.last_activity).format('h:mm:ss a | DD MMM YY ')
                    : '  -',
            ]);
        }
        const imgData = logoDataURI;
        doc.addImage(imgData, 'JPEG', 230, 10, 120, 27);
        doc.setFontSize(11);
        doc.setTextColor('#3c4b64');
        doc.text(`Identity Name:- ${pdfIdentityName}`, 40, 50);
        doc.text(`Access Type:- ${pdfAccess}`, 40, 70);
        {
            roleAndAcc ? doc.text(`Assume Role Information:- ${roleAndAcc}`, 40, 90, { maxWidth: 550 }) : '';
        }
        doc.text(`Last Scanned on:- ${lastScanTime}`, 370, 50);

        autoTable(doc, {
            head: headers,
            body: data,
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 170 },
                2: { cellWidth: 90 },
                3: { cellWidth: 150 },
                5: { cellWidth: 55 },
            },
            startY: yAxis,
        });

        doc.save('IdentitiesAccess.pdf');
    };

    useEffect(() => {
        setFilteredRecords(props.data);
    }, [props.data]);

    useEffect(() => {
        props.data.map((item: any) => {
            item?.has_full_access === true ? adminAccess.push(item) : null;
            item?.permissions.includes('Permissions management') ? permissionManagement.push(item) : null;
        });
        setAdminAccess(adminAccess);
        setPermissionManagement(permissionManagement);
    }, [props.data]);

    const filterAdminRecord = (value: string) => {
        if (!btnSeleted.find((e) => e === value)) {
            btnSeleted.push(value);
            setBtnSelected(btnSeleted);
        } else {
            const newArray = btnSeleted.filter((el) => el !== value);
            btnSeleted = newArray;
            setBtnSelected(btnSeleted);
        }
        if (btnSeleted.length > 0) {
            let data = props.data;
            data = btnSeleted.find((e) => e === 'adminAccess')
                ? data.filter((value) => adminAccess.some((value2) => value.resource_id === value2.resource_id))
                : data;
            data = btnSeleted.find((e) => e === 'permissionManagement')
                ? data.filter((value) =>
                      permissionManagement.some((value2) => value.resource_id === value2.resource_id),
                  )
                : data;
            setFilteredRecords(data);
        } else {
            setFilteredRecords(props.data);
        }
    };

    // searching data
    const onSearchIdentites = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = props.data?.filter((data: any) => {
                    if (selectedFilerValue === 1) {
                        return data.resource_name.toLowerCase().includes(searchString.toLowerCase());
                    } else if (selectedFilerValue === 2) {
                        return data.resource_type.toLowerCase().includes(searchString.toLowerCase());
                    } else {
                        return (
                            data.resource_name.toLowerCase().includes(searchString.toLowerCase()) ||
                            data.resource_type.toLowerCase().includes(searchString.toLowerCase()) ||
                            data?.permissions?.some((item: any) => {
                                return item.toLowerCase().includes(searchString.toLowerCase());
                            })
                        );
                    }
                });
                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(props.data);
            }
        },
        [props.data, selectedFilerValue],
    );

    const onClickRow = (identity: IdentityResourceDetails, currentPage: number, e: any) => {
        props.onClickRow({ ...identity }, currentPage, e);
    };

    const allData = () => {
        setBtnSelected([]);
        setFilteredRecords(props.data);
    };

    return (
        <>
            <div className="container-fluid mx-0 header-background">
                <div
                    className="my-4 container px-3 py-2 font-small-semibold px-0"
                    data-si-qa-key={`identities-resources-total-count`}
                >
                    {/* {t('resources')} ({filteredRecords.length}) */}
                    <button
                        onClick={allData}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center ${
                            btnSeleted.length <= 0 ? 'btn-selected' : 'disable-border'
                        }`}
                        data-si-qa-key={'identities-resources-all-count'}
                    >
                        {t('all')} ({filteredRecords.length})
                    </button>{' '}
                    <button
                        onClick={() => filterAdminRecord('adminAccess')}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                            btnSeleted.find((e) => e === 'adminAccess') ? 'btn-selected' : 'disable-border'
                        }`}
                        data-si-qa-key={'identities-resources-full-access'}
                    >
                        {t('full_access')} ({adminAccess.length})
                    </button>
                    <button
                        onClick={() => filterAdminRecord('permissionManagement')}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                            btnSeleted.find((e) => e === 'permissionManagement') ? 'btn-selected' : 'disable-border'
                        }`}
                        data-si-qa-key={'identities-resources-permission-management'}
                    >
                        {t('permission_management')} ({permissionManagement.length || 0})
                    </button>
                </div>
            </div>
            <div className="container my-4">
                <div className="d-flex align-items-center mx-0 w-100 mt-4">
                    <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded">
                        <div className="font-x-small-bold">{t('filter')}</div>
                        <div className="w-100">
                            <CDropdown placement="bottom" className="mx-1 p-2 w-100">
                                <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                    <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {FilterItems.map((item: any, index: number) => (
                                        <CDropdownItem
                                            key={index}
                                            onClick={() => setSelectedFilerValue(item.id)}
                                            data-si-qa-key={`identities-resource-filter-${item.id}`}
                                        >
                                            {item.name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </div>
                    <SearchInput
                        data-si-qa-key={`identities-resource-search-bar`}
                        onSearch={onSearchIdentites}
                        placeholder="Search"
                    />
                    <div className="justify-content-end w-40 font-small-semibold">
                        <div style={{ float: 'right' }}>
                            <label className="">{t('export')} </label>
                            <button
                                onClick={() => handleOnPDF(pdfRecord)}
                                type="button"
                                className="btn-custom btn btn-link border ms-2"
                                data-si-qa-key={`identities-resource-pdf`}
                            >
                                PDF
                            </button>
                            <CSVLink
                                filename={'IdentitiesAccess.csv'}
                                className="btn-custom btn btn-link border ms-2"
                                headers={csvheaders}
                                data={csvRecordData}
                                data-si-qa-key={`identities-resource-csv`}
                            >
                                CSV
                            </CSVLink>
                        </div>
                    </div>
                </div>

                <TableComponent
                    onClickRow={(identity: IdentityResourceDetails, currentPage: number, e: any) =>
                        onClickRow(identity, currentPage, e)
                    }
                    handleOnPDF={(records: IdentityResourceDetails[]) => setPdfRecord(records)}
                    handleOnCSV={(records: IdentityResourceDetails[]) => setCsvRecord(records)}
                    data={filteredRecords}
                    isLoading={props.isLoading}
                    translate={props.translate}
                    selectedPage={props.currentPage}
                    showFullTable={props.showFullTable}
                />
            </div>
        </>
    );
};

export default React.memo(SingleIdentityTableView);
