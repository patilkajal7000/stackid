import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SlackActionsPopup from './SlackActionsPopup';
import {
    getJiraNotificationsURL,
    getSlackNotificationsURL,
    getPagerDutyNotificationsURL,
    getSiRiskDetails,
} from 'core/services/DataEndpointsAPIService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import StatusHistoryPopup from './StatusHistoryPopup';
import StatusActionPopup from './StatusActionPopup';
import {
    bulkRiskWorkFlow,
    currentStates,
    getAllOrgAndRoles,
    riskWorkFlow,
} from 'core/services/userManagementAPIService';
import { useMutation } from '@tanstack/react-query';
import { CImage, CTooltip } from '@coreui/react';
import JiraActionsPopup from './JiraActionsPopup';
import PagerDutyActionsPopup from './PagerDutyActionsPopup';
import { AppState } from 'store/store';
import { IconPlus, IconMinus, IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { Table, createStyles, Button, Pagination } from '@mantine/core';
const useStyles = createStyles(() => ({
    tr: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxSizing: 'border-box',
    },
    tabList: {
        border: 0,
    },
    table: {
        overflow: 'scroll',
        borderCollapse: 'separate',
        borderSpacing: '0 15px',
        '& tbody': {
            '& td:last-child': {
                borderRadius: '0 10px 10px 0',
            },
            '& td:first-child': {
                borderRadius: '10px 0 0 10px',
            },
            '& tr': {
                '& td': {
                    borderTop: 0,
                    backgroundColor: 'white',
                },
            },
        },
        '& thead': {
            '& th:last-child': {
                borderRadius: '0 10px 10px 0',
            },
            '& th:first-child': {
                borderRadius: '10px 0 0 10px',
            },
            '& tr': {
                '& th': {
                    color: '#00264F',
                    borderBottom: 0,
                    backgroundColor: '#AFC5DC',
                },
            },
        },

        '& td:last-child': {
            '& th:last-child': {
                borderRadius: '10px 0 0 10px',
            },
        },
    },
    tableHead: {
        paddingTop: '10px',
        paddingBottom: '10px',
    },
}));

const ActionsTable = (props: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { actionsData, orgId, cloudAccountId, isLoading } = props;
    const [cloudAccountName, setCloudAccountName] = useState<any>('');
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showSlackPopup, setShowSlackPopup] = useState<boolean>(false);
    const [showJiraPopup, setShowJiraPopup] = useState<boolean>(false);
    const [showPagerDutyPopup, setShowPagerDutyPopup] = useState<boolean>(false);
    const [showHistoryPopup, setShowHistoryPopup] = useState<boolean>(false);
    const [showActionPopup, setShowActionPopup] = useState<boolean>(false);

    const [submitPopData, setSubmitPopData] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const [users, setUsers] = useState<any>([]);
    const [singleID, setSingleID] = useState<any>('');
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const [sortOrderName, setSortOrderName] = useState('');
    const PageSize = 15;
    const currentPageNo = 1;
    const [popBulkData, setPopBulkData] = useState<any[]>([]);
    const [, setPopupData] = useState<any[]>([]);
    const [bulkData, setBulkData] = useState<any>(false);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const [render, setRender] = useState<any>(false);
    const [riskIdsUpdated, setRiskIdsUpdated] = useState<{ [key: string]: [string] }>({});

    const [displayData, setDisplayData] = useState<any>();
    const [isBulkPopup, setIsBulkPopup] = useState<boolean>(true);
    useEffect(() => {
        getAllOrg();
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            setCloudAccountName(accountName);
        });
    }, []);

    //slack actions data
    const [slackActions, setSlackActions] = useState<{
        ruleId: string;
        ruleName: string;
        subResource: string;
        priority: string;
        riskType: string;
        riskData: string;
        patternDescription: string;
    }>({
        ruleId: '-',
        ruleName: '-',
        subResource: '-',
        priority: '-',
        riskType: '-',
        riskData: '-',
        patternDescription: '-',
    });

    const [jiraActions, setJiraActions] = useState<{
        riskDetails: any;
    }>({
        riskDetails: '-',
    });

    const [pagerDutyActions, setPagerDutyActions] = useState<{
        riskDetails: any;
    }>({
        riskDetails: '-',
    });

    useEffect(() => {
        setAllData(actionsData);
        if (actionsData && actionsData.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [actionsData]);

    const { classes } = useStyles();
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return allData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, allData]);

    const sorting = () => {
        if (sortOrder === 'ascending') {
            const sortedData: any = [];
            sortedData.push(
                allData.filter((data) => data.priority_label == 'critical'),
                allData.filter((data) => data.priority_label == 'high'),
                allData.filter((data) => data.priority_label == 'medium'),
                allData.filter((data) => data.priority_label == 'low'),
            );
            const allSortedData: any = [];
            sortedData.forEach((element: any) => element.map((data: any) => allSortedData.push(data)));
            setSortOrderName('ascending');
            setAllData(allSortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData: any = [];
            sortedData.push(
                allData.filter((data) => data.priority_label == 'low'),
                allData.filter((data) => data.priority_label == 'medium'),
                allData.filter((data) => data.priority_label == 'high'),
                allData.filter((data) => data.priority_label == 'critical'),
            );
            const allSortedData: any = [];
            sortedData.forEach((element: any) => element.map((data: any) => allSortedData.push(data)));

            setAllData(allSortedData);
            setSortOrderName('descending');
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };
    // For multiple rows, will use this once there's data
    /* const [checkedState, setCheckedState] = useState(
        new Array(5).fill(false)
      ); */

    const SlackNotificationHandler = (
        ruleId: string,
        ruleName: string,
        subResource: string,
        priority: string,
        riskType: string,
        riskData: string,
        patternDescription: string,
        e: any,
    ) => {
        e.stopPropagation();
        setShowSlackPopup(true);
        setSlackActions({
            ruleId: ruleId,
            ruleName: ruleName,
            subResource: subResource,
            priority: priority,
            riskType: riskType,
            riskData: riskData,
            patternDescription: patternDescription,
        });
    };
    const jiraNotificationHandler = (riskDetails: any, e: any) => {
        e.stopPropagation();
        setShowJiraPopup(true);
        setJiraActions({
            riskDetails: riskDetails,
        });
    };

    const pagerDutyNotificationHandler = (riskDetails: any, e: any) => {
        e.stopPropagation();
        setShowPagerDutyPopup(true);
        setPagerDutyActions({
            riskDetails: riskDetails,
        });
    };

    const statusHistoryHandler = (singleHistory: any, e: any) => {
        //history data API
        setSingleID(singleHistory?.risk_unique_id);
        e.stopPropagation();
        setShowHistoryPopup(true);
    };

    const bulkworkflow = (RiskId: any = []) => {
        setIsBulkPopup(true);
        getSiRiskDetails(orgId, cloudAccountId, discoveryId, [RiskId], undefined).then((response: any) => {
            setDisplayData(response);
        });

        setPopBulkData(RiskId);
        setShowActionPopup(true);
        setBulkData(true);
    };
    const bulkmutation = useMutation({
        mutationFn: (body: any) => {
            return bulkRiskWorkFlow(body);
        },
        onSuccess: (body: any) => {
            setRender(!render);
            setShowActionPopup(false);
            setRiskIdsUpdated({ risk_ids: body?.risk_ids });
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Bulk Status added successfully'));
        },
        onError: () => {
            dispatch(setToastMessageAction(ToastVariant.DANGER, 'Something went wrong'));
        },
    });
    const submitBulkStatusAction = (body: any) => {
        // Bulk Riskflow API
        bulkmutation.mutate(body);
    };

    const mutation = useMutation({
        mutationFn: (body: any) => {
            return riskWorkFlow(body);
        },
        onSuccess: (body: any) => {
            setRiskIdsUpdated({ risk_ids: body?.risk_ids });
            setShowActionPopup(false);

            dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Status added successfully'));
        },
        onError: () => {
            dispatch(setToastMessageAction(ToastVariant.DANGER, 'Something went wrong'));
        },
    });

    const submitStatusAction = (body: any) => {
        // Riskflow API
        mutation.mutate(body);
    };

    const statusActionHandler = (tData: any, e: any) => {
        e.stopPropagation();
        setIsBulkPopup(false);
        setSubmitPopData(tData);
        setShowActionPopup(true);
    };
    const jiraMsg = `{"summary": " ${jiraActions.riskDetails?.rule_name} : ${jiraActions.riskDetails?.rule_id} : ${selectedcloudAccounts?.account_details?.Account} : ${jiraActions.riskDetails?.resource_type} : ${jiraActions.riskDetails?.resource_name}","description":"${jiraActions.riskDetails?.pattern_description}\\r\\nPriority:${jiraActions.riskDetails?.priority_label}\\r\\nDiscovery On: ${jiraActions.riskDetails?.si_ingestion_time}","labels": ["${selectedcloudAccounts?.account_details?.Account}","${jiraActions.riskDetails?.resource_type}","${jiraActions.riskDetails?.resource_name}","${jiraActions.riskDetails?.rule_id}"],"key":"${selectedcloudAccounts?.account_details?.Account}::${jiraActions.riskDetails?.resource_type}::${jiraActions.riskDetails?.resource_name}::${jiraActions.riskDetails?.rule_id}"}`;

    const sendJiraNotification = () => {
        const body = {
            channels: ['jira'],
            details: `${jiraMsg}`,
            title: `Risk details for `,
            type: 'BPI Risks',
        };
        getJiraNotificationsURL(orgId, cloudAccountId, body)
            .then((response: any) => {
                setShowJiraPopup(false);
                if (response?.success) {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, response?.message));
                } else {
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.WARNING,
                            'Jira setting is not configured/invalid for this cloud account; please go to the Configuration option to set up Jira settings.',
                        ),
                    );
                }
            })
            .catch((error: any) => {
                dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
                console.log('in error', error.response?.data);
            });
    };

    const pagerdutyMsg = `{"title": " ${pagerDutyActions.riskDetails?.rule_name}","body":"${pagerDutyActions.riskDetails?.pattern_description} : ${pagerDutyActions.riskDetails?.resource_name} \\r\\n ${pagerDutyActions.riskDetails?.rule_id}\\r\\n","key":"${pagerDutyActions.riskDetails?.rule_id}::${selectedcloudAccounts?.account_details?.Account}::${pagerDutyActions.riskDetails?.resource_name}"}`;

    const sendPagerDutyNotification = () => {
        const body = {
            channels: ['pagerduty'],
            details: `${pagerdutyMsg}`,
            title: `Risk details for `,
            type: 'BPI Risks',
        };
        getPagerDutyNotificationsURL(orgId, cloudAccountId, body)
            .then((response: any) => {
                setShowPagerDutyPopup(false);
                if (response?.success) {
                    if (response?.message === 'Incident already exists.') {
                        dispatch(setToastMessageAction(ToastVariant.DANGER, response?.message));
                    } else {
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'PagerDuty Issue Created.'));
                    }
                } else {
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.WARNING,
                            'PagerDuty setting is not configured/invalid for this cloud account; please go to the Configuration option to set up Jira settings.',
                        ),
                    );
                }
            })
            .catch((error: any) => {
                dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
                console.log('in error', error.response?.data);
            });
    };

    const sendSlackNotification = () => {
        const body: any = {
            title: 'Risk details',
            type: 'Risk details',
            details: `Cloud Account Name: ${cloudAccountName}
            \nRule ID: ${slackActions?.ruleId}
            \nRule Name: ${slackActions?.ruleName}
            \nResource Name: ${slackActions?.subResource}
            \nRisk Type: ${slackActions?.riskType}
            \nPriority: ${slackActions?.priority}
            \nRisk Data: ${slackActions?.riskData}
            \nPattern Description: ${slackActions?.patternDescription}
            `,

            // 'This can be directly sen to to _Slack_ via generic API, all *formatting* done via UI itself\nAnother line \n or two...',
            channels: ['slack'],
        };
        getSlackNotificationsURL(orgId, cloudAccountId, body)
            .then((response: any) => {
                setShowSlackPopup(false);
                if (response?.success) {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Slack Notification Successfully Sent.'));
                } else {
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.WARNING,
                            'Slack webhook is not configured/invalid for this cloud account; please go to the Configuration option to set up slack integration.',
                        ),
                    );
                }
            })
            .catch((error: any) => {
                dispatch(setToastMessageAction(ToastVariant.DANGER, error));
                console.log('in error', error);
            });
    };

    const getAllOrg = () => {
        //Active Data
        getAllOrgAndRoles()
            .then((res: any) => {
                const confirm = res
                    .filter((x: any) => x.status_text.includes('CONFIRMED'))
                    .sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
                setUsers(confirm);
                // setAssignUser(confirm.map((user: any) => user.name));
            })
            .catch(() => console.log('No User Found'));
    };

    return (
        <div className="container mt-3 table-responsive">
            {isLoading ? null : (
                <>
                    <SlackActionsPopup
                        show={showSlackPopup}
                        ruleId={slackActions?.ruleId}
                        ruleName={slackActions?.ruleName}
                        subResource={slackActions?.subResource}
                        priority={slackActions?.priority}
                        riskType={slackActions?.riskType}
                        patternDescription={slackActions?.patternDescription}
                        handleClose={() => setShowSlackPopup(false)}
                        handleSave={() => {
                            sendSlackNotification();
                        }}
                    />
                    <JiraActionsPopup
                        show={showJiraPopup}
                        riskDetails={jiraActions.riskDetails}
                        cloudAccountId={selectedcloudAccounts?.account_details?.Account}
                        handleClose={() => setShowJiraPopup(false)}
                        handleSave={() => {
                            sendJiraNotification();
                        }}
                    />

                    <PagerDutyActionsPopup
                        show={showPagerDutyPopup}
                        riskDetails={pagerDutyActions.riskDetails}
                        cloudAccountId={selectedcloudAccounts?.account_details?.Account}
                        handleClose={() => setShowPagerDutyPopup(false)}
                        handleSave={() => {
                            sendPagerDutyNotification();
                        }}
                    />

                    {showHistoryPopup && (
                        <StatusHistoryPopup
                            orgId={orgId}
                            singleID={singleID}
                            show={showHistoryPopup}
                            handleClose={() => {
                                setShowHistoryPopup(false);
                            }}
                        />
                    )}
                    {isBulkPopup ? (
                        <StatusActionPopup
                            bulkData={popBulkData}
                            setBulkData={setPopBulkData}
                            submitBulkStatusAction={submitBulkStatusAction}
                            displayData={displayData}
                            showBulkDataTable={bulkData}
                            dropdownValues={users}
                            show={showActionPopup}
                            orgId={orgId}
                            handleClose={() => {
                                setPopBulkData([]);
                                setPopupData([]);
                                setShowActionPopup(false);
                            }}
                        />
                    ) : (
                        <StatusActionPopup
                            submitStatusAction={submitStatusAction}
                            displayData={allData}
                            submitPopData={submitPopData}
                            dropdownValues={users}
                            show={showActionPopup}
                            orgId={orgId}
                            handleClose={() => {
                                setShowActionPopup(false);
                            }}
                        />
                    )}
                    <Table className={`${classes.table}`} verticalSpacing="lg" horizontalSpacing="xl">
                        <thead className={classes.tableHead}>
                            <tr>
                                <th className=" no-pointer px-3">Risks ({allData.length})</th>
                                <th className=" no-pointer px-3">Resource Name</th>
                                <th className=" no-pointer px-3">Resource Type</th>
                                <th className=" no-pointer px-3">Failed since</th>
                                <th onClick={() => sorting()} className=" no-pointer px-3">
                                    {sortOrderName === 'ascending' ? (
                                        <IconSortAscending className="me-1" />
                                    ) : sortOrderName === 'descending' ? (
                                        <IconSortDescending className="me-1" />
                                    ) : (
                                        <IconArrowsSort className="me-1" />
                                    )}
                                    Severity level
                                </th>
                                <th className=" no-pointer px-3">Status</th>
                                <th className=" no-pointer py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableData?.map((data: any, i: number) => {
                                return (
                                    <Expand
                                        bulkworkflow={bulkworkflow}
                                        data={data}
                                        result={actionsData}
                                        key={i}
                                        orgId={orgId}
                                        riskIdsUpdated={riskIdsUpdated}
                                        SlackNotificationHandler={SlackNotificationHandler}
                                        jiraNotificationHandler={jiraNotificationHandler}
                                        pagerDutyNotificationHandler={pagerDutyNotificationHandler}
                                        statusHistoryHandler={statusHistoryHandler}
                                        statusActionHandler={statusActionHandler}
                                    />
                                );
                            })}

                            {currentTableData.length == 0 && !isLoading && (
                                <tr className="text-center">
                                    <td colSpan={7}>{t('no_records_available')} </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <Pagination
                        className="pagination-bar justify-content-end"
                        page={currentPage}
                        total={Math.ceil(actionsData.length / PageSize)}
                        siblings={1}
                        onChange={(page: number) => {
                            setCurrentPage(page);
                            navigate('?pageNo=' + page);
                        }}
                        pb={'lg'}
                    />
                </>
            )}
        </div>
    );
};

export default ActionsTable;

const Expand = ({
    bulkworkflow,
    data,
    orgId,
    riskIdsUpdated,
    SlackNotificationHandler,
    jiraNotificationHandler,
    pagerDutyNotificationHandler,
    statusHistoryHandler,
    statusActionHandler,
}: any) => {
    const [dataExpand, setDataExpand] = useState(false);
    const [arrow, setArrow] = useState<any>(false);
    const navigate = useNavigate();
    const params = useParams<any>();
    const { classes } = useStyles();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType = params?.cloudAccountType;
    const [riskDetailData, setRiskDetailData] = useState<any>();
    const [body, setBody] = useState<any>();
    const [isCurrentStateDataSet, setIsCurrentStateDataSet] = useState<boolean>();
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    const {
        data: currStatusData,
        isLoading: currStatusLoading,
        isError: currStatusError,
        refetch: currStatusDataRefetch,
    } = currentStates(body);
    useEffect(() => {
        setIsCurrentStateDataSet(false);
        const filteredArray: any = body?.risk_ids.filter(function (n: any) {
            return riskIdsUpdated?.risk_ids?.indexOf(n) !== -1;
        });
        if (filteredArray === undefined || filteredArray?.length === 0) {
            return;
        }

        if (body && body?.risk_ids?.length > 0 && body?.risk_ids) {
            currStatusDataRefetch().then(() => {
                setIsCurrentStateDataSet(true);
            });
        }
    }, [body, riskIdsUpdated]);

    useEffect(() => {
        if (
            setIsCurrentStateDataSet &&
            !currStatusError &&
            !currStatusLoading &&
            currStatusData &&
            currStatusData.length > 0
        ) {
            const temp = riskDetailData.map((unique: any) => {
                let currState = null;
                const currentStateObj = currStatusData?.filter((x: any) => x.risk_id === unique.risk_unique_id);
                if (currentStateObj && currentStateObj.length > 0) {
                    currState = currentStateObj[0];
                }
                return { ...unique, currentState: currState };
            });
            setRiskDetailData(temp);
            setIsCurrentStateDataSet(false);
        }
    }, [isCurrentStateDataSet]);

    const riskApi = (data: any) => {
        getSiRiskDetails(orgId, cloudAccountId, discoveryId, [data?.rule_id], undefined)
            .then((response: any) => {
                setRiskDetailData(response);
                const risk_unique_id: any = [];
                response?.map((ids: any) => {
                    risk_unique_id.push(ids?.risk_unique_id);
                });
                setBody({ risk_ids: risk_unique_id });
            })
            .catch((error: any) => {
                // setIsLoading(-1);
                console.log('in error', error);
            });
    };
    const rowExpand = (data: any) => {
        if (data) {
            riskApi(data);
            setDataExpand(!dataExpand);
            setArrow(!arrow);
        }
    };
    const onActionRow = (rowResourceType: any) => {
        const ruleId: any = rowResourceType.rule_id;

        const resourceId: any = rowResourceType.resource_id;
        navigate(`${CLOUDACCOUNT}/${cloudAccountId}/${cloudAccountType}/Risks/Overview/${ruleId}/${resourceId}`);
    };

    const groupStatus = (e: any, data: any) => {
        e.stopPropagation();
        bulkworkflow(data);
    };

    return (
        <>
            <tr className={classes.tr} onClick={() => rowExpand(data)}>
                <td colSpan={4}>
                    {data.rule_name} ({data.count})
                </td>
                <td className="text-uppercase">{data.priority_label}</td>
                <td onClick={(e) => groupStatus(e, data.rule_id)} role="presentation" style={{ padding: 0 }}>
                    <Button variant="subtle" size="md" data-si-qa-key={`risks-table-manage-status`}>
                        <u>Manage Status</u>
                    </Button>
                </td>
                <td>
                    <div className="" data-si-qa-key={`risks-table-actions`}>
                        {arrow ? <IconMinus /> : <IconPlus />}
                    </div>
                </td>
            </tr>
            {dataExpand
                ? riskDetailData?.map((tData: any, i: number) => {
                      return (
                          <tr onClick={() => onActionRow(tData)} key={i}>
                              <td></td>
                              <td style={{ padding: 0 }}>
                                  <Button variant="subtle" size="md" style={{ height: 'fit-content' }}>
                                      <u className="text-wrap">{tData?.resource_name}</u>
                                  </Button>
                              </td>

                              <td className="text-uppercase">
                                  {tData.resource_type === 'aws_S3' ? 'S3 Bucket' : tData?.resource_type}
                              </td>
                              <td>{dayjs(tData.found_on).format('DD/MM/YYYY | hh:mm')}</td>
                              <td></td>
                              <td onClick={(e) => statusActionHandler(tData, e)} role="presentation">
                                  <Button variant="subtle" size="md" style={{ height: 'fit-content' }}>
                                      <u className="text-wrap">
                                          {' '}
                                          {tData?.currentState?.current_state
                                              ? tData?.currentState?.current_state
                                              : 'Manage Status'}
                                      </u>
                                  </Button>
                              </td>

                              <td valign="middle" align="center" data-si-qa-key={`risks-table-action-items`}>
                                  <div className="d-flex aign-item-center text-center justify-content-around px-2">
                                      <CTooltip trigger="hover" placement="bottom" content="Slack">
                                          <CImage
                                              onClick={(e) => {
                                                  SlackNotificationHandler(
                                                      tData?.rule_id,
                                                      tData?.rule_name,
                                                      tData?.resource_name,
                                                      tData?.priority_label,
                                                      tData?.resource_type,
                                                      tData?.risk_data,
                                                      tData?.pattern_description,
                                                      e,
                                                  );
                                              }}
                                              src={require('assets/images/slack.svg')}
                                          />
                                      </CTooltip>
                                      <CTooltip trigger="hover" placement="bottom" content="Jira">
                                          <CImage
                                              onClick={(e) => jiraNotificationHandler(tData, e)}
                                              src={require('assets/images/jira.svg')}
                                          />
                                      </CTooltip>
                                      <CTooltip trigger="hover" placement="bottom" content="PagerDuty">
                                          <CImage
                                              onClick={(e) => pagerDutyNotificationHandler(tData, e)}
                                              src={require('assets/images/pagerduty.svg')}
                                          />
                                      </CTooltip>

                                      <CTooltip trigger="hover" placement="bottom" content="History">
                                          <CImage
                                              onClick={(e) => statusHistoryHandler(tData, e)}
                                              src={require('assets/images/history.svg')}
                                          />
                                      </CTooltip>
                                  </div>
                              </td>
                          </tr>
                      );
                  })
                : null}
        </>
    );
};
