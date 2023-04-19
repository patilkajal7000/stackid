import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import React, { useCallback, useEffect, useState } from 'react';
import DataEndpointInsight from './components/DataEndpointInsight';
import FixTodayCards from './components/FixTodayCard';
import TableComponent from './components/TableComponent';
import SearchInput from '../../../../shared/components/search_input/SearchInput';
import { DataEndpointResorceModel } from 'shared/models/DataEndpointSummaryModel';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE, logoDataURI } from 'shared/utils/Constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getDataEndpointsSummary } from 'core/services/DataEndpointsAPIService';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import dayjs from 'dayjs';
import { setGraphAllDataAction } from 'store/actions/GraphActions';

const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Bucket Name' },
    { id: 2, name: 'Tags' },
    { id: 3, name: 'Platform Tags' },
];

type S3BucketDetailsProps = {
    cloudAccountId: number;
    resource_type: string;
};

const S3BucketDetails = (props: S3BucketDetailsProps) => {
    const [s3Data, setS3Data] = useState<DataEndpointResorceModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [fixTodayBuckets, setFixTodayBuckets] = useState<DataEndpointResorceModel[]>([]);
    const [dataAssestsTypeDisplayText, setDataAssestsTypeDisplayText] = useState<any>();
    const [s3DisplayData, sets3DisplayData] = useState<DataEndpointResorceModel[]>([]);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [pdfRecord, setPdfRecord] = useState<DataEndpointResorceModel[]>([]);
    const [csvRecord, setCsvRecord] = useState<DataEndpointResorceModel[]>([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [lastScan, setLastScan] = useState<any>('');
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    // eslint-disable-next-line prefer-const
    let [btnSeleted, setBtnSelected] = useState<string[]>([]);
    const [publicData, setPublicData] = useState<DataEndpointResorceModel[]>([]);
    const [unEncryptedData, setUnEncryptedData] = useState<DataEndpointResorceModel[]>([]);
    const [notTagged, setNotTagged] = useState<DataEndpointResorceModel[]>([]);
    const [showBulkTagging, setShowBulkTagging] = useState<boolean>(false);
    ////get data using quary
    // const {
    //     data: value,
    //     isLoading: loadingApplication,
    //     isError: applicationDataError,
    // } = useQuery({
    //     queryKey: [`getTags`],
    //     queryFn: (tags: any) => {
    //         return addTags(tags);
    //     },
    // });

    useEffect(() => {
        s3Data.map((item: any) => {
            item?.data_security?.is_public && publicData.push(item);
            !item?.data_security?.is_encrypted && unEncryptedData.push(item);
            !item?.native_tags && notTagged.push(item);
        });
        setPublicData(publicData);
        setUnEncryptedData(unEncryptedData);
        setNotTagged(notTagged);
    }, [s3Data]);

    const openPlatformTags = (e: any) => {
        e.stopPropagation();
        setShowBulkTagging(true);
    };

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
            let data = s3Data;
            data = btnSeleted.find((e) => e === 'public')
                ? data.filter((obj1) => publicData.some((obj2) => obj1.id === obj2.id))
                : data;
            data = btnSeleted.find((e) => e === 'unEncrypted')
                ? data.filter((obj1) => unEncryptedData.some((obj2) => obj1.id === obj2.id))
                : data;
            data = btnSeleted.find((e) => e === 'not_tagged')
                ? data.filter((obj1) => notTagged.some((obj2) => obj1.id === obj2.id))
                : data;

            sets3DisplayData(data);
        } else {
            sets3DisplayData(s3Data);
        }
    };

    const allData = () => {
        setBtnSelected([]);
        sets3DisplayData(s3Data);
    };

    useEffect(() => {
        setIsLoading(true);
        getDataEndpointsSummary(props.cloudAccountId, props.resource_type)
            .then((res: any) => {
                const data = res.resources.sort((a: any, b: any) => {
                    if (!a.risk_score) a.risk_score = 0;
                    if (!b.risk_score) b.risk_score = 0;
                    const risk_score1 = a.risk_score,
                        risk_score2 = b.risk_score;
                    return risk_score1 > risk_score2 ? -1 : 1;
                });

                setS3Data(data);
                sets3DisplayData(data);
                const fixTodayBuckets = data.slice(0, 3);
                setFixTodayBuckets(fixTodayBuckets);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [props.resource_type]);

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

    // download CSV
    const csvheaders: any = [
        { label: 'Resource Name', key: 'name' },
        { label: 'Resource Type', key: 'resource_type' },
        { label: 'BPI', key: 'risk_score' },
    ];

    // download PDF
    const handleOnPDF = (records: DataEndpointResorceModel[]) => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const headers: any = [['No ', 'Resource Name', 'Resource Type', 'BPI']];
        const data: any = records?.map((elt, i) => [i + 1, elt.name, elt.resource_type, elt.risk_score]);
        const imgData = logoDataURI;
        doc.addImage(imgData, 'JPEG', 230, 10, 120, 27);
        doc.setFontSize(12);
        doc.setTextColor('#3c4b64');
        doc.text('S3 BUCKETS', 40, 55);
        doc.setFontSize(10);
        doc.text(`Last Scanned on:- ${lastScanTime}`, 365, 55);
        autoTable(doc, {
            head: headers,
            body: data,
            columnStyles: {
                0: { cellWidth: 35.28 },
                1: { cellWidth: 300 },
                2: { cellWidth: 130 },
                3: { cellWidth: 50 },
            },
            startY: 70,
        });
        doc.save('DataAssetsList.pdf');
    };

    const bucketDetails = (bucketData: DataEndpointResorceModel) => {
        gotoSingleBucket(bucketData);
    };

    const gotoSingleBucket = (bucketData: DataEndpointResorceModel) => {
        dispatch(setGraphAllDataAction({ trevalList: [], parent: [], selectedList: [] }));
        navigate(`${bucketData.id}` + '/' + NAV_TABS_VALUE.RISK_MAP);
    };

    // filter Record
    const filteredRecordsData = (recordID: number) => {
        setSelectedFilerValue(recordID);
    };

    // Search and search by name and tags
    const onSearchBucket = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedBuckets = s3Data?.filter((data: any) => {
                    if (selectedFilerValue === 1) {
                        return data?.name.toLowerCase().includes(searchString.toLowerCase());
                    } else if (selectedFilerValue === 2) {
                        return data?.native_tags?.some((tags: any) => {
                            return (
                                tags?.Key.toLowerCase().includes(searchString.toLowerCase()) ||
                                tags?.Value.toLowerCase().includes(searchString.toLowerCase())
                            );
                        });
                    } else if (selectedFilerValue === 3) {
                        return data?.platformTags?.some((tags: any) => {
                            return (
                                tags?.tag_key.toLowerCase().includes(searchString.toLowerCase()) ||
                                tags?.tag_value.toLowerCase().includes(searchString.toLowerCase())
                            );
                        });
                    } else {
                        return (
                            data?.name.toLowerCase().includes(searchString.toLowerCase()) ||
                            data?.native_tags?.some((tags: any) => {
                                return (
                                    tags?.Key.toLowerCase().includes(searchString.toLowerCase()) ||
                                    tags?.Value.toLowerCase().includes(searchString.toLowerCase())
                                );
                            }) ||
                            data?.platformTags?.some((tags: any) => {
                                return (
                                    tags?.tag_key.toLowerCase().includes(searchString.toLowerCase()) ||
                                    tags?.tag_value.toLowerCase().includes(searchString.toLowerCase())
                                );
                            })
                        );
                    }
                });
                if (selectedBuckets.length > 0) {
                    sets3DisplayData(selectedBuckets);
                    callback && callback('');
                } else {
                    sets3DisplayData([]);
                    callback && callback('No Items found.');
                }
            } else {
                sets3DisplayData(s3Data);
            }
        },
        [s3Data, selectedFilerValue],
    );

    useEffect(() => {
        const type = props.resource_type;
        if (type === 'aws_s3') setDataAssestsTypeDisplayText('buckets');
        else if (type === 'aws_RedshiftCluster') setDataAssestsTypeDisplayText('Cluster');
        else if (type === 'aws_RDSInstance') setDataAssestsTypeDisplayText('RDS Instances');
        else if (type === 'aws_RDSCluster') setDataAssestsTypeDisplayText('RDS Clusters');
        else if (type === 'aws_DynamoDBTable') setDataAssestsTypeDisplayText('DynamoDB Tables');
        else if (type === 'aws_DynamoDBExport') setDataAssestsTypeDisplayText('DynamoDB Exports');
    }, []);

    return (
        <>
            <DataEndpointInsight
                data={s3Data}
                dataAssestsTypeDisplayText={dataAssestsTypeDisplayText}
                isLoading={isLoading}
                iconName="aws-icon"
                translate={t}
                type={props.resource_type}
            />

            <div className="h4 mt-4 container px-0">{t('lets_fix_today')}</div>
            {
                <FixTodayCards
                    translate={t}
                    bucketData={fixTodayBuckets}
                    onClickView={gotoSingleBucket}
                    isLoading={isLoading}
                />
            }

            <div className="container-fluid mx-0 header-background my-3 py-2">
                <div className="container d-flex flex-row align-content-around  px-0">
                    <button
                        onClick={allData}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center ${
                            btnSeleted.length <= 0 ? 'btn-selected' : 'disable-border'
                        }`}
                    >
                        {props.resource_type === 'aws_RedshiftCluster'
                            ? 'Cluster'
                            : props.resource_type === 'aws_RDSInstance'
                            ? 'RDS Instances'
                            : props.resource_type === 'aws_RDSCluster'
                            ? 'RDS Clusters'
                            : props.resource_type === 'aws_DynamoDBTable'
                            ? 'DynamoDB Tables'
                            : props.resource_type === 'aws_DynamoDBExport'
                            ? 'DynamoDB Exports'
                            : t('s3_bucket')}{' '}
                        ({s3Data.length || 0})
                    </button>
                    <button
                        onClick={() => filterAdminRecord('public')}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                            btnSeleted.find((e) => e === 'public') ? 'btn-selected' : 'disable-border'
                        }`}
                    >
                        {t('public')} ({publicData.length || 0})
                    </button>
                    <button
                        onClick={() => filterAdminRecord('unEncrypted')}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                            btnSeleted.find((e) => e === 'unEncrypted') ? 'btn-selected' : 'disable-border'
                        }`}
                    >
                        {t('un_encrypted')} ({unEncryptedData.length || 0})
                    </button>
                    <button
                        onClick={() => filterAdminRecord('not_tagged')}
                        type="button"
                        className={`btn btn-custom btn-filter justify-content-center align-items-center m-0 me-2 ${
                            btnSeleted.find((e) => e === 'not_tagged') ? 'btn-selected' : 'disable-border'
                        }`}
                    >
                        {t('not_tagged')} ({notTagged.length || 0})
                    </button>
                </div>
            </div>

            <div className="container-fluid mx-0">
                <div className="container px-0 mb-2">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded">
                            <div className="font-x-small-bold">{t('filter')}</div>
                            <div className="w-100">
                                <CDropdown placement="bottom" className=" p-2 w-100">
                                    <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                        <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {FilterItems.map((item: any, index: number) => (
                                            <CDropdownItem key={index} onClick={() => filteredRecordsData(item.id)}>
                                                {item.name}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                        </div>
                        {props.resource_type === 'aws_RelationalDatabaseService' ? (
                            <SearchInput onSearch={onSearchBucket} placeholder="Search RDS Instances" />
                        ) : props.resource_type === 'aws_RedshiftCluster' ? (
                            <SearchInput onSearch={onSearchBucket} placeholder="Search Cluster" />
                        ) : props.resource_type === 'aws_DynamoDB' ? (
                            <SearchInput onSearch={onSearchBucket} placeholder="Search DynamoDB" />
                        ) : (
                            <SearchInput onSearch={onSearchBucket} placeholder="Search Bucket" />
                        )}
                        <div className="justify-content-end w-40 font-small-semibold">
                            <div style={{ float: 'right' }}>
                                <button
                                    className="btn-custom btn btn-link border me-2"
                                    onClick={(e) => openPlatformTags(e)}
                                >
                                    Bulk Tagging
                                </button>
                                <label> {t('export')} </label>
                                <button
                                    onClick={() => handleOnPDF(pdfRecord)}
                                    type="button"
                                    className="btn-custom btn btn-link border ms-2"
                                >
                                    PDF
                                </button>
                                <CSVLink
                                    filename={'DataAssetsList.csv'}
                                    className="btn-custom btn btn-link border ms-2"
                                    headers={csvheaders}
                                    data={csvRecord}
                                >
                                    CSV
                                </CSVLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TableComponent
                onClickRow={bucketDetails}
                handleOnPDF={(records: DataEndpointResorceModel[]) => setPdfRecord(records)}
                handleOnCSV={(records: DataEndpointResorceModel[]) => setCsvRecord(records)}
                data={s3DisplayData}
                isLoading={isLoading}
                translate={t}
                resourceType={props.resource_type}
                showBulkTagging={showBulkTagging}
                setShowBulkTagging={setShowBulkTagging}
                openPlatformTags={openPlatformTags}
            />
        </>
    );
};

export default React.memo(S3BucketDetails);
