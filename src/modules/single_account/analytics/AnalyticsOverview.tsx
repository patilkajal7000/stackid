import React, { useEffect, useMemo, useState } from 'react';
import SchemaTables from './SchemaTables';
import {
    createdJobId,
    getQueryCSV,
    getQueryHistory,
    getQueryXLSX,
    getResult,
    getStatus,
    saveQuery,
} from 'core/services/DataEndpointsAPIService';
import Pagination from 'shared/components/pagination/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import Skeleton from 'react-loading-skeleton';
import fileDownload from 'js-file-download';
import { logoDataURI, NAV_TABS_VALUE, ToastVariant } from 'shared/utils/Constants';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { useNavigate, useParams } from 'react-router-dom';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    CAvatar,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CModal,
    CModalContent,
    CModalTitle,
    CTooltip,
} from '@coreui/react';

const AnalyticsOverview = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>();
    const [queryOutput, setQueryOutput] = useState<any>([]);
    const [tableColumns, setTableColumns] = useState<any>();
    const [queryBody, setQueryBody] = useState<any>({ query: '' });
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const params = useParams<any>();
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
    const [categoriesList, setCategoriesList] = useState<any>([]);
    const [categoriesInfo, setCategoriesInfo] = useState<any>([]);

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';

    const [queryDeleted, setQueryDeleted] = useState<boolean>(false);
    const [queryUpdated, setQueryUpdated] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<any>('Schema');
    const [saveClicked, setSaveClicked] = useState<any>(false);

    //save query
    const [queryName, setQueryName] = useState<any>('');
    const [queryCategory, setQueryCategory] = useState<any>('');
    const [isShared, setIsShared] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const PageSize = 100;
    const currentPageNo = 1;

    useEffect(() => {
        setQueryOutput(queryOutput);
        if (queryOutput && queryOutput?.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [queryOutput]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return queryOutput.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, queryOutput]);

    const exampleQuery = `
    select 
        event_name, 
        count(*) as count 
    from 
        aws_cloudtrail_events 
    where 
        event_time > now() - interval '12' hour 
    group by 
        1`;

    // useEffect(() => {
    //     dispatch(setTabsAction(NAV_TABS_VALUE.ANALYTICS, ''));
    // }, []);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: NAV_TABS_VALUE.ANALYTICS,
                    path: '', // CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/' + NAV_TABS_VALUE.ANALYTICS + '/' + type,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
    }, []);

    // group by category
    function groupByKey(array: [], key: string) {
        return array.reduce((hash: any, obj: any) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
        }, {});
    }

    useEffect(() => {
        getQueryHistory(orgId)
            .then((response: any) => {
                setQueryDeleted(false);
                setQueryUpdated(false);
                setSaveClicked(false);

                const uniqueCategories = groupByKey(response, 'category');
                setCategoriesList(uniqueCategories);
                setCategoriesInfo(uniqueCategories);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [selectedTab, queryDeleted, queryUpdated, saveClicked, openSaveModal]);

    function recursiveQueryRun(job_id: any) {
        //get status
        getStatus(orgId, job_id)
            .then((response: any) => {
                if (response.status === 'in-progress') {
                    setTimeout(() => {
                        recursiveQueryRun(response.job_id);
                    }, 5000);
                } else if (response.status === 'failed') {
                    setError(response.error);
                    setIsLoading(false);
                } else {
                    //get final result
                    getResult(orgId, job_id)
                        .then((response: any) => {
                            if (response.length === 0) {
                                setIsLoading(false);
                                setError('No Data');
                            } else {
                                setQueryOutput(response);
                                setIsLoading(false);
                                setError(null);
                            }
                        })
                        .catch((error: any) => {
                            setError(error.message);
                            console.log('error', error);
                        });
                }
            })
            .catch((error: any) => {
                setError(error.message);
                console.log('error', error);
            });
    }

    const handleQueryRun = () => {
        setIsLoading(true);

        if (queryBody) {
            //first call to fetch job id
            createdJobId(orgId, queryBody)
                .then((response: any) => {
                    if (response?.status === 'created') {
                        recursiveQueryRun(response.job_id);
                    }
                })
                .catch((error: any) => {
                    setIsLoading(false);
                    setError(error.message);
                    console.log('error', error);
                });
        }
    };

    // setting table column names in an array
    useEffect(() => {
        if (queryOutput?.length) {
            setTableColumns(Object.keys(queryOutput[0]));
        }
    }, [queryOutput]);

    const b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
        const byteCharacters = window.atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    //fetch query xlsx
    const handleXLSXDownload = (filename: any) => {
        if (queryOutput) {
            if (queryOutput?.length) {
                getQueryXLSX(queryOutput)
                    .then((response: any) => {
                        const blob = b64toBlob(
                            response,
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        );
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = filename;
                        link.href = blobUrl;
                        link.click();
                    })
                    .catch((error: any) => {
                        setIsLoading(false);
                        setError(error.message);
                    });
            }
        }
    };

    // fetch query csv
    const handleCSVDownload = (filename: any) => {
        if (queryOutput) {
            if (queryOutput?.length) {
                getQueryCSV(queryOutput)
                    .then((response: any) => {
                        fileDownload(response, filename);
                    })
                    .catch((error: any) => {
                        setIsLoading(false);
                        setError(error.message);
                    });
            }
        }
    };

    const getTableColumn = (col: any) => {
        if (typeof col === 'boolean') {
            return col.toString();
        } else {
            if (col || col === 0) {
                if (typeof col === 'object') return JSON.stringify(col);
                else return col;
            } else return '-';
        }
    };

    const saveQueryHistory = () => {
        const body = {
            query: `${queryBody.query.trim()}`,
            name: `${queryName}`,
            status: 'successful', // successful, failed, cancelled
            is_shared: isShared,
            category: `${queryCategory}`,
        };

        saveQuery(orgId, body)
            .then(() => {
                setIsLoading(false);
                setError(null);
            })
            .catch((error: any) => {
                setIsLoading(false);
                setError(error.message);
            });
    };

    // download PDF
    const handleOnPDF = () => {
        const doc = new jsPDF();

        const imgData = logoDataURI;
        doc.addImage(imgData, 'JPEG', 85, 5, 40, 11);
        doc.setFontSize(12);
        doc.setTextColor('#3c4b64');
        doc.setFontSize(10);

        autoTable(doc, {
            html: '#query_output',

            startY: 20,
        });
        doc.save('QueryOutput.pdf');
    };

    return (
        <div className="container dashboard-main mt-3">
            <div className={`h-50rem row`}>
                <div className={` h-50rem col-xl-8 col-lg-12`}>
                    <div className={`query-border h-48 col-md-12 p-3 mb-3`}>
                        <textarea
                            spellCheck="false"
                            className={`resize font-large form-control `}
                            rows={12}
                            onChange={(e) => setQueryBody({ query: `${e.target.value}` })}
                            placeholder={exampleQuery}
                            value={queryBody.query}
                        />

                        <div className="d-inline-block float-end">
                            <div className="py-2 float-end pointer">
                                <div className="d-inline-block pe-2">
                                    <CTooltip
                                        trigger="hover"
                                        placement="bottom"
                                        content="Copy Example Query to Clipboard"
                                    >
                                        <CAvatar
                                            color="dark"
                                            size="sm"
                                            textColor="white"
                                            className={`text-neutral-400 font-medium-semibold mx-2`}
                                            onClick={() => {
                                                navigator.clipboard.writeText(exampleQuery);
                                                dispatch(
                                                    setToastMessageAction(
                                                        ToastVariant.SUCCESS,
                                                        'Query copied to clipboard.',
                                                    ),
                                                );
                                            }}
                                        >
                                            ?
                                        </CAvatar>
                                    </CTooltip>
                                </div>
                                <div className="float-end d-inline-block">
                                    <button
                                        className={`w-8rem float-start form-control border-0 me-2 header-background font-medium-semibold`}
                                        type="button"
                                        disabled={queryBody.query !== '' ? false : true}
                                        onClick={() => {
                                            setOpenSaveModal(true);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className={`w-8rem float-end form-control border-0 header-background font-medium-semibold`}
                                        type="button"
                                        disabled={queryBody.query !== '' ? false : true}
                                        onClick={() => {
                                            isLoading ? setIsLoading(false) : handleQueryRun();
                                        }}
                                    >
                                        {isLoading ? <p className="m-0">Cancel</p> : <p className="m-0">Run</p>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`h-50 query-border query-output overflow-hidden p-2 col-md-12`}>
                        {isLoading ? (
                            <div className="d-flex justify-content-between container px-0">
                                <div className="container mt-3">
                                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Skeleton count={10} height={30} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <>
                                {error ? (
                                    <div className="container text-danger"> Error: {error} </div>
                                ) : (
                                    currentTableData?.length > 0 && (
                                        <>
                                            <div className={`text-neutral-400 text-neutral-400 float-end d-flex`}>
                                                <button
                                                    type="button"
                                                    className="w-auto form-control border-1 header-background font-medium-semibold me-1"
                                                    onClick={() => handleOnPDF()}
                                                >
                                                    PDF
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-auto form-control border-1 header-background font-medium-semibold me-1"
                                                    onClick={() => handleXLSXDownload('QueryOutput.xlsx')}
                                                >
                                                    XLSX
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-auto form-control border-1 header-background font-medium-semibold me-1"
                                                    onClick={() => handleCSVDownload('QueryOutput.csv')}
                                                >
                                                    CSV
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-auto form-control border-1 header-background font-medium-semibold"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            JSON.stringify(currentTableData, null, 2),
                                                        );
                                                        dispatch(
                                                            setToastMessageAction(
                                                                ToastVariant.SUCCESS,
                                                                'JSON copied to clipboard.',
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    JSON
                                                </button>
                                            </div>

                                            <div className={`overflow-scroll w-835 h-335 inline-block mt-5`}>
                                                <table id="query_output" className="p-2 border">
                                                    <thead>
                                                        <tr>
                                                            {tableColumns &&
                                                                tableColumns?.map((col: any, index: number) => (
                                                                    <th
                                                                        className="font-large-semibold p-2 border border-dark"
                                                                        key={index}
                                                                    >
                                                                        {col}
                                                                    </th>
                                                                ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentTableData &&
                                                            currentTableData?.map((query: any, index: number) => (
                                                                <tr key={index} className="font-medium">
                                                                    {tableColumns &&
                                                                        tableColumns?.map((col: any, i: number) => (
                                                                            <td
                                                                                key={i}
                                                                                className={`flex-nowrap p-2 border border-dark`}
                                                                            >
                                                                                {getTableColumn(query[col])}
                                                                            </td>
                                                                        ))}
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )
                                )}
                            </>
                        )}
                    </div>
                    <Pagination
                        className="pagination-bar justify-content-end mt-1"
                        currentPage={currentPage}
                        totalCount={queryOutput?.length}
                        pageSize={PageSize}
                        siblingCount={1}
                        onPageChange={(page: number) => {
                            setCurrentPage(page);
                            navigate('?pageNo=' + page);
                        }}
                    />
                </div>
                <div className={`h-50rem header-background overflow-auto col-xl-4 col-lg-6 border p-3`}>
                    <SchemaTables
                        setQueryBody={setQueryBody}
                        setQueryDeleted={setQueryDeleted}
                        setQueryUpdated={setQueryUpdated}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        categoriesList={categoriesList}
                        categoriesInfo={categoriesInfo}
                        setCategoriesInfo={setCategoriesInfo}
                    />
                </div>
            </div>
            {openSaveModal && (
                <>
                    <CModal visible={openSaveModal} className="rounded-0">
                        <CModalTitle>
                            <div className="font-large-bold float-start mx-2 my-2">Save Query As</div>
                        </CModalTitle>
                        <CModalContent style={{ border: 'none' }}>
                            <div className="p-2 mb-2 header-background">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="p-2">Name: </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(e: any) => setQueryName(e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2">Category: </td>
                                            <td className="p-2">
                                                <CDropdown alignment={{ xs: 'start', lg: 'end' }}>
                                                    <input
                                                        type="text"
                                                        value={queryCategory}
                                                        onChange={(e: any) => setQueryCategory(e.target.value)}
                                                        className="form-control"
                                                        aria-label="Text input with dropdown button"
                                                    />
                                                    <CDropdownToggle
                                                        className="ms-1"
                                                        color="secondary"
                                                        disabled={Object.keys(categoriesList).length > 0 ? false : true}
                                                    />
                                                    <CDropdownMenu>
                                                        {Object.keys(categoriesList)?.map((query: any, index: any) => (
                                                            <CDropdownItem
                                                                key={index}
                                                                onClick={() => setQueryCategory(query)}
                                                            >
                                                                {query}
                                                            </CDropdownItem>
                                                        ))}
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2">Shared: </td>
                                            <td className="p-2">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e: any) => setIsShared(e.target.checked)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex gap-2 flex-row-reverse">
                                <button
                                    className="header-background border-0 w-auto mb-1 form-control font-medium-semibold float-start"
                                    onClick={() => setOpenSaveModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="header-background border-0 w-auto mb-1 form-control font-medium-semibold float-end"
                                    disabled={queryName !== '' && queryCategory !== '' ? false : true}
                                    onClick={() => {
                                        saveQueryHistory();
                                        setOpenSaveModal(false);
                                        setSaveClicked(true);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </CModalContent>
                    </CModal>
                </>
            )}
        </div>
    );
};

export default AnalyticsOverview;
