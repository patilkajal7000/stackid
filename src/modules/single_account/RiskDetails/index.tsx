import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store/store';
import { NAV_TABS_VALUE, SCREEN_NAME, ToastVariant } from 'shared/utils/Constants';
import { BPIModel } from 'shared/models/BPIModel';
import { useTranslation } from 'react-i18next';
import RiskCard from '../data_endpoints/single_data_element/aws_s3_bucket/components/risk_card/RiskCard';
import { RiskCardModel } from 'shared/models/RiskModel';
import { setSelectedRiskAction } from 'store/actions/RiskActions';
import { setGraphDataAction } from 'store/actions/GraphActions';
import { getBpiScoreSeverity } from 'shared/service/Severity.service';
import { jsPDF } from 'jspdf';
import './index.css';
import {
    getSlackNotificationsURL,
    getRiskDetails,
    getJiraNotificationsURL,
    getPagerDutyNotificationsURL,
    dismissAllRisks,
    getAllDissmisedRisks,
} from 'core/services/DataEndpointsAPIService';
import SlackPopup from './component/slackPopup';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CImage, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilChevronBottom,
    cilChevronRight,
    cilList,
    cilLockLocked,
    cilNotes,
    cilPencil,
    cilTag,
    cilUser,
} from '@coreui/icons';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { translate } from 'translation/translateService';
import JiraPopup from './component/jiraPopup';
import PagerDutyPopup from './component/pagerDutyPopup';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
interface Props {
    risk: any;
}

type BPISeverity = {
    bpiPercentage: number;
    severity: string;
    severityColor?: string;
};

function Index(props: Props) {
    const pdfRef = useRef(null);
    const navigate = useNavigate();
    const riskState = useSelector((state: AppState) => state.riskState);
    const [riskByTagList, setRiskByTagList] = useState<any>([]);
    const dispatch = useDispatch();
    const [bpiSeverity, setBPISeverity] = useState<BPISeverity>();
    const [highBpi, setHighBpi] = useState(3);
    const [criticalBpiList, setCriticalBpiList] = useState<any>([]);
    const [selectedBPIRisk, setSelectedBPIRisk] = useState<any>([]);
    const [highBpiList, setHighBpiList] = useState<any>([]);
    const [mediumBpiList, setMediumBpiList] = useState<any>([]);
    const [lowBpiList, setLowBpiList] = useState<any>([]);
    const [dataRisk, setDataRisk] = useState<any>([]);
    const [dataIAM, setDataIAM] = useState<any>([]);
    const [arrow, setArrow] = useState<any>(true);
    const [showPopup, setShowPopup] = useState<any>(false);
    const [jiraShowPopup, setJiraShowPopup] = useState<any>(false);
    const [pagerdutyShowPopup, setPagerdutyShowPopup] = useState<any>(false);
    const [loading, setLoading] = useState<any>(true);
    const [arrowCritical, setArrowCritical] = useState<any>(true);
    const [arrowHigh, setArrowHigh] = useState<any>(false);
    const [arrowMedium, setArrowMedium] = useState<any>(false);
    const [arrowLow, setArrowLow] = useState<any>(false);
    const [showCard, setShowCard] = useState<any>(true);
    const [hidePDF, setHidePDF] = useState<any>(true);
    const [CloudAccountName, setCloudAccountName] = useState<any>('');
    const [defaultActive, setDefaultActive] = useState<string>('0');
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const bpiState = useSelector((state: AppState) => state.bpiState);
    const [filter, setFilter] = useState<any>('All');
    const bpiDetailsState: BPIModel = bpiState.bpiDetails;
    const { t } = useTranslation();
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type;
    const rid = params?.rid;
    const resourceId = params?.rid || '';
    const [isClicked, setIsClicked] = useState<any>(false);
    const [policyDetailData, setPolicyDetailData] = useState(false);
    const [policyDetail, setPolicyDetail] = useState<any>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState(false);
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            setCloudAccountName(accountName);
        });
    }, []);

    const { data: dismissedRisks, refetch: refetchgetAllDismissedRisks } = getAllDissmisedRisks(orgId, cloudAccountId);
    useEffect(() => {
        refetchgetAllDismissedRisks();
    }, []);

    useEffect(() => {
        const NormalList = props.risk.filter((item: any) => item?.priority_label !== 'Critical');
        setRiskByTagList(NormalList);
        props.risk.map((item: any) => (item?.risk_dimension === 'IAM' ? dataIAM.push(item) : dataRisk.push(item)));

        setDataRisk(dataRisk);
        setDataIAM(dataIAM);

        dispatch(
            setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT, NAV_TABS_VALUE.RISK_DETAILS, NAV_TABS_VALUE.DATA_ENDPOINTS),
        );
        navigate(
            CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type +
                '/' +
                rid +
                '/' +
                NAV_TABS_VALUE.RISK_DETAILS,
        );
        getRiskDetails(cloudAccountId, resourceId)
            .then((response: any) => {
                const values = Object.values(response);
                setPolicyDetail(values);
            })
            .catch((error: any) => {
                setIsError(true);
                dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
                console.log('in error', error.response?.data);
            });

        //TODO Route v6
        //  navigate(NAV_TABS_VALUE.RISK_DETAILS);
    }, []);

    const ShowRiskCard = () => {
        setHighBpi(highBpi + criticalBpiList?.length);
        !showCard ? setHighBpi(3) : setHighBpi(highBpi + criticalBpiList?.length);
        setShowCard(!showCard);
    };

    useEffect(() => {
        if (bpiState && bpiState.bpiDetails) {
            const bpiPercentage = bpiDetailsState?.bpi | 0;
            const severity = getBpiScoreSeverity(bpiPercentage);
            setBPISeverity({ bpiPercentage, severity });
        }
    }, [bpiState.bpiDetails]);

    const SlackNotificationHandler = () => {
        setShowPopup(true);
    };

    const JiraNotificationHandler = () => {
        setJiraShowPopup(true);
    };

    const PagerDutyNotificationHandler = () => {
        setPagerdutyShowPopup(true);
    };

    const criticalBpiMsg = `\n*Critical Risk Count:* (${props?.risk?.length})
    ${criticalBpiList?.map((item: any) => {
        return ` 
                \n*Risk Type:* ${item?.risk_dimension}
                \n*Risk Name:* ${item?.rule_name}
                \n*Risk Detail:* ${item?.risk_occurence_reason}
                   `;
    })}`;

    const highBpiMsg = `\n*High Risk Count:* (${highBpiList?.length}) 
    ${highBpiList?.map((item: any) => {
        return ` 
                \n*Risk Type:* ${item?.risk_dimension}
                \n*Risk Name:* ${item?.rule_name}
                \n*Risk Detail:* ${item?.risk_occurence_reason}
                   `;
    })}`;

    const mediumBpi = `\n*Medium Risk Count:* (${mediumBpiList.length}) 
    ${mediumBpiList?.map((item: any) => {
        return ` 
                \n*Risk Type:* ${item?.risk_dimension}
                \n*Risk Name:* ${item?.rule_name}
                \n*Risk Detail:* ${item?.risk_occurence_reason}
                   `;
    })}`;

    const lowBpiMsg = `\n*Low Risk Count:* (${lowBpiList.length})
    ${lowBpiList?.map((item: any) => {
        return ` 
                \n*Risk Type:* ${item?.risk_dimension}
                \n*Risk Name:* ${item?.rule_name}
                \n*Risk Detail:* ${item?.risk_occurence_reason}
                   `;
    })}`;

    const criticalRisks = `${criticalBpiList?.map((item: any) => {
        return `\\n\\n Risk Type: ${item?.risk_dimension} \\n Risk Name: ${item?.rule_name} \\n Risk Detail: ${
            item?.risk_occurence_reason
        }\\n Discovery On: ${dayjs(item?.found_on).format('DD MMM YY | h:mm:ss a')}`;
    })}`;

    const highRisks = `${highBpiList?.map((item: any) => {
        return `\\n\\n Risk Type: ${item?.risk_dimension} \\n Risk Name: ${item?.rule_name} \\n Risk Detail: ${
            item?.risk_occurence_reason
        } \\n Discovery On: ${dayjs(item?.found_on).format('DD MMM YY | h:mm:ss a')}`;
    })}`;

    const mediumRisks = `${mediumBpiList?.map((item: any) => {
        return `\\n\\n Risk Type: ${item?.risk_dimension} \\n Risk Name: ${item?.rule_name} \\n Risk Detail: ${
            item?.risk_occurence_reason
        } \\n Discovery On: ${dayjs(item?.found_on).format('DD MMM YY | h:mm:ss a')}`;
    })}`;

    const lowRisks = `${lowBpiList?.map((item: any) => {
        return `\\n\\n Risk Type: ${item?.risk_dimension} \\n Risk Name: ${item?.rule_name} \\n Risk Detail: ${
            item?.risk_occurence_reason
        } \\n Discovery On: ${dayjs(item?.found_on).format('DD MMM YY | h:mm:ss a')}`;
    })}`;

    const riskOccurence = `\\n\\n*Critical Risks:*(${criticalBpiList?.length}) ${criticalRisks} \\n\\n*High Risks:*(${highBpiList?.length}) ${highRisks} \\n\\n*Medium Risks:*(${mediumBpiList.length}) ${mediumRisks} \\n\\n*Low Risks:*(${lowBpiList.length}) ${lowRisks}`;

    const keysRuleId: any = [];
    const keysSubResource: any = [];
    const subResourceName: any = [];
    const found_on1 = dayjs(props?.risk[0]?.found_on).format('DD MMM YY | h:mm:ss a');
    const bucket_title = JSON.stringify(props?.risk[0]?.accessPath)?.split('_')[0].replace('"', '');

    props.risk?.map((risk: any) => {
        keysRuleId.push(`${risk.rule_id}`);
        keysRuleId.sort();
        keysSubResource.push(`${risk.sub_resource}`);
        keysSubResource.sort();
        subResourceName.push(`${risk?.sub_resource_name}`);
    });

    const bpiJiraMsg = `{"summary": "Risk details for bucket: ${bucket_title}", "description":" *AWS Account:* ${selectedcloudAccounts?.account_details?.Account} \\n *Discovery On:* ${found_on1} \\n\\n ${selectedBPIRisk?.pattern_description} \\n ${riskOccurence}","labels": ["StackIdentity"],"key":"${keysRuleId}::${keysSubResource}"}`;

    const sendJiraNotification = () => {
        const body = {
            channels: ['jira'],
            details: `${bpiJiraMsg}`,
            title: `Risk details for ${selectedBPIRisk?.sub_resource}`,
            type: 'BPI Risks',
        };
        getJiraNotificationsURL(orgId, cloudAccountId, body)
            .then((response: any) => {
                setJiraShowPopup(false);
                if (response?.success) {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, response?.message));
                } else {
                    setJiraShowPopup(false);
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

    const pagerdutyMsg = `{"title" : "Risk Details for : ${bucket_title} ", "body" : "AWS Account: ${selectedcloudAccounts?.account_details?.Account} \\r\\nDiscovery On : ${found_on1} \\r\\n ${selectedBPIRisk?.pattern_description} \\r\\nAll Risks Details : \\r ${riskOccurence}" ,"key":"${keysRuleId}::${keysSubResource}"}`;
    const sendPagerdutyNotification = () => {
        const body = {
            channels: ['pagerduty'],
            details: `${pagerdutyMsg}`,
            title: `Risk details for ${selectedBPIRisk?.sub_resource}`,
            type: 'BPI Risks',
        };
        getPagerDutyNotificationsURL(orgId, cloudAccountId, body)
            .then((response: any) => {
                setPagerdutyShowPopup(false);
                if (response?.success) {
                    if (response?.message === 'Incident already exists.') {
                        dispatch(setToastMessageAction(ToastVariant.DANGER, response?.message));
                    } else dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'PagerDuty Issue Created.'));
                } else {
                    setPagerdutyShowPopup(false);
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
        let body1: any;
        let body2: any;
        const msglength = ` *Cloud Account Name:* ${CloudAccountName}            
                ${criticalBpiMsg}
                ${highBpiMsg}
                ${mediumBpi}
                ${lowBpiMsg}
       `;

        if (msglength.length < 2900) {
            body1 = {
                title: `Risk details for ${criticalBpiList[0]?.sub_resource}`,
                type: 'BPI Risks',
                details: ` *Cloud Account Name:* ${CloudAccountName}          
                ${criticalBpiMsg}            
                ${highBpiMsg}             
                ${mediumBpi}             
                ${lowBpiMsg}`,

                channels: ['slack'],
            };
        } else {
            body1 = {
                title: `Risk details for ${criticalBpiList[0]?.sub_resource}`,
                type: 'BPI Risks',
                details: ` *Cloud Account Name:* ${CloudAccountName}
                ${criticalBpiMsg}            
                ${highBpiMsg}`,
                // 'This can be directly sen to to _Slack_ via generic API, all *formatting* done via UI itself\nAnother line \n or two...',
                channels: ['slack'],
            };
            body2 = {
                title: `Risk details for ${criticalBpiList[0]?.sub_resource}`,
                type: 'BPI Risks',
                details: ` *Cloud Account Name:* ${CloudAccountName}
                ${mediumBpi}             
                ${lowBpiMsg} `,
                // 'This can be directly sen to to _Slack_ via generic API, all *formatting* done via UI itself\nAnother line \n or two...',
                channels: ['slack'],
            };
        }

        getSlackNotificationsURL(orgId, cloudAccountId, body1)
            .then((response: any) => {
                setShowPopup(false);
                if (response?.success) {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Slack Notification Successfully Sent.'));
                } else {
                    setShowPopup(false);
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.WARNING,
                            'Slack webhook is not configured/invalid for this cloud account; please go to the Configuration option to set up slack integration.',
                        ),
                    );
                }
            })
            .catch((error: any) => {
                dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
                console.log('in error', error.response?.data);
            });
        if (body2) {
            getSlackNotificationsURL(orgId, cloudAccountId, body2)
                .then((response: any) => {
                    setShowPopup(false);
                    if (response?.success) {
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Slack Notification Successfully Sent.'));
                    } else {
                        setShowPopup(false);
                        dispatch(
                            setToastMessageAction(
                                ToastVariant.WARNING,
                                'Slack webhook is not configured/invalid for this cloud account; please go to the Configuration option to set up slack integration.',
                            ),
                        );
                    }
                })
                .catch((error: any) => {
                    dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
                    console.log('in error', error.response?.data);
                });
        }
    };
    const ClickCard = (risk: any) => {
        setSelectedBPIRisk(risk);
        dispatch(setSelectedRiskAction(risk));
        navigate(
            CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type +
                '/' +
                rid +
                '/' +
                NAV_TABS_VALUE.RISK_DETAILS,
        );
    };

    //dismiss all risks
    const mutationRisks = useMutation({
        mutationFn: ({ orgId, cloudAccountId, resourceId, body }: any) => {
            return dismissAllRisks(orgId, cloudAccountId, resourceId, body);
        },
        onSuccess: (res: any) => {
            refetchgetAllDismissedRisks();
            if (res === 'Resource excluded from BPI calculation')
                dispatch(
                    setToastMessageAction(
                        ToastVariant.SUCCESS,
                        'All Risks Dismissed Successfully, Resource excluded from BPI calculation.',
                    ),
                );
            else
                dispatch(
                    setToastMessageAction(
                        ToastVariant.SUCCESS,
                        'All Risks Enabled Successfully, Resource included to BPI calculation.',
                    ),
                );
        },
        onError: (error: any) => {
            dispatch(setToastMessageAction(ToastVariant.DANGER, error?.response?.data));
            console.log('in error', error.response?.data);
        },
    });

    const DismissAllRisks = (excludeBpi: boolean) => {
        const body = {
            resource_type: params.type,
            exclude_bpi: excludeBpi,
        };
        mutationRisks.mutate({ orgId, cloudAccountId, resourceId, body });
    };

    useEffect(() => {
        let Risks = props.risk;
        if (filter === 'Data') {
            Risks = dataRisk;
        }
        if (filter === 'IAM') {
            Risks = dataIAM;
        }
        const CriticalList = Risks.filter((item: any) => item?.priority_label === 'Critical');
        const HighList = Risks.filter((item: any) => item?.priority_label === 'High');
        const MediumList = Risks.filter((item: any) => item?.priority_label === 'Medium');
        const LowList = Risks.filter((item: any) => item?.priority_label === 'Low');
        setCriticalBpiList(CriticalList);
        setHighBpiList(HighList);
        setMediumBpiList(MediumList);
        setLowBpiList(LowList);
        const type = riskState?.selectedRisk?.priority_label;
        if (!type) setSelectedBPIRisk(Risks[0]);
        else setSelectedBPIRisk(riskState?.selectedRisk);
        if (type) {
            if (type == 'Critical') {
                setDefaultActive('0');
                setArrowCritical(true);
                setArrowHigh(false);
                setArrowMedium(false);
                setArrowLow(false);
                setLoading(false);
            } else if (type == 'High') {
                setDefaultActive('1');
                setArrowCritical(false);
                setArrowHigh(true);
                setArrowMedium(false);
                setArrowLow(false);
                setLoading(false);
            } else if (type == 'Medium') {
                setDefaultActive('2');
                setArrowCritical(false);
                setArrowHigh(false);
                setArrowMedium(true);
                setArrowLow(false);
                setLoading(false);
            } else {
                setDefaultActive('3');
                setArrowCritical(false);
                setArrowHigh(false);
                setArrowMedium(false);
                setArrowLow(true);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [defaultActive, filter]);
    // download PDF
    const handleOnPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        setHidePDF(false);
        const content: any = pdfRef.current;
        doc.setTextColor('#3c4b64');

        doc.html(content, {
            x: 0,
            y: 0,
            autoPaging: 'text',
            margin: [10, 20, 10, 20],
            callback: (doc: any) => {
                doc.save('RiskDetailList.pdf');
                setHidePDF(true);
            },
        });
    };

    const naviagateToIdentityScreen = (identityId: string) => {
        navigate(
            '/accounts/' +
                cloudAccountId +
                '/AWS/identities/aws_IAMRole/' +
                identityId +
                '/' +
                NAV_TABS_VALUE.IDENTITY_MAP,
        );
    };

    return (
        <div className="">
            <SlackPopup
                show={showPopup}
                handleSave={() => sendSlackNotification()}
                handleClose={() => setShowPopup(false)}
                riskDetails={criticalBpiList}
                cloudAccountName={CloudAccountName}
                cloudAccountId={cloudAccountId}
            />
            <JiraPopup
                show={jiraShowPopup}
                handleSave={() => sendJiraNotification()}
                handleClose={() => setJiraShowPopup(false)}
                riskDetails={selectedBPIRisk}
                cloudAccountId={selectedcloudAccounts?.account_details?.Account}
            />
            <PagerDutyPopup
                show={pagerdutyShowPopup}
                handleSave={() => sendPagerdutyNotification()}
                handleClose={() => setPagerdutyShowPopup(false)}
                riskDetails={selectedBPIRisk}
                cloudAccountId={selectedcloudAccounts?.account_details?.Account}
            />
            <div className="container-fluid mx-0 header-background my-3 py-2">
                <div className="container d-flex justify-content-between h6 p-0 my-0">
                    <div className="d-flex flex-row display-6">
                        <button
                            onClick={() => setFilter('All')}
                            type="button"
                            className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center no-pointer`}
                        >
                            All Risks (
                            {dismissedRisks?.resources?.includes(rid) ? 0 : props.risk.length ? props.risk.length : 0})
                        </button>
                        <CTooltip trigger="hover" placement="top" content="Risks pertaining to Data Assets">
                            <button
                                onClick={() => setFilter('Data')}
                                type="button"
                                className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center no-pointer`}
                            >
                                Data Risks (
                                {dismissedRisks?.resources?.includes(rid) ? 0 : dataRisk.length ? dataRisk.length : 0})
                            </button>
                        </CTooltip>
                        <CTooltip trigger="hover" placement="top" content="Risks pertaining to Identities">
                            <button
                                onClick={() => setFilter('IAM')}
                                type="button"
                                className={`btn btn-custom btn-filter justify-content-center m-0 me-2 align-items-center no-pointer`}
                            >
                                IAM Risks (
                                {dismissedRisks?.resources?.includes(rid) ? 0 : dataIAM.length ? dataIAM.length : 0})
                            </button>
                        </CTooltip>
                    </div>

                    <div className="d-flex flex-row px-0">
                        {!dismissedRisks?.resources?.includes(rid) && (
                            <>
                                <div className="pointer mx-3" title="Export PDF">
                                    <label className="fw-bold">{t('export')} </label>
                                    <button
                                        onClick={() => {
                                            dismissedRisks?.resources?.includes(rid)
                                                ? dispatch(
                                                      setToastMessageAction(ToastVariant.DANGER, 'No Risk Data Found.'),
                                                  )
                                                : handleOnPDF();
                                        }}
                                        type="button"
                                        className="btn-custom btn btn-link border ms-2"
                                    >
                                        PDF
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <CTooltip trigger="hover" placement="bottom" content="Slack">
                                        <CImage
                                            className="pointer"
                                            onClick={() => {
                                                dismissedRisks?.resources?.includes(rid)
                                                    ? dispatch(
                                                          setToastMessageAction(
                                                              ToastVariant.DANGER,
                                                              'No Risk Data Found.',
                                                          ),
                                                      )
                                                    : SlackNotificationHandler();
                                            }}
                                            src={require('assets/images/slack.svg')}
                                        />
                                    </CTooltip>
                                </div>
                                <div className="mt-1 mx-1">
                                    <CTooltip trigger="hover" placement="bottom" content="Jira">
                                        <CImage
                                            className="pointer"
                                            onClick={() => {
                                                dismissedRisks?.resources?.includes(rid)
                                                    ? dispatch(
                                                          setToastMessageAction(
                                                              ToastVariant.DANGER,
                                                              'No Risk Data Found.',
                                                          ),
                                                      )
                                                    : JiraNotificationHandler();
                                            }}
                                            src={require('assets/images/jira.svg')}
                                        />
                                    </CTooltip>
                                </div>
                                <div className="mt-2 mx-1">
                                    <CTooltip trigger="hover" placement="bottom" content="PagerDuty">
                                        <CImage
                                            className="pointer"
                                            onClick={() => {
                                                dismissedRisks?.resources?.includes(rid)
                                                    ? dispatch(
                                                          setToastMessageAction(
                                                              ToastVariant.DANGER,
                                                              'No Risk Data Found.',
                                                          ),
                                                      )
                                                    : PagerDutyNotificationHandler();
                                            }}
                                            src={require('assets/images/pagerduty.svg')}
                                        />
                                    </CTooltip>
                                </div>
                            </>
                        )}
                        {!dismissedRisks?.resources?.includes(rid) ? (
                            <CTooltip trigger="hover" placement="bottom" content={t('dismiss_all_risks')}>
                                <button
                                    type="button"
                                    className="btn btn-custom-link ms-4 position-relative text-white"
                                    onClick={() => DismissAllRisks(true)}
                                >
                                    {t('dismiss_all_risks')}
                                </button>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" placement="bottom" content={t('enable_all_risks')}>
                                <button
                                    type="button"
                                    className="btn btn-custom-link ms-4 position-relative text-white"
                                    onClick={() => DismissAllRisks(false)}
                                >
                                    {t('enable_all_risks')}
                                </button>
                            </CTooltip>
                        )}
                    </div>
                </div>
            </div>
            {loading ? (
                <>Loading</>
            ) : (
                <div className="d-flex container p-0 pe-2">
                    <div className="col-md-5 col-lg-4 p-0 me-2 ">
                        <div className="my-3 mx-0 row mb-2 d-flex justify-content-between left-side-bar">
                            {props.risk.length == 0 || dismissedRisks?.resources?.includes(rid) ? (
                                <div> {t('no_risk_found')}</div>
                            ) : (
                                <>
                                    <div className="p-0">
                                        <CAccordion activeItemKey={1}>
                                            <CAccordionItem itemKey={1}>
                                                <CAccordionHeader
                                                    className="border-0 master-btn accordion-toggle"
                                                    onClick={() => setArrow(!arrow)}
                                                >
                                                    <span className="my-3" style={{ color: '#000000' }}>
                                                        {arrow ? (
                                                            <CIcon icon={cilChevronBottom} />
                                                        ) : (
                                                            <CIcon icon={cilChevronRight} />
                                                        )}
                                                        <b className=" ms-2 h5">
                                                            Breach Prediction Index (BPI): {bpiSeverity?.bpiPercentage}%
                                                        </b>
                                                    </span>
                                                </CAccordionHeader>
                                                <CAccordionBody className="p-0">
                                                    <CAccordion activeItemKey={1}>
                                                        <CAccordionItem itemKey={1}>
                                                            <CAccordionHeader
                                                                className="p-0 d-block w-100 text-start"
                                                                onClick={() => {
                                                                    setArrowCritical(!arrowCritical);
                                                                    setArrowHigh(false);
                                                                    setArrowMedium(false);
                                                                    setArrowLow(false);
                                                                }}
                                                            >
                                                                <span className="my-3" style={{ color: '#c34a5d' }}>
                                                                    {arrowCritical ? (
                                                                        <CIcon icon={cilChevronBottom} />
                                                                    ) : (
                                                                        <CIcon icon={cilChevronRight} />
                                                                    )}
                                                                    <b className=" h5 ms-2">Critical Risks</b>
                                                                </span>
                                                            </CAccordionHeader>
                                                            <CAccordionBody className="pb-1">
                                                                {criticalBpiList.length == 0 ||
                                                                    (dismissedRisks?.resources?.includes(rid) && (
                                                                        <span className="font-small-semibold">
                                                                            No Risks Found
                                                                        </span>
                                                                    ))}
                                                                {criticalBpiList
                                                                    .slice(0, highBpi)
                                                                    .map((risk: RiskCardModel, index: number) => (
                                                                        <React.Fragment key={index}>
                                                                            <div style={{ width: 'auto' }}>
                                                                                <RiskCard
                                                                                    risk={risk}
                                                                                    onCardClick={() => {
                                                                                        ClickCard(risk);
                                                                                        setIsClicked(true);
                                                                                        setPolicyDetailData(false);
                                                                                    }}
                                                                                    // color={highBpiList?.priority_label}
                                                                                    className={`mb-3 ${
                                                                                        riskState?.selectedRisk
                                                                                            ? riskState?.selectedRisk
                                                                                                  ?.rule_id ==
                                                                                              risk.rule_id
                                                                                                ? 'selected'
                                                                                                : ''
                                                                                            : criticalBpiList[0]
                                                                                                  ?.rule_id ==
                                                                                              risk.rule_id
                                                                                            ? 'selected'
                                                                                            : ''
                                                                                    }`}
                                                                                    aria-hidden="true"
                                                                                ></RiskCard>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    ))}
                                                                {criticalBpiList?.length >= 3 ? (
                                                                    <span
                                                                        role="presentation"
                                                                        className="pointer font-small-semibold"
                                                                        onClick={ShowRiskCard}
                                                                    >
                                                                        {showCard ? 'Show More' : 'Show Less'}
                                                                    </span>
                                                                ) : null}
                                                            </CAccordionBody>
                                                        </CAccordionItem>

                                                        <CAccordionItem itemKey={2}>
                                                            <CAccordionHeader
                                                                className="p-0 d-block w-100 text-start"
                                                                onClick={() => {
                                                                    setArrowHigh(!arrowHigh);
                                                                    setArrowCritical(false);
                                                                    setArrowMedium(false);
                                                                    setArrowLow(false);
                                                                }}
                                                            >
                                                                <span className="my-3" style={{ color: '#ff9251' }}>
                                                                    {arrowHigh ? (
                                                                        <CIcon icon={cilChevronBottom} />
                                                                    ) : (
                                                                        <CIcon icon={cilChevronRight} />
                                                                    )}
                                                                    <b className="h5 ms-2">High Risks</b>
                                                                </span>
                                                            </CAccordionHeader>
                                                            <CAccordionBody className="pb-1">
                                                                {highBpiList.length == 0 ||
                                                                    (dismissedRisks?.resources?.includes(rid) && (
                                                                        <span className="font-small-semibold">
                                                                            No Risks Found
                                                                        </span>
                                                                    ))}
                                                                {highBpiList.map(
                                                                    (risk: RiskCardModel, index: number) => (
                                                                        <React.Fragment key={index}>
                                                                            <div style={{ width: 'auto' }}>
                                                                                <RiskCard
                                                                                    risk={risk}
                                                                                    onCardClick={() => {
                                                                                        ClickCard(risk);
                                                                                        setIsClicked(true);
                                                                                        setPolicyDetailData(false);
                                                                                    }}
                                                                                    className={`mb-3 ${
                                                                                        riskState?.selectedRisk
                                                                                            ?.rule_id == risk.rule_id
                                                                                            ? 'selected'
                                                                                            : ''
                                                                                    }`}
                                                                                ></RiskCard>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    ),
                                                                )}
                                                            </CAccordionBody>
                                                        </CAccordionItem>

                                                        <CAccordionItem itemKey={3}>
                                                            <CAccordionHeader
                                                                className="p-0 d-block w-100 text-start"
                                                                onClick={() => {
                                                                    setArrowMedium(!arrowMedium);
                                                                    setArrowHigh(false);
                                                                    setArrowCritical(false);
                                                                    setArrowLow(false);
                                                                }}
                                                            >
                                                                <span className="my-3" style={{ color: '#f2be42' }}>
                                                                    {arrowMedium ? (
                                                                        <CIcon icon={cilChevronBottom} />
                                                                    ) : (
                                                                        <CIcon icon={cilChevronRight} />
                                                                    )}
                                                                    <b className="h5 ms-2">Medium Risks</b>
                                                                </span>
                                                            </CAccordionHeader>
                                                            <CAccordionBody className="pb-1">
                                                                {mediumBpiList.length == 0 ||
                                                                    (dismissedRisks?.resources?.includes(rid) && (
                                                                        <span className="font-small-semibold">
                                                                            No Risks Found
                                                                        </span>
                                                                    ))}
                                                                {mediumBpiList.map(
                                                                    (risk: RiskCardModel, index: number) => (
                                                                        <React.Fragment key={index}>
                                                                            <div style={{ width: 'auto' }}>
                                                                                <RiskCard
                                                                                    risk={risk}
                                                                                    onCardClick={() => {
                                                                                        ClickCard(risk),
                                                                                            setIsClicked(true),
                                                                                            setPolicyDetailData(false);
                                                                                    }}
                                                                                    // color={highBpiList?.priority_label}
                                                                                    className={`mb-3 ${
                                                                                        riskState?.selectedRisk
                                                                                            ?.rule_id == risk.rule_id
                                                                                            ? 'selected'
                                                                                            : ''
                                                                                    }`}
                                                                                ></RiskCard>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    ),
                                                                )}
                                                            </CAccordionBody>
                                                        </CAccordionItem>

                                                        <CAccordionItem itemKey={4}>
                                                            <CAccordionHeader
                                                                className="p-0 d-block w-100 text-start"
                                                                onClick={() => {
                                                                    setArrowLow(!arrowLow);
                                                                    setArrowMedium(false);
                                                                    setArrowHigh(false);
                                                                    setArrowCritical(false);
                                                                }}
                                                            >
                                                                <span className="my-3" style={{ color: '#089b71' }}>
                                                                    {arrowLow ? (
                                                                        <CIcon icon={cilChevronBottom} />
                                                                    ) : (
                                                                        <CIcon icon={cilChevronRight} />
                                                                    )}
                                                                    <b className="h5 ms-2">Low Risks</b>
                                                                </span>
                                                            </CAccordionHeader>
                                                            <CAccordionBody className="pb-1">
                                                                {lowBpiList.length == 0 ||
                                                                    (dismissedRisks?.resources?.includes(rid) && (
                                                                        <span className="font-small-semibold">
                                                                            No Risks Found
                                                                        </span>
                                                                    ))}
                                                                {lowBpiList.map(
                                                                    (risk: RiskCardModel, index: number) => (
                                                                        <React.Fragment key={index}>
                                                                            <div style={{ width: 'auto' }}>
                                                                                <RiskCard
                                                                                    risk={risk}
                                                                                    onCardClick={() => {
                                                                                        ClickCard(risk),
                                                                                            setIsClicked(true),
                                                                                            setPolicyDetailData(false);
                                                                                    }}
                                                                                    // color={highBpiList?.priority_label}
                                                                                    className={`mb-3 
                                                                                        ${
                                                                                            riskState?.selectedRisk
                                                                                                ?.rule_id ==
                                                                                            risk.rule_id
                                                                                                ? 'selected'
                                                                                                : ''
                                                                                        }
                                                                                    `}
                                                                                ></RiskCard>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    ),
                                                                )}
                                                            </CAccordionBody>
                                                        </CAccordionItem>
                                                    </CAccordion>
                                                </CAccordionBody>
                                            </CAccordionItem>
                                        </CAccordion>
                                        <CAccordion activeItemKey={1}>
                                            <CAccordionItem itemKey={1}>
                                                <CAccordionHeader
                                                    onClick={() => {
                                                        ClickCard([]);
                                                        setPolicyDetailData(true);
                                                        {
                                                            isError ? setError(true) : setError(false);
                                                        }
                                                        setIsClicked(false);
                                                    }}
                                                >
                                                    <span className="my-3" style={{ color: '#000000' }}>
                                                        <b className=" ms-2 h5">Risky Identities</b>
                                                    </span>
                                                </CAccordionHeader>
                                            </CAccordionItem>
                                        </CAccordion>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {(error == true && isClicked == false) || dismissedRisks?.resources?.includes(rid) ? (
                        <div className="mt-4">No Records Available</div>
                    ) : error == false && isClicked == false && policyDetailData ? (
                        <div className="col-md-7 col-lg-8 overflow-auto">
                            <table className="no-pointer table table-borderless table-hover custom-table mt-4 rounded overflow-hidden">
                                <thead className="font-small-semibold border-bottom">
                                    <tr>
                                        <th className="w-30 ">Identity Name</th>
                                        <th className="w-10">Policy Name</th>
                                        <th className="w-10">Policy Type</th>
                                        <th className="w-15">Policy Identities </th>
                                        <th>Policy Permissions </th>
                                    </tr>
                                </thead>
                                <tbody className="font-small">
                                    {policyDetail &&
                                        policyDetail.map((policies: any) =>
                                            Object.keys(policies).map((policy: any, index: any) => (
                                                <tr key={index} onClick={() => naviagateToIdentityScreen(policy)}>
                                                    <td className="w-30 align-items-center ps-2 text-wrap ">
                                                        {' '}
                                                        {policies[policy].identity_name}
                                                    </td>
                                                    {Object.values(policies[policy].risky_policies).map(
                                                        (risky_policy: any, index: any) => (
                                                            <td className="w-10 px-2 text-wrap" key={index}>
                                                                {' '}
                                                                {risky_policy.policyName}
                                                            </td>
                                                        ),
                                                    )}
                                                    {Object.values(policies[policy].risky_policies).map(
                                                        (risky_policy: any, index: any) => (
                                                            <td className="w-10 px-2 text-wrap" key={index}>
                                                                {' '}
                                                                {risky_policy.policyType}
                                                            </td>
                                                        ),
                                                    )}
                                                    <td className="w-15 px-2 text-wrap ">
                                                        {Object.values(policies[policy].risky_policies).map(
                                                            (risky_policy: any) =>
                                                                Object.keys(risky_policy.identities).map(
                                                                    (identity, i) => (
                                                                        <span key={i}>
                                                                            {identity} (
                                                                            {risky_policy.identities[identity]}) <br />
                                                                        </span>
                                                                    ),
                                                                ),
                                                        )}
                                                    </td>

                                                    <td className="px-2">
                                                        <div className="d-flex">
                                                            {Object.values(policies[policy].risky_policies).map(
                                                                (risky_policy: any) =>
                                                                    Object.keys(risky_policy.permissions).map(
                                                                        (permission, i) =>
                                                                            permission == 'Admin' ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="  d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content="Admin Permission Enabled"
                                                                                    >
                                                                                        <CIcon icon={cilUser} />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'List' &&
                                                                              risky_policy.permissions[permission] >
                                                                                  0 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'List Permission : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilList}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'List' &&
                                                                              risky_policy.permissions[permission] <
                                                                                  1 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'List Permission : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilList}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Read' &&
                                                                              risky_policy.permissions[permission] >
                                                                                  0 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Read Permission : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilNotes}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Read' &&
                                                                              risky_policy.permissions[permission] <
                                                                                  1 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Read Permission : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilNotes}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission ==
                                                                                  'Permissions management' &&
                                                                              risky_policy.permissions[permission] >
                                                                                  0 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Permissions Management : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilLockLocked}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission ==
                                                                                  'Permissions management' &&
                                                                              risky_policy.permissions[permission] <
                                                                                  1 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Permissions Management : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilLockLocked}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Tagging' &&
                                                                              risky_policy.permissions[permission] >
                                                                                  0 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Tagging Permission: ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilTag}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Tagging' &&
                                                                              risky_policy.permissions[permission] <
                                                                                  1 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Tagging Permission: ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilTag}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Write' &&
                                                                              risky_policy.permissions[permission] >
                                                                                  0 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Write Permission  : ' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilPencil}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : permission == 'Write' &&
                                                                              risky_policy.permissions[permission] <
                                                                                  1 ? (
                                                                                <span
                                                                                    key={i}
                                                                                    className="d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir"
                                                                                >
                                                                                    <CTooltip
                                                                                        trigger="hover"
                                                                                        placement="bottom"
                                                                                        content={
                                                                                            'Write Permission  :' +
                                                                                            risky_policy.permissions[
                                                                                                permission
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <CIcon
                                                                                            icon={cilPencil}
                                                                                            size="lg"
                                                                                        />
                                                                                    </CTooltip>
                                                                                </span>
                                                                            ) : (
                                                                                <span>{permission}</span>
                                                                            ),
                                                                    ),
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )),
                                        )}

                                    {policyDetail?.length == 0 && (
                                        <tr className="text-center">
                                            <td colSpan={6}>{translate('no_records_available')} </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className=" bg-transparent col-md-7 col-lg-8 mt-3">
                            <div className="card h6">
                                <div className="border-bottom px-4 bg-transparent border-color-600  py-2">
                                    <span className="fw-bold">Pattern:</span>{' '}
                                    {riskState?.selectedRisk?.patternName || riskByTagList[0]?.patternName}
                                </div>
                                <div className="px-4 bg-transparent border-color-600 py-3">
                                    <span className="fw-bold">Rationale:</span>{' '}
                                    {criticalBpiList[0]?.pattern_description ||
                                        riskState?.selectedRisk?.pattern_description}
                                </div>
                            </div>
                            <div className="card">
                                <div
                                    role="presentation"
                                    className="pointer"
                                    onClick={() => {
                                        dispatch(
                                            setGraphDataAction({
                                                tabSelected: false,
                                                nodes: [],
                                                links: [],
                                                risk: undefined,
                                            }),
                                        );
                                        // history.replace(NAV_TABS_VALUE.RISK_MAP);
                                    }}
                                >
                                    <div className="border-bottom px-4 bg-transparent border-color-600 fw-bold py-2 h6">
                                        Risk:{' '}
                                        {riskState?.selectedRisk?.rule_name ||
                                            criticalBpiList[0]?.rule_name ||
                                            t('no_risk_found')}
                                    </div>

                                    <p
                                        role="presentation"
                                        className={`mx-4 my-1 h6 text-justify ${
                                            riskState?.selectedRisk?.entity_pattern_type === 'aws_IAMRole' ||
                                            criticalBpiList[0]?.entity_pattern_type === 'aws_IAMRole'
                                                ? 'pointer'
                                                : ''
                                        }`}
                                        onClick={(e, value = riskState?.selectedRisk || criticalBpiList[0] || null) => {
                                            if (value && value.entity_pattern_type === 'aws_IAMRole') {
                                                navigate(
                                                    `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${value.entity_pattern_type}/${value.sub_resource}/resources`,
                                                );
                                            }
                                        }}
                                    >
                                        {riskState?.selectedRisk?.risk_occurence_reason ||
                                            criticalBpiList[0]?.risk_occurence_reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div ref={pdfRef} hidden={hidePDF}>
                <div className=" container mt-1 ms-0 p-0 w-50">
                    <img
                        aria-hidden="true"
                        style={{ marginLeft: '230px', marginBottom: '20px' }}
                        className=""
                        src={require('assets/images/Logo.png')}
                        alt="Logo"
                        width={120}
                        height={27}
                    />
                </div>
                <div className="container mt-3 ms-0 w-50 h6">Account ID - {criticalBpiList[0]?.account_id}</div>
                <div className="container mt-1 ms-0 pt-1 w-50 h6">Bucket Name - {criticalBpiList[0]?.sub_resource}</div>

                <div className=" pdfContainer container mt-3 ms-0 w-50 h6 ">
                    <b className="container mt-3 ms-0 w-50 ">
                        Breach Prediction Index (BPI): {bpiSeverity?.bpiPercentage}%
                    </b>
                    <div className="b-left  container h6 text-justify" id="card-box">
                        <div className="card my-2">
                            <div className="card-header ">
                                <h6 className=""> Pattern: {criticalBpiList[0]?.patternName}</h6>
                            </div>
                            <div className="card-body">
                                {criticalBpiList[0]?.pattern_description}
                                <div></div>
                            </div>
                        </div>
                    </div>

                    {criticalBpiList.length == 0 ? null : (
                        <div className="container mt-3 ms-0 w-50 h6 ">
                            <b className="m-0 p-0">Critical Risk</b>
                        </div>
                    )}

                    {criticalBpiList.length == 0
                        ? null
                        : criticalBpiList.map((item: any, index: number) => {
                              return (
                                  <React.Fragment key={index}>
                                      <div className="b-left  container h6 text-justify" id="card-box">
                                          <div className="card my-2">
                                              <div className="card-header border-left-critical">
                                                  <h6 className="ms-2"> Risk: {item?.rule_name}</h6>
                                              </div>
                                              <div className="card-body">
                                                  <b className="m-0 p-0">Rationale </b>: {item?.risk_occurence_reason}
                                              </div>
                                          </div>
                                      </div>
                                  </React.Fragment>
                              );
                          })}
                    {highBpiList.length == 0 ? null : (
                        <div className="container mt-3 ms-0 w-50 h6 ">
                            <b>High Risks</b>
                        </div>
                    )}

                    {highBpiList.length == 0
                        ? null
                        : highBpiList.map((item: any, index: number) => {
                              return (
                                  <React.Fragment key={index}>
                                      <div className="b-left  container h6 text-justify" id="card-box">
                                          <div className="card my-2">
                                              <div className="card-header border-left-1">
                                                  <h6 className=""> Risk: {item?.rule_name}</h6>
                                              </div>
                                              <div className="card-body">
                                                  <b>Rationale </b>: {item?.risk_occurence_reason}
                                              </div>
                                          </div>
                                      </div>
                                  </React.Fragment>
                              );
                          })}
                    {mediumBpiList.length == 0 ? null : (
                        <div className="container mt-3 ms-0 w-50 h6 ">
                            <b>Medium Risks</b>
                        </div>
                    )}

                    {mediumBpiList.length == 0
                        ? null
                        : mediumBpiList.map((item: any, index: number) => {
                              return (
                                  <React.Fragment key={index}>
                                      <div className="b-left  container h6 text-justify" id="card-box">
                                          <div className="card my-2">
                                              <div className="card-header border-left-2">
                                                  <h6 className=""> Risk: {item?.rule_name}</h6>
                                              </div>
                                              <div className="card-body">
                                                  <b>Rationale </b>: {item?.risk_occurence_reason}
                                              </div>
                                          </div>
                                      </div>
                                  </React.Fragment>
                              );
                          })}
                    {lowBpiList.length == 0 ? null : (
                        <div className="container mt-3 ms-0 w-50 h6 ">
                            <b>Low Risks</b>
                        </div>
                    )}

                    {lowBpiList.length == 0
                        ? null
                        : lowBpiList.map((item: any, index: number) => {
                              return (
                                  <React.Fragment key={index}>
                                      <div className="b-left  container h6 text-justify" id="card-box">
                                          <div className="card my-2">
                                              <div className="card-header border-left-3">
                                                  <h6 className=""> Risk: {item?.rule_name}</h6>
                                              </div>
                                              <div className="card-body">
                                                  <b>Rationale </b>: {item?.risk_occurence_reason}
                                              </div>
                                          </div>
                                      </div>
                                  </React.Fragment>
                              );
                          })}
                </div>
            </div>
        </div>
    );
}

export default Index;
