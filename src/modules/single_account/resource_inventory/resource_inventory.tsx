import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import { getResourceInventorySummaryURL, getResourceInventoryListURL } from 'core/services/DataEndpointsAPIService';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { ACCOUNTS_URL } from '..';
import { logoDataURI } from 'shared/utils/Constants';
import Pagination from 'shared/components/pagination/Pagination';
import { CModal, CModalBody, CModalHeader, CTooltip } from '@coreui/react';
import dayjs from 'dayjs';

const Resource_inventory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [summaryCurrentPage, setSummaryCurrentPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [lastScan, setLastScan] = useState<any>('');
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const [resourceInventorySummaryArray, setResourceInventorySummary] = useState<any[]>([]);
    const [resourceInventoryListArray, setResourceInventoryList] = useState<any[]>([]);
    const [show, setShowDialogFlag] = useState(false);
    const [selectedTaggedData, setSelectedTaggedData] = useState([]);
    const cloudAccountId = selectedcloudAccounts?.id;
    const SummaryPageSize = 15;
    const SummarycurrentPageNo = 1;
    const PageSize = 15;
    const currentPageNo = 1;

    useEffect(() => {
        setIsLoading(true);
        if (cloudAccountId) {
            getResourceInventorySummaryURL(cloudAccountId)
                .then((response: any) => {
                    setIsLoading(false);
                    if (response && response.length > 0) {
                        const summeryArr: any[] = [];
                        Object.values(response).map((summery: any) => {
                            summeryArr.push(summery);
                        });
                        setResourceInventorySummary(summeryArr);
                    }
                })
                .catch((error: any) => {
                    setIsLoading(false);
                    console.log('in error', error);
                });
        } else {
            navigate(ACCOUNTS_URL);
        }
    }, [cloudAccountId, selectedcloudAccounts]);

    useEffect(() => {
        if (resourceInventorySummaryArray && resourceInventorySummaryArray.length > 0) {
            SummarycurrentPageNo ? setSummaryCurrentPage(SummarycurrentPageNo) : setSummaryCurrentPage(1);
        }
    }, [resourceInventorySummaryArray]);

    const currentTableDataSummery = useMemo(() => {
        const firstPageIndex = (summaryCurrentPage - 1) * SummaryPageSize;
        const lastPageIndex = firstPageIndex + SummaryPageSize;
        return resourceInventorySummaryArray.slice(firstPageIndex, lastPageIndex);
    }, [summaryCurrentPage, resourceInventorySummaryArray]);

    useEffect(() => {
        setIsLoading(true);
        if (cloudAccountId) {
            getResourceInventoryListURL(cloudAccountId)
                .then((response: any) => {
                    setIsLoading(false);
                    if (response && response.length > 0) {
                        const listArr: any[] = [];
                        Object.values(response).map((list: any) => {
                            listArr.push(list);
                        });
                        setResourceInventoryList(listArr);
                    }
                })
                .catch((error: any) => {
                    setIsLoading(false);
                    console.log('in error', error);
                });
        } else {
            navigate(ACCOUNTS_URL);
        }
    }, [cloudAccountId, selectedcloudAccounts]);

    useEffect(() => {
        if (resourceInventoryListArray && resourceInventoryListArray.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [resourceInventoryListArray]);

    const currentTableDataList = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return resourceInventoryListArray.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, resourceInventoryListArray]);

    //last scan time
    const getLastScanTime = () => {
        setLastScan(selectedcloudAccounts?.last_scan_event_ts);
    };
    useEffect(() => {
        getLastScanTime();
    }, [cloudAccountId, selectedcloudAccounts]);
    const lastActive = () => {
        return dayjs(parseInt(lastScan) * 1000).format('DD MMM YY | hh:mm a');
    };
    const lastScanTime = lastScan ? lastActive() : 'Loading...';

    // download CSV
    const summarycsvheaders: any = [
        { label: 'Resource Type', key: 'resource_type' },
        { label: 'Region', key: 'region' },
        { label: 'Count', key: 'count' },
    ];

    // download PDF
    const handleOnSummaryPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const headers: any = [['No ', 'Resource Type', 'Region', 'Count']];
        const data: any = resourceInventorySummaryArray?.map((elt, i) => [
            i + 1,
            elt.resource_type,
            elt.region,
            elt.count,
        ]);
        const imgData = logoDataURI;
        doc.addImage(imgData, 'JPEG', 230, 10, 120, 27);
        doc.setTextColor('#3c4b64');
        doc.setFontSize(11);
        doc.text(`Resource Inventory Summary`, 40, 50);
        doc.setFontSize(10);
        doc.text(`Cloud Account Name:- ${selectedcloudAccounts?.name}`, 40, 70);
        doc.text(`Last Scanned on:- ${lastScanTime}`, 370, 50);
        // autoTable(doc, { html: '#Inventory_Summary' });

        autoTable(doc, {
            head: headers,
            body: data,
            columnStyles: {
                0: { cellWidth: 35.28 },
                1: { cellWidth: 300 },
                2: { cellWidth: 130 },
                3: { cellWidth: 50 },
            },
            startY: 80,
        });

        doc.save('Resource Inventory Summary.pdf');
    };

    // download CSV
    const listcsvheaders: any = [
        { label: 'Name', key: 'name' },
        { label: 'Resource Type', key: 'resource_type' },
        { label: 'Region', key: 'region' },
        { label: 'Resource Category', key: 'resource_category' },
    ];

    // download PDF
    const handleOnListPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.setTextColor('#3c4b64');
        const headers: any = [['No ', 'Name', 'Resource Type', 'Region', 'Resource Category']];
        const data: any = resourceInventoryListArray?.map((elt, i) => [
            i + 1,
            elt.name,
            elt.resource_type,
            elt.region,
            elt.resource_category,
        ]);
        const imgData = logoDataURI;
        doc.addImage(imgData, 'JPEG', 230, 10, 120, 27);
        doc.setFontSize(11);
        doc.text(`Resource Inventory List`, 40, 50);
        doc.setFontSize(10);
        doc.text(`Cloud Account Name:- ${selectedcloudAccounts?.name}`, 40, 70);
        doc.text(`Last Scanned on:- ${lastScanTime}`, 370, 50);

        autoTable(doc, {
            head: headers,
            body: data,
            columnStyles: {
                0: { cellWidth: 35.28 },
                1: { cellWidth: 200 },
                2: { cellWidth: 130 },
                3: { cellWidth: 75 },
                4: { cellWidth: 75 },
            },
            startY: 80,
        });
        doc.save('Resource Inventory List.pdf');
    };

    const openAllNativeTags = (data: any, e: any) => {
        e.stopPropagation();
        if (data.native_tags) {
            setSelectedTaggedData(data.native_tags);
            setShowDialogFlag(true);
        }
    };

    return (
        <div className="container-fluid mt-4 p-0">
            <div className="container-fluid">
                <div className="container d-flex justify-content-between ">
                    <div className="font-small-semibold">
                        Name: {selectedcloudAccounts?.name} <br /> Cloud Platform (ID):{' '}
                        {selectedcloudAccounts?.cloud_provider} (
                        {selectedcloudAccounts?.cloud_provider === 'AWS'
                            ? selectedcloudAccounts?.account_details?.Account
                            : selectedcloudAccounts?.name}
                        )
                    </div>
                    <div className="font-small">
                        {`Last Scanned on:- ${lastScanTime}`} <br /> Organization ID: {selectedcloudAccounts?.org_id}
                    </div>
                </div>
            </div>
            <div className="header-background mt-4 mb-4">
                <div className="container d-flex justify-content-between">
                    <div className="py-2 font-small-semibold">
                        {t('Resource Inventory Summary')} ({resourceInventorySummaryArray.length})
                    </div>
                    <div style={{ float: 'right' }}>
                        <label className="font-small-semibold">{t('export')} </label>
                        <button
                            onClick={() => handleOnSummaryPDF()}
                            type="button"
                            className="btn-custom btn btn-link border ms-2"
                        >
                            PDF
                        </button>
                        <CSVLink
                            filename={'ResourceInventorySummary.csv'}
                            className="btn-custom btn btn-link border ms-2"
                            headers={summarycsvheaders}
                            data={resourceInventorySummaryArray}
                        >
                            CSV
                        </CSVLink>
                    </div>
                </div>
            </div>
            <table
                id="Inventory_Summary"
                className="table table-borderless table-hover container custom-table shadow-6"
            >
                <thead className="font-small-semibold">
                    <tr className="border-bottom">
                        <th className="ps-4 no-pointer">{t('resource_type')}</th>
                        <th className="ps-4 no-pointer">{t('region')}</th>

                        <th className="ps-4 no-pointer">
                            <CTooltip content="Resource Count">
                                <span>{t('count')}</span>
                            </CTooltip>
                        </th>
                    </tr>
                </thead>
                <tbody className="font-small">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="">
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : currentTableDataSummery && currentTableDataSummery.length > 0 ? (
                        currentTableDataSummery.map((summary, index) => (
                            <tr key={index}>
                                <td className="ps-4 w-40 no-pointer">{summary.resource_type}</td>
                                <td className="ps-4 w-40 no-pointer">{summary.region || '-'}</td>
                                <td className="ps-4 w-20 no-pointer">{summary.count}</td>
                            </tr>
                        ))
                    ) : (
                        resourceInventorySummaryArray.length == 0 && (
                            <tr className="text-center">
                                <td colSpan={5}>{t('no_records_available')} </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <div className="container">
                <Pagination
                    className="pagination-bar justify-content-end"
                    currentPage={summaryCurrentPage}
                    totalCount={resourceInventorySummaryArray.length}
                    pageSize={SummaryPageSize}
                    siblingCount={1}
                    onPageChange={(page: number) => {
                        setSummaryCurrentPage(page);
                        navigate('?pageNo=' + page);
                    }}
                />
            </div>
            <div className="header-background mt-4 mb-4">
                <div className="container d-flex justify-content-between">
                    <div className="py-2 font-small-semibold">
                        {t('Resource Inventory List')} ({resourceInventoryListArray.length})
                    </div>
                    <div style={{ float: 'right' }}>
                        <label className="font-small-semibold">{t('export')} </label>
                        <button
                            onClick={() => handleOnListPDF()}
                            type="button"
                            className="btn-custom btn btn-link border ms-2"
                        >
                            PDF
                        </button>
                        <CSVLink
                            filename={'ResourceInventoryList.csv'}
                            className="btn-custom btn btn-link border ms-2"
                            headers={listcsvheaders}
                            data={resourceInventoryListArray}
                        >
                            CSV
                        </CSVLink>
                    </div>
                </div>
            </div>
            <table id="Inventory_List" className="table table-borderless table-hover container custom-table shadow-6">
                <thead className="font-small-semibold">
                    <tr className="border-bottom">
                        <th className="ps-4 w-20 no-pointer">{t('name')}</th>
                        <th className="ps-4 no-pointer">{t('resource_type')}</th>
                        <th className="ps-4 no-pointer">
                            {selectedcloudAccounts?.cloud_provider === 'AWS' ? t('tags') : t('classification')}
                        </th>
                        <th className="ps-4 no-pointer">{t('region')}</th>
                        <th className="ps-4 no-pointer">{t('resource_category')}</th>
                    </tr>
                </thead>
                <tbody className="font-small">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="">
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : currentTableDataList && currentTableDataList.length > 0 ? (
                        currentTableDataList.map((list, index) => (
                            <tr key={index}>
                                <td className="ps-4 no-pointer">{list.name}</td>
                                <td className="ps-4 no-pointer">{list.resource_type}</td>
                                <td className="ps-4 no-pointer">
                                    <div
                                        role="presentation"
                                        onClick={(e) => {
                                            openAllNativeTags(list, e);
                                        }}
                                    >
                                        {selectedcloudAccounts?.cloud_provider === 'AWS'
                                            ? list?.native_tags
                                                ? '(' + list?.native_tags.length + ') '
                                                : '(0) '
                                            : ''}
                                        {selectedcloudAccounts?.cloud_provider === 'GCP'
                                            ? list?.native_tags
                                                ? list?.native_tags?.org
                                                : '-'
                                            : list?.native_tags
                                            ? list?.native_tags[0]?.Key
                                            : '-'}
                                    </div>
                                </td>
                                <td className="ps-4 no-pointer">{list.region || '-'}</td>
                                <td className="ps-4 no-pointer">{list.resource_category}</td>
                            </tr>
                        ))
                    ) : (
                        resourceInventoryListArray.length == 0 && (
                            <tr className="text-center">
                                <td colSpan={5}>{t('no_records_available')} </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <CModal
                className="tag-modal"
                visible={show}
                onClose={() => setShowDialogFlag(false)}
                aria-labelledby="example-custom-modal-styling-title"
                alignment="center"
            >
                <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                    <div className="h4">
                        {t('tags')} ({selectedTaggedData.length})
                    </div>
                </CModalHeader>
                <CModalBody className="pt-1 pb-1">
                    <table className="table table-borderless table-hover custom-table container shadow-6 no-pointer rounded overflow-hidden">
                        <thead className="border-bottom">
                            <tr>
                                <th className="no-pointer">{t('key')}</th>
                                <th className="no-pointer">{t('value')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTaggedData.map((ev: any, key: any) => {
                                return (
                                    <tr key={key}>
                                        <td className="p-2 no-pointer">{ev.Key}</td>
                                        <td className="p-2 no-pointer">{ev.Value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CModalBody>
            </CModal>
            <div className="container">
                <Pagination
                    className="pagination-bar justify-content-end"
                    currentPage={currentPage}
                    totalCount={resourceInventoryListArray.length}
                    pageSize={PageSize}
                    siblingCount={1}
                    onPageChange={(page: number) => {
                        setCurrentPage(page);
                        navigate('?pageNo=' + page);
                    }}
                />
            </div>
        </div>
    );
};

export default Resource_inventory;
