import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, SCREEN_NAME, ToastVariant } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { Text, Button, Group, Card, Space, Grid, Paper, Collapse } from '@mantine/core';
import { CImage, CTooltip } from '@coreui/react';
import StatusActionPopup from './StatusActionPopup';
import { currentStates, getAllOrgAndRoles, riskWorkFlow } from 'core/services/userManagementAPIService';
import { AppState } from 'store/store';
import { useMutation } from '@tanstack/react-query';
import { setToastMessageAction } from 'store/actions/SingleActions';
import {
    getJiraNotificationsURL,
    getPagerDutyNotificationsURL,
    getSiRiskDetails,
    getSlackNotificationsURL,
} from 'core/services/DataEndpointsAPIService';
import SlackActionsPopup from './SlackActionsPopup';
import JiraActionsPopup from './JiraActionsPopup';
import PagerDutyActionsPopup from './PagerDutyActionsPopup';
import StatusHistoryPopup from './StatusHistoryPopup';
import dayjs from 'dayjs';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { Prism } from '@mantine/prism';
const RiskAnalyticsDetail = () => {
    const params = useParams<any>();
    const dispatch = useDispatch();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType = params?.cloudAccountType;
    const [users, setUsers] = useState<any>([]);
    const [, setDisplayData] = useState<any[]>([]);
    const [showSlackPopup, setShowSlackPopup] = useState<boolean>(false);
    const [showJiraPopup, setShowJiraPopup] = useState<boolean>(false);
    const [showPagerDutyPopup, setShowPagerDutyPopup] = useState<boolean>(false);
    const [showHistoryPopup, setShowHistoryPopup] = useState<boolean>(false);
    const [showActionPopup, setShowActionPopup] = useState<boolean>(false);
    const [singleID, setSingleID] = useState<any>('');
    const [submitPopData, setSubmitPopData] = useState<any[]>([]);
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const [value, setValue] = useState<any>();
    const [cloudAccountName, setCloudAccountName] = useState<any>('');
    const [isLoading, setIsLoading] = useState<number>(0);
    const [opened, setOpened] = useState(false);
    const [resourceName, setResourceName] = useState<any>('Risk detail');
    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            setCloudAccountName(accountName);
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/',
                },
                {
                    name: NAV_TABS_VALUE.RISKS,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/Risks/Overview/',
                },
                {
                    name: resourceName || 'Risk detail',
                    path:
                        CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/Risks/Overview/' + params?.id,
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, '', ''));
    }, [resourceName]);

    useEffect(() => {
        //Active Data
        getAllOrgAndRoles()
            .then((res: any) => {
                const confirm = res
                    .filter((x: any) => x.status_text.includes('CONFIRMED'))
                    .sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
                setUsers(confirm);
            })
            .catch(() => {
                console.log('No User Found');
            });
        getSiRiskDetails(orgId, cloudAccountId, discoveryId, [params?.ruleId], [params?.resourceId])
            .then((response: any) => {
                setDisplayData(response[0]);
                setValue(response[0]);
                setResourceName(response[0]?.resource_name);
                setIsLoading(1);
            })
            .catch((error: any) => {
                setIsLoading(-1);
                console.log('in error', error);
            });
    }, [discoveryId]);
    const body = {
        risk_ids: [value?.risk_unique_id],
    };

    useEffect(() => {
        currStatusDataRefetch();
    }, [body]);
    const {
        data: currStatusData,
        refetch: currStatusDataRefetch,
        isLoading: currStatusDataLoading,
        isError: currStatusDataError,
    } = currentStates(body);
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

    const mutation = useMutation({
        mutationFn: (body: any) => {
            return riskWorkFlow(body);
        },
        onSuccess: () => {
            currStatusDataRefetch();
            setShowActionPopup(false);
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Status added successfully'));
        },
        onError: () => {
            dispatch(setToastMessageAction(ToastVariant.DANGER, 'Something went wrong'));
        },
    });
    const submitStatusAction = (body: any) => {
        // Bulk Riskflow API
        mutation.mutate(body);
    };
    const jiraMsg = `{"summary": " ${jiraActions.riskDetails?.rule_name} : ${jiraActions.riskDetails?.rule_id} : ${selectedcloudAccounts?.account_details?.Account} : ${jiraActions.riskDetails?.resource_type} : ${jiraActions.riskDetails?.resource_name}","description":"${jiraActions.riskDetails?.pattern_description}  \\r\\nPriority:${jiraActions.riskDetails?.priority_label}\\r\\nDiscovery On: ${jiraActions.riskDetails?.si_ingestion_time}","labels": ["${selectedcloudAccounts?.account_details?.Account}","${jiraActions.riskDetails?.resource_type}","${jiraActions.riskDetails?.resource_name}","${jiraActions.riskDetails?.rule_id}"],"key":"${selectedcloudAccounts?.account_details?.Account}::${jiraActions.riskDetails?.resource_type}::${jiraActions.riskDetails?.resource_name}::${jiraActions.riskDetails?.rule_id}"}`;

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
    const statusActionHandler = (data: any, e: any) => {
        e.stopPropagation();
        setSubmitPopData(data);
        setShowActionPopup(true);
    };

    return (
        <>
            <div className=" mt-4" style={{ backgroundColor: '#D5E3F5', minHeight: '100vh', overflow: 'hidden' }}>
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
                    riskDetails={jiraActions?.riskDetails}
                    cloudAccountId={selectedcloudAccounts?.account_details?.Account}
                    handleClose={() => setShowJiraPopup(false)}
                    handleSave={() => {
                        sendJiraNotification();
                    }}
                />

                <PagerDutyActionsPopup
                    show={showPagerDutyPopup}
                    riskDetails={pagerDutyActions?.riskDetails}
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

                <StatusActionPopup
                    submitStatusAction={submitStatusAction}
                    currStatusData={currStatusData}
                    submitPopData={submitPopData}
                    dropdownValues={users}
                    show={showActionPopup}
                    orgId={orgId}
                    handleClose={() => setShowActionPopup(false)}
                />
                <Group m={'lg'} position={'right'}>
                    <Paper
                        radius={'sm'}
                        mt={'sm'}
                        sx={() => ({
                            height: '34px',
                            width: 'auto',
                            border: '1px solid gray',
                            backgroundColor: '#D5E3F5',
                        })}
                    >
                        <CTooltip trigger="hover" placement="bottom" content="Slack">
                            <CImage
                                onClick={(e) => {
                                    SlackNotificationHandler(
                                        value?.rule_id,
                                        value?.rule_name,
                                        value?.resource_name,
                                        value?.priority_label,
                                        value?.resource_type,
                                        value?.risk_data,
                                        value?.pattern_description,
                                        e,
                                    );
                                }}
                                src={require('assets/images/slack.svg')}
                            />
                        </CTooltip>
                    </Paper>
                    <Paper
                        radius={'sm'}
                        mt={'sm'}
                        sx={() => ({
                            height: '34px',
                            width: 'auto',
                            border: '1px solid gray',
                            backgroundColor: '#D5E3F5',
                        })}
                    >
                        <CTooltip trigger="hover" placement="bottom" content="Jira">
                            <CImage
                                onClick={(e) => jiraNotificationHandler(value, e)}
                                src={require('assets/images/jira.svg')}
                            />
                        </CTooltip>
                    </Paper>
                    <Paper
                        mt={'sm'}
                        radius={'sm'}
                        sx={() => ({
                            height: '34px',
                            width: 'auto',
                            border: '1px solid gray',
                            backgroundColor: '#D5E3F5',
                        })}
                    >
                        <CTooltip trigger="hover" placement="bottom" content="PagerDuty">
                            <CImage
                                onClick={(e) => pagerDutyNotificationHandler(value, e)}
                                src={require('assets/images/pagerduty.svg')}
                            />
                        </CTooltip>
                    </Paper>

                    <Paper
                        mt={'sm'}
                        radius={'sm'}
                        sx={() => ({
                            height: '34px',
                            width: 'auto',
                            border: '1px solid gray',
                            backgroundColor: '#D5E3F5',
                        })}
                    >
                        <CTooltip trigger="hover" placement="bottom" content="History">
                            <CImage
                                onClick={(e) => statusHistoryHandler(value, e)}
                                src={require('assets/images/history.svg')}
                            />
                        </CTooltip>
                    </Paper>
                    <Button
                        mt={'sm'}
                        size="md"
                        radius={'md'}
                        data-si-qa-key={`risks-manage-status`}
                        onClick={(e) => statusActionHandler(value, e)}
                    >
                        Manage Status
                    </Button>
                </Group>
                <Grid mx={'lg'}>
                    <Grid.Col span={'auto'}>
                        {' '}
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: '100%' }}>
                            <Card.Section withBorder inheritPadding p={'xl'} mb={'xl'}>
                                <Text size={'xl'} weight={'bolder'}>
                                    General Information
                                </Text>
                            </Card.Section>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Tags</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                {isLoading == 1 &&
                                    JSON.parse(value?.si_tags ?? '[]').map((tagMap: any, i: number) => {
                                        return (
                                            <Button key={i} radius="xl">
                                                {tagMap?.Key} = {tagMap?.Value}
                                            </Button>
                                        );
                                    })}
                                {isLoading == 0 && <Text>loading..</Text>}
                                {isLoading == -1 && <Text>N/A</Text>}
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Resource Type </Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text>
                                    {isLoading == 0 ? 'loading..' : isLoading == 1 ? value?.resource_type : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Resource Name</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text className="text-break">
                                    {isLoading == 0 ? 'loading..' : isLoading == 1 ? value?.resource_name : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Detected At </Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text>
                                    {isLoading == 0
                                        ? 'loading..'
                                        : isLoading == 1
                                        ? dayjs(value?.si_ingestion_time)?.format('DD/MM/YYYY | hh:mm a')
                                        : 'N/A'}
                                </Text>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        {' '}
                        <Card shadow="sm" p="lg" radius="md" withBorder>
                            <Card.Section withBorder inheritPadding p={'xl'} mb={'xl'}>
                                <Text size={'xl'} weight={'bolder'}>
                                    Status Information
                                </Text>
                            </Card.Section>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Status </Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text ta={'left'}>
                                    {currStatusDataLoading
                                        ? 'loading..'
                                        : currStatusData && currStatusData[0]?.current_state
                                        ? currStatusData && currStatusData[0]?.current_state
                                        : currStatusDataError
                                        ? 'N/A'
                                        : currStatusData && currStatusData[0]?.current_state == ''
                                        ? 'N/A'
                                        : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Assigned To</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text ta={'left'}>
                                    {currStatusDataLoading
                                        ? 'loading..'
                                        : currStatusData && currStatusData[0]?.current_state_assignee
                                        ? currStatusData && currStatusData[0]?.current_state_assignee
                                        : currStatusDataError
                                        ? 'N/A'
                                        : currStatusData && currStatusData[0]?.current_state_assignee == ''
                                        ? 'N/A'
                                        : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Link</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text ta={'left'}>
                                    {currStatusDataLoading
                                        ? 'loading..'
                                        : currStatusData && currStatusData[0]?.current_link
                                        ? currStatusData && currStatusData[0]?.current_link
                                        : currStatusDataError
                                        ? 'N/A'
                                        : currStatusData && currStatusData[0]?.current_link == ''
                                        ? 'N/A'
                                        : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Notes</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />

                                <Paper
                                    p={'xl'}
                                    radius={'sm'}
                                    mt={'sm'}
                                    sx={() => ({
                                        height: '130px',
                                        float: 'right',
                                        width: '60%',
                                        backgroundColor: '#E3ECFD',
                                    })}
                                    className="text-wrap"
                                >
                                    {currStatusDataLoading
                                        ? 'loading..'
                                        : currStatusData && currStatusData[0]?.current_notes
                                        ? currStatusData && currStatusData[0]?.current_notes
                                        : currStatusDataError
                                        ? 'N/A'
                                        : currStatusData && currStatusData[0]?.current_notes == ''
                                        ? 'N/A'
                                        : 'N/A'}
                                </Paper>
                            </div>
                        </Card>
                    </Grid.Col>
                </Grid>
                <Grid mx={'lg'} my={'sm'}>
                    <Grid.Col span={6}>
                        {' '}
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: '100%' }}>
                            <Card.Section withBorder inheritPadding p={'xl'} mb={'xl'}>
                                <Text size={'xl'} weight={'bolder'}>
                                    Description
                                </Text>
                            </Card.Section>
                            <Prism p={'md'} language="markdown">
                                {isLoading == 0
                                    ? 'loading..'
                                    : isLoading == 1 && value?.pattern_description
                                    ? value?.pattern_description
                                    : 'N/A'}
                            </Prism>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        {' '}
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: '100%' }}>
                            <Card.Section withBorder inheritPadding p={'xl'} mb={'xl'}>
                                <Text size={'xl'} weight={'bolder'}>
                                    Remediations
                                </Text>
                            </Card.Section>
                            <Prism withLineNumbers p={'md'} language="markdown">
                                {isLoading == 0
                                    ? 'loading..'
                                    : isLoading == 1 && value?.remediation_description
                                    ? value?.remediation_description
                                    : 'N/A'}
                            </Prism>
                        </Card>
                    </Grid.Col>
                </Grid>
                <Grid mx={'xl'} mb="lg">
                    <Grid.Col span={12}>
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: '100%' }}>
                            <Card.Section withBorder inheritPadding p={'xl'} mb={'xl'}>
                                <Text size={'xl'} weight={'bolder'}>
                                    Metadata Information{' '}
                                </Text>
                            </Card.Section>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Rule Id</Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text ta={'left'}>
                                    {isLoading == 0 ? 'loading..' : isLoading == 1 ? value?.rule_id : 'N/A'}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignSelf: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Rule Name </Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <Text ta={'left'}>
                                    {isLoading == 0 ? 'loading..' : isLoading == 1 ? value?.rule_name : 'N/A'}
                                </Text>{' '}
                            </div>{' '}
                            <div style={{ display: 'flex', alignSelf: 'center' }}>
                                <div style={{ width: '15%' }}>
                                    <Text ta={'left'}>Risk Metadata </Text>
                                </div>
                                <Space w="xl" />
                                <IconArrowNarrowRight />
                                <Space w="xl" />
                                <div style={{ float: 'right', width: '70%' }}>
                                    <Button radius="xl" onClick={() => setOpened((o) => !o)}>
                                        JSON Data
                                    </Button>
                                    <Collapse in={opened}>
                                        <Prism sx={{ backgroundColor: '#E3ECFD' }} language="json">
                                            {JSON.stringify(JSON.parse((value && value?.risk_data) || '{}'), null, 2)}
                                        </Prism>
                                    </Collapse>
                                </div>
                            </div>{' '}
                        </Card>
                    </Grid.Col>
                </Grid>
            </div>
        </>
    );
};

export default RiskAnalyticsDetail;
