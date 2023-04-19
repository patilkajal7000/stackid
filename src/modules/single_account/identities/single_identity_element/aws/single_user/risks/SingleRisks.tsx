import { CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Pagination from 'shared/components/pagination/Pagination';
import SearchInput from 'shared/components/search_input/SearchInput';
import { RiskChartDetails } from 'shared/models/IdentityAccessModel';
import { AppState } from 'store/store';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import './index.css';
import { createdJobId, getPolicyDocument, getResult, getStatus } from 'core/services/DataEndpointsAPIService';
type SingleRisksProps = {
    data: RiskChartDetails;
    type: string;
};

const PageSize = 5;
const FilterItems: any = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Service Name' },
];
const SingleRisks = (props: SingleRisksProps) => {
    const { t } = useTranslation();
    const params = useParams<any>();
    const [riskData, setRiskData] = useState<RiskChartDetails>();
    const [titleText, setTitleText] = useState('');
    const [subTitleText, setSubTitleText] = useState('');
    const [label1Text, setLabel1Text] = useState('');
    const [label2Text, setLabel2Text] = useState('');
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id || '';
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;

    const [serviceName, setServiceName] = useState<any>();
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [currentPage, setCurrentPage] = useState(0);
    const [displayData, setDisplayData] = useState<any>();
    const [usedUnusedPermissions, setUsedUnusedPermissions] = useState<any>();
    const [usedUnusedPermissionsLoading, setUsedUnusedPermissionsLoading] = useState<any>();
    const [usedUnusedPermissionsError, setUsedUnusedPermissionsError] = useState<any>();
    const [downloadPolicyDocument, setDownloadPolicyDocument] = useState<any>();

    useEffect(() => {
        cloudAccountType !== 'GCP' && handleQueryRun();
        setRiskData(props.data);
    }, [props.data]);

    useEffect(() => {
        if (props.type == 'excessive_access') {
            setExcessiveAccessText();
        } else {
            setUsedAccessText();
        }
    }, [riskData]);

    const queryBody = {
        queryId: 'aws_used_unused_permissions',
        accountId: cloudAccountId.toString(),
        identityIds: [props.data?.user_id],
    };

    function recursiveQuery(job_id: any) {
        getStatus(orgId, job_id)
            .then((response: any) => {
                if (response.status === 'in-progress') {
                    setTimeout(() => {
                        recursiveQuery(response.job_id);
                    }, 5000);
                } else if (response.status === 'failed') {
                    setUsedUnusedPermissionsError(response.error);
                    setUsedUnusedPermissionsLoading(false);
                } else {
                    //get final result
                    getResult(orgId, job_id)
                        .then((response: any) => {
                            if (response.length === 0) {
                                setUsedUnusedPermissionsLoading(false);
                                setUsedUnusedPermissionsError('No Data');
                            } else {
                                setUsedUnusedPermissions(response);
                                setUsedUnusedPermissionsLoading(false);
                                setUsedUnusedPermissionsError(null);
                            }
                        })
                        .catch((error: any) => {
                            setUsedUnusedPermissionsError(error.message);
                            console.log('error', error);
                        });
                }
            })
            .catch((error: any) => {
                setUsedUnusedPermissionsError(error.message);
                console.log('error', error);
            });
    }
    const handleQueryRun = () => {
        if (queryBody) {
            setUsedUnusedPermissionsLoading(true);
            createdJobId(orgId, queryBody)
                .then((response: any) => {
                    if (response?.status === 'created') {
                        recursiveQuery(response.job_id);
                    }
                })
                .catch((error: any) => {
                    setUsedUnusedPermissionsLoading(false);
                    setUsedUnusedPermissionsError(error.message);
                    console.log('error', error);
                });
        }
    };

    useEffect(() => {
        const arr: any[] = [];
        if (
            usedUnusedPermissions &&
            !usedUnusedPermissionsError &&
            usedUnusedPermissions != undefined &&
            usedUnusedPermissions != null
        ) {
            Object.keys(usedUnusedPermissions)?.map((permission: any) => {
                const temp = usedUnusedPermissions[permission].permissions;
                Object.keys(temp).map((value: any) => Object.keys(temp[value]).map((service) => arr.push(service)));
            });
            setServiceName(Array.from(new Set(arr)));
            setDisplayData(Array.from(new Set(arr)));

            const list: any[] = [];
            Object.keys(usedUnusedPermissions)?.map((permission: any) =>
                Object.keys(usedUnusedPermissions[permission]?.permissions).map(
                    (data: any) =>
                        data == 'used_permissions' &&
                        Object.keys(usedUnusedPermissions[permission]?.permissions[data]).map((value) =>
                            usedUnusedPermissions[permission]?.permissions[data][value].map((item: any) =>
                                list.push(item),
                            ),
                        ),
                ),
            );
            if (list.length > 0) {
                const body = {
                    cloud_account_id: cloudAccountId,
                    actions: list,
                };
                getPolicyDocument(body).then((response: any) => {
                    setDownloadPolicyDocument(JSON.stringify(response, null, 2));
                });
            }
        }
    }, [usedUnusedPermissions]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return displayData?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, displayData]);

    useEffect(() => {
        if (displayData && displayData.length > 0) {
            currentPage ? setCurrentPage(currentPage) : setCurrentPage(1);
        }
    }, [displayData]);

    const setUsedAccessText = () => {
        setTitleText('Data Assets not accessed');
        if (riskData) {
            const txt =
                riskData.unused_access +
                ' unused Data Assets from a total of ' +
                riskData.total_access +
                ' Data Assets';
            setSubTitleText(txt);

            setLabel1Text('Unused Data Assets   ' + riskData?.unused_access);
            setLabel2Text('Used Data Assets       ' + (riskData?.total_access - riskData?.unused_access));
        }
    };

    const setExcessiveAccessText = () => {
        setTitleText('Access not used');
        if (riskData) {
            const txt = riskData.unused_access + ' Dormant Access from a total of ' + riskData.total_access + ' Access';
            setSubTitleText(txt);
            setLabel1Text('Dormant Access   ' + riskData?.unused_access);
            setLabel2Text('Used Access      ' + (riskData?.total_access - riskData?.unused_access));
        }
    };

    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            setCurrentPage(1);
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedService = Object.values(serviceName).filter((service: any) => {
                    switch (selectedFilerValue) {
                        case 0:
                            return service.toLowerCase().includes(searchString.toLowerCase());
                        case 1:
                            return service.toLowerCase().includes(searchString.toLowerCase());
                        default:
                            break;
                    }
                });
                if (selectedService?.length > 0) {
                    setDisplayData(selectedService);
                    callback && callback('');
                } else {
                    setDisplayData([]);
                    callback && callback('No Items found.');
                }
            } else {
                setDisplayData(serviceName);
            }
        },
        [serviceName, selectedFilerValue],
    );

    return (
        <div className="container px-0">
            <CCard className="custom-card risk-card">
                <CCardHeader className="card-header d-flex align-items-start">{t(props?.type)}</CCardHeader>
                <CCardBody className="card-body-details d-flex flex-column align-items-start">
                    <div className="h-5">{titleText}</div>
                    <div className="font-small"> {subTitleText}</div>
                    <div>
                        {riskData && (
                            <PieChart
                                data={[
                                    {
                                        label: label1Text,
                                        data: riskData?.unused_access,
                                        backgroundColor: '#F8D9AE',
                                    },
                                    {
                                        label: label2Text,
                                        data: riskData?.total_access - riskData?.unused_access,
                                        backgroundColor: '#DF8996',
                                    },
                                ]}
                            />
                        )}
                    </div>
                </CCardBody>
            </CCard>

            {cloudAccountType !== 'GCP' && (
                <CCard className="custom-card risk-card mt-4">
                    <CCardHeader className="card-header d-flex align-items-start">Permissions</CCardHeader>
                    <CCardBody>
                        <div className="d-flex align-items-center my-3">
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
                                                >
                                                    {item.name}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                            <SearchInput customClass="w-50" onSearch={onSearch} placeholder="Search" />
                            {downloadPolicyDocument && (
                                <a
                                    className="btn-custom btn btn-link border me-2"
                                    href={`data:text/json;charset=utf-8,${encodeURIComponent(downloadPolicyDocument)}`}
                                    download="policy.json"
                                >
                                    Rightsize Policy
                                </a>
                            )}
                        </div>
                        <table className="table table-borderless table-hover no-pointer custom-table fixed-layout font-small container mt-4 shadow-6 rounded ">
                            <thead className="border-bottom ">
                                <tr>
                                    <th className="w-30 first-col">Service name</th>
                                    <th className="w-30 text-start">Unused Permissions</th>
                                    <th className="w-30 text-start">Used Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usedUnusedPermissionsLoading ? (
                                    <tr>
                                        <td colSpan={3} className="p-0">
                                            <Skeleton count={3} height={48} />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {!usedUnusedPermissionsError &&
                                            currentTableData &&
                                            usedUnusedPermissions &&
                                            Object.keys(currentTableData)?.map((element: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="w-35 text-truncate first-col px-2">
                                                        {currentTableData[element]}
                                                    </td>
                                                    <td className="text-start">
                                                        {Object.keys(usedUnusedPermissions)?.map((permission: any) =>
                                                            Object.keys(
                                                                usedUnusedPermissions[permission]?.permissions,
                                                            ).map((data: any) =>
                                                                Object.keys(
                                                                    usedUnusedPermissions[permission]?.permissions[
                                                                        data
                                                                    ],
                                                                ).map((value) => {
                                                                    return data == 'unused_permissions'
                                                                        ? value == currentTableData[element]
                                                                            ? usedUnusedPermissions[
                                                                                  permission
                                                                              ]?.permissions[data][value].map(
                                                                                  (item: any, index: number) => (
                                                                                      <span key={index}>
                                                                                          {item} <br />
                                                                                      </span>
                                                                                  ),
                                                                              )
                                                                            : null
                                                                        : null;
                                                                }),
                                                            ),
                                                        )}
                                                        {Object.keys(usedUnusedPermissions).every((permission) => {
                                                            return usedUnusedPermissions[permission]?.permissions
                                                                ?.unused_permissions
                                                                ? Object.keys(
                                                                      usedUnusedPermissions[permission]?.permissions
                                                                          ?.unused_permissions,
                                                                  ).every((value: any) => {
                                                                      return value !== currentTableData[element];
                                                                  })
                                                                : 'N/A';
                                                        })
                                                            ? 'N/A'
                                                            : null}
                                                    </td>
                                                    <td className="text-start">
                                                        {Object.keys(usedUnusedPermissions)?.map((permission: any) =>
                                                            Object.keys(
                                                                usedUnusedPermissions[permission]?.permissions,
                                                            ).map((data: any) =>
                                                                Object.keys(
                                                                    usedUnusedPermissions[permission]?.permissions[
                                                                        data
                                                                    ],
                                                                ).map((value) => {
                                                                    return data == 'used_permissions'
                                                                        ? value == currentTableData[element]
                                                                            ? usedUnusedPermissions[
                                                                                  permission
                                                                              ].permissions[data][value].map(
                                                                                  (item: any, index: number) => (
                                                                                      <span key={index}>
                                                                                          {item} <br />
                                                                                      </span>
                                                                                  ),
                                                                              )
                                                                            : null
                                                                        : null;
                                                                }),
                                                            ),
                                                        )}
                                                        {Object.keys(usedUnusedPermissions).every((permission) => {
                                                            return usedUnusedPermissions[permission]?.permissions
                                                                ?.used_permissions
                                                                ? Object.keys(
                                                                      usedUnusedPermissions[permission]?.permissions
                                                                          ?.used_permissions,
                                                                  ).every((value: any) => {
                                                                      return value !== currentTableData[element];
                                                                  })
                                                                : 'N/A';
                                                        })
                                                            ? 'N/A'
                                                            : null}
                                                    </td>
                                                </tr>
                                            ))}
                                        {usedUnusedPermissionsError == 'No Data' && (
                                            <tr className="text-center">
                                                <td colSpan={5}>{t('no_records_available')} </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            className="pagination-bar justify-content-end"
                            currentPage={currentPage}
                            totalCount={displayData?.length}
                            pageSize={PageSize}
                            siblingCount={1}
                            onPageChange={(page: number) => {
                                setCurrentPage(page);
                            }}
                        />
                    </CCardBody>
                </CCard>
            )}
        </div>
    );
};

export default SingleRisks;

type PieChartProps = {
    data: Array<{ label: string; data: number; backgroundColor: string }>;
};
const PieChart = ({ data }: PieChartProps) => {
    const legendView = () => {
        return (
            <div className="legend">
                {data.map((d: any, i: any) => {
                    return (
                        <React.Fragment key={i}>
                            <div className="legendRow">
                                <div style={{ backgroundColor: d.backgroundColor, width: 10, height: 10 }} />
                                <span className="font-small">{d.label}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };
    return (
        <div className="rowC">
            <div className="legend">
                <CChart
                    type="pie"
                    data={{
                        labels: data.map((d: any) => d.label.replace(/[0-9]/g, '')),
                        datasets: [
                            {
                                data: data.map((d: any) => d.data),
                                backgroundColor: data.map((d: any) => d.backgroundColor),
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                align: 'center',
                                position: 'right',
                                fullSize: false,
                                labels: {
                                    padding: 20,
                                    boxWidth: 10,
                                },
                            },
                        },
                    }}
                />
            </div>

            {legendView()}
        </div>
    );
};
