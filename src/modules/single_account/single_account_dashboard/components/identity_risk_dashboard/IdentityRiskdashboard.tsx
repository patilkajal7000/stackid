import { CChart } from '@coreui/react-chartjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import CIcon from '@coreui/icons-react';
import { cilChevronRight } from '@coreui/icons';
import { getRiskyIdSummaryDetails } from 'core/services/IdentitiesAPIService';
import { AxiosError } from 'axios';
import SummaryDetailsTable from '../SummaryDetailsTable';
import { AppState } from 'store/store';

const riskyTab: any = {
    human_user: 'Human Identities',
    app_user: 'Application Identities',
    role: 'Roles',
    federated: 'Federated Identities',
};
const accessLabel = ['Excessive Access', 'Invisible Access', 'Dormant Access'];
const chartColors = ['#aad3cd', '#d9e8cd', '#4c83b2', '#c5e3ff', '#75bacf'];
const IdentityRiskdashboard = (props: any) => {
    const { riskyData, orgId, accountId } = props;
    const [value, setValue] = useState('human_user');
    const [labelValue, setLabelValue] = useState<any>([]);
    const [access, setAccess] = useState<any>(accessLabel);
    const [chartColor, setChartColor] = useState<any>(chartColors);
    const [tooltipEnabled, setTooltipEnabled] = useState<boolean>(false);
    const [tableDetails, setTableDetails] = useState<any>();
    const [tableDetailsLoading, setTableDetailsLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [riskType, setRiskType] = useState<any>();

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [humanUser, setHumanUser] = useState<any>();
    const [appUser, setAppUser] = useState<any>();
    const [role, setRole] = useState<any>();
    const [federated, setFederated] = useState<any>();
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    useEffect(() => {
        if (riskyData?.length) {
            riskyData?.map((data: any) => {
                if (data?.id_type === 'human_user') setHumanUser(data?.counts);
                if (data?.id_type === 'app_user') setAppUser(data?.counts);
                if (data?.id_type === 'role') setRole(data?.counts);
                if (data?.id_type === 'federated') setFederated(data?.counts);
            });
        }
    }, [riskyData.length]);

    const IdentitiesDetails = (type: string) => {
        const selectedValue =
            type === 'human_user'
                ? IdentityType.AwsIAMUserHuman
                : type === 'app_user'
                ? IdentityType.AwsIAMUserApplication
                : type === 'role'
                ? IdentityType.AwsIAMRole
                : type === 'federated'
                ? IdentityType.AwsFederated
                : '';
        const text: any = location.pathname;
        const path: any = text.replace('dashboard/aws_S3', '');
        dispatch(setTabsAction('', NAV_TABS_VALUE.IDENTITIES));
        navigate({
            pathname: `${path}identities/${selectedValue}`,
        });
    };

    useEffect(() => {
        if (riskyData && riskyData[2]) {
            setLabel(riskyData[2].counts);
        } else {
            setLabel(null);
        }
        getDataByTab();
    }, [value, props]);

    const setTabValue = (tabValue: string) => {
        setValue(tabValue);
    };

    const setLabel = (identity: any) => {
        let tempLabel = [];
        if (identity) {
            if (identity?.excessive_access < 1 && identity?.invisible_access < 1 && identity?.unused_access < 1) {
                tempLabel.push(1);
                setAccess(['No Data']);
                setChartColor(['#BBBBBB']);
                setTooltipEnabled(false);
            } else {
                tempLabel.push(identity?.excessive_access ? identity?.excessive_access : 0);
                tempLabel.push(identity?.invisible_access ? identity?.invisible_access : 0);
                tempLabel.push(identity?.unused_access ? identity?.unused_access : 0);
                setAccess(accessLabel);
                setChartColor(chartColors);
                setTooltipEnabled(true);
            }
        } else {
            tempLabel.push(1);
            setAccess(['No Data']);
            setChartColor(['#BBBBBB']);
            setTooltipEnabled(false);
        }
        setLabelValue(tempLabel);
        tempLabel = [];
    };

    function getObjKey(value: any) {
        if (value === 'app_user') setLabel(appUser);
        if (value === 'role') setLabel(role);
        if (value === 'federated') setLabel(federated);
    }

    const getDataByTab = () => {
        if (riskyData.length) {
            getObjKey(value);
        }
    };

    const getTotal = (value: any) => {
        if (value === 'human_user') return humanUser?.total ? humanUser?.total : 0;
        if (value === 'app_user') return appUser?.total ? appUser?.total : 0;
        if (value === 'role') return role?.total ? role?.total : 0;
        if (value === 'federated') return federated?.total ? federated?.total : 0;
    };

    const showSummaryDetails = (riskType: any) => {
        setTableDetailsLoading(true);
        setModalOpen(true);
        setRiskType(riskType);

        let riskTypeText = 'all';
        if (riskType === 'Excessive Access') riskTypeText = 'excessive_access';
        if (riskType === 'Invisible Access') riskTypeText = 'invisible_access';
        if (riskType === 'Dormant Access') riskTypeText = 'unused_access';

        const body = {
            discoveryId: `${discoveryId}`,
            accountId: `${accountId}`,
            idType: value, //human_user/app_user/federated/role/all   default value is all
            riskType: riskTypeText, //excessive_access/invisible_access/unused_access/all   default value is all
        };
        getRiskyIdSummaryDetails(body, orgId)
            .then((res: any) => {
                setTableDetails(res);
                setTableDetailsLoading(false);
            })
            .catch((err: AxiosError) => {
                setTableDetailsLoading(false);
                console.log('Error: ', err);
            });
    };

    return (
        <div className="row">
            <div data-si-qa-key="dashboard-risky-identities-total" className="h4 mb-3">
                Risky Identities:{' '}
                {props?.riskyData
                    ? (props?.riskyData[0]?.counts?.total || 0) +
                      (props?.riskyData[1]?.counts?.total || 0) +
                      (props?.riskyData[2]?.counts?.total || 0) +
                      (props?.riskyData[3]?.counts?.total || 0)
                    : 0}
            </div>
            {/* <div className=" mt-2 col-12 mb-3">
                <ProgressBar
                    animated={true}
                    className="mb-3"
                    style={{
                        height: 10,
                        backgroundColor: '#eaecef',
                        border: '2px solid red',
                    }}
                >
                    <ProgressBar
                        // variant="primary"
                        now={(props?.identitiesRisk?.analytics_data?.human_identities?.total_identities / 3) * 100 || 0}
                        key={1}
                        style={{ backgroundColor: '#401c61' }}
                    />
                    <ProgressBar
                        // variant="success"
                        now={
                            (props?.identitiesRisk?.analytics_data?.application_identities?.total_identities / 3) * 100
                        }
                        key={2}
                        style={{ backgroundColor: '#c56f89' }}
                    />
                    <ProgressBar
                        // striped
                        // variant="warning"
                        now={(props?.identitiesRisk?.analytics_data?.roles?.total_identities / 3) * 100 || 0}
                        key={3}
                        style={{ backgroundColor: '#eebda9' }}
                    />
                </ProgressBar>
                <div>
                    <div>
                        {iRiskData.map((data: any) => {
                            return (
                                <>
                                    <div
                                        style={{
                                            backgroundColor: data.color,
                                            width: 8,
                                            height: 8,
                                            display: 'inline-block',
                                            marginLeft: 5,
                                            marginRight: 5,
                                        }}
                                    />
                                    <span style={{ fontSize: '11px', marginRight: '5px', color: '#000' }}>
                                        {data.name}
                                    </span>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div> */}
            <div className="col-12 col-sm-12 col-md-12 mb-3 mb-xl-0 ">
                <button
                    type="button"
                    className={` m-0 ${
                        props.type == 'bq_Dataset' ? 's-eql-3' : 's-eql-4'
                    } fs-6 btn btn-custom btn-tab p-0 py-1 ${value === 'human_user' ? 'selected' : ''}`}
                    onClick={() => setTabValue('human_user')}
                >
                    Human
                </button>
                <button
                    type="button"
                    className={` m-0 ${
                        props.type == 'bq_Dataset' ? 's-eql-3' : 's-eql-4'
                    } fs-6 btn btn-custom btn-tab p-0 py-1 ${value === 'app_user' ? 'selected' : ''}`}
                    onClick={() => setTabValue('app_user')}
                >
                    Application
                </button>
                {props.type == 'bq_Dataset' ? null : (
                    <button
                        type="button"
                        className={` m-0 s-eql-4 fs-6 btn btn-custom btn-tab p-0 py-1 ${
                            value === 'role' ? 'selected' : ''
                        }`}
                        onClick={() => setTabValue('role')}
                    >
                        Roles
                    </button>
                )}
                <button
                    type="button"
                    className={` m-0 ${
                        props.type == 'bq_Dataset' ? 's-eql-3' : 's-eql-4'
                    } fs-6 btn btn-custom btn-tab p-0 py-1 ${value === 'federated' ? 'selected' : ''}`}
                    onClick={() => setTabValue('federated')}
                >
                    Federated
                </button>
            </div>
            <div className="doughnut-chart mb-3  mt-3 col-12 ">
                <div className="h5">
                    {riskyTab[value]}: <span data-si-qa-key={`dashboard-risky-${value}`}>{getTotal(value)}</span>
                    <span className="text-info pointer">
                        <CIcon icon={cilChevronRight} className="mx-2" onClick={() => IdentitiesDetails(value)} />
                    </span>
                    {riskyTab[value] == 'Roles' ? (props.type == 'bq_Dataset' ? 'NA' : '') : null}
                </div>
                <CChart
                    type="pie"
                    data={{
                        labels: access,
                        datasets: [
                            {
                                data: labelValue,
                                backgroundColor: chartColor,
                            },
                        ],
                    }}
                    options={{
                        onClick(event, elements) {
                            if (elements[0].index === 0) showSummaryDetails('Excessive Access');
                            if (elements[0].index === 1) showSummaryDetails('Invisible Access');
                            if (elements[0].index === 2) showSummaryDetails('Dormant Access');
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: { enabled: tooltipEnabled },
                            legend: {
                                onClick: (e: any, legendItem: any) => {
                                    showSummaryDetails(legendItem?.text);
                                },
                                onHover(e: any) {
                                    e.chart.canvas.style.cursor = 'pointer';
                                },
                                align: 'center',
                                position: 'right',
                                fullSize: false,
                                labels: {
                                    padding: 15,
                                    boxWidth: 15,
                                    boxHeight: 15,
                                    color: '#000000',
                                },
                            },
                        },
                    }}
                />
            </div>
            {modalOpen && (
                <SummaryDetailsTable
                    type="risky_identities"
                    accountId={accountId}
                    data={tableDetails}
                    loading={tableDetailsLoading}
                    idType={value}
                    status={riskType}
                    open={modalOpen}
                    setOpen={setModalOpen}
                />
            )}
        </div>
    );
};

export default IdentityRiskdashboard;
