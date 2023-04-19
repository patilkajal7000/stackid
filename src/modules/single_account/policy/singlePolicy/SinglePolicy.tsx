import React, { useEffect, useRef, useState } from 'react';
import { CChart } from '@coreui/react-chartjs';
import { getRulesPerPolicy } from 'core/services/DataEndpointsAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { SinglePolicyModel, PolicyRule } from 'shared/models/PolicyModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, ResourceType } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import SearchInput from 'shared/components/search_input/SearchInput';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import dayjs from 'dayjs';

const FilterItems: any = [{ id: 0, name: 'None' }];
const SinglePolicy = () => {
    const { t } = useTranslation();
    const [policyDetails, setPolicyDetails] = useState<SinglePolicyModel>();
    const [displayPolicyDetails, setDisplayPolicyDetails] = useState<PolicyRule[]>();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';

    const resourceId = params?.rid ? params.rid : '';
    const typeid = params?.tid;
    const dispatch = useDispatch();
    const [lineChartDetails, setLineChartDetails] = useState<any>();
    const [lineChartOptions, setLineChartOptions] = useState<any>();
    const bpiLineChart = useRef();
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [, setSearchValue] = useState('');
    const [selectedFilerValue] = useState(FilterItems[0].id);

    useEffect(() => {
        setIsCardOpen(true);
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: 'Policies',
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.POLICIES +
                        '/' +
                        typeid,
                },
                { name: resourceId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction('', ''));
        getRulesPerPolicy(cloudAccountId, resourceId).then((res: any) => {
            const resp = res as SinglePolicyModel;
            setPolicyDetails(resp);
            setDisplayPolicyDetails(resp.rules);
        });
    }, []);

    useEffect(() => {
        const divElement: any = bpiLineChart?.current;
        const canvas = divElement?.getElementsByTagName('canvas')[0];
        let gradient;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            gradient = ctx.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0.3, 'rgba(103, 203, 249, 0)');
            gradient.addColorStop(0.1, 'rgba(181, 228, 251, 0.8)');
        }

        setLineChartDetails({
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'BPI',
                    fill: 'start',
                    lineTension: 0.3,
                    backgroundColor: gradient,
                    borderColor: 'rgb(103, 203, 249)',
                    pointBorderWidth: 2,
                    pointBackgroundColor: '#ED5A71',
                    pointBorderColor: '#ED5A71',
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(75,192,192,0.5)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    data: [
                        {
                            x: '04/01/2021',
                            y: 40,
                        },
                        {
                            x: '10/01/2021',
                            y: 95,
                        },
                        {
                            x: '04/01/2021',
                            y: 70,
                        },
                        {
                            x: '10/01/2021',
                            y: 65,
                        },
                        {
                            x: '10/01/2021',
                            y: 17,
                        },
                    ],
                },
            ],
        });

        setLineChartOptions({
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                displayColors: false,
                cornerRadius: 0,
                callbacks: {
                    label: function (tooltipItem: any, data: any) {
                        if (
                            data?.datasets &&
                            tooltipItem?.datasetIndex != undefined &&
                            tooltipItem?.datasetIndex > -1 &&
                            tooltipItem?.index != undefined &&
                            tooltipItem?.index > -1
                        ) {
                            const dataset = data?.datasets[tooltipItem?.datasetIndex];
                            if (dataset && dataset?.data && dataset?.data[tooltipItem?.index]) {
                                const datarecord: any = dataset?.data[tooltipItem?.index];
                                return datarecord?.x + ' BPI :' + datarecord?.y;
                            }
                            return '';
                        }
                        return '';
                    },
                },
            },
            scales: {
                // The following will affect the vertical lines (xAxe) of your dataset

                xAxes: [
                    {
                        gridLines: {
                            color: '#C5C5CA',
                            borderDash: [4, 2],
                            zeroLineColor: '#C5C5CA',
                        },
                        ticks: {
                            fontSize: 11,
                            fontColor: '#9C9C9C',
                        },
                    },
                ],
                // And this will affect the horizontal lines (yAxe) of your dataset
                yAxes: [
                    {
                        gridLines: {
                            color: '#C5C5CA',
                            borderDash: [4, 2],
                        },
                        ticks: {
                            fontSize: 11,
                            fontColor: '#9C9C9C',
                            min: 0,
                            max: 100,
                            stepSize: 20,
                        },
                        stacked: true,
                    },
                ],
            },
            elements: {
                line: {
                    borderWidth: 2,
                },
            },
        });
    }, []);

    const onSearch = (searchString: string) => {
        setSearchValue(searchString);
        if (searchString.length > 0) {
            const selectedRule = policyDetails?.rules?.filter((rule: PolicyRule) =>
                rule.display_name.toLocaleLowerCase().includes(searchString.toLowerCase()),
            );
            if (selectedRule && selectedRule.length > 0) {
                setDisplayPolicyDetails(selectedRule);
            } else {
                setDisplayPolicyDetails([]);
            }
        } else {
            setDisplayPolicyDetails(policyDetails?.rules);
        }
    };
    return (
        <div className="container-fluid mt-2">
            <div className="container">
                <div className="d-flex flex-column mb-2">
                    <div className="h2 font-weight-bold mb-0">{policyDetails?.display_name}</div>
                    <div className="h6 d-flex">
                        {t('created_on')} {dayjs().format('MM-DD-YYYY')}
                        <div className={`d-flex align-items-center font-caption-bold Critical-icon-color mx-2`}>
                            12 % {t('failed')} <CIcon icon={cilX} className="mx-2" />
                        </div>
                    </div>
                </div>
                <div>{policyDetails?.description}</div>

                <div className="d-flex flex-row align-content-center py-0">
                    <div>
                        <div className="h1">
                            12% <div className="h4">{t('bpi')}</div>
                        </div>
                        <div className="font-caption">
                            {t('as_on')} {dayjs().format('MM-DD-YYYY')}
                        </div>
                    </div>

                    <div className="flex-fill mt-2">
                        <div className="h5 mx-3">{t('rule_failure_timeline')} </div>
                        <div className="mt-4 ms-4">
                            {isCardOpen && (
                                <CChart
                                    type="line"
                                    id="bpi_chart"
                                    data={{
                                        datasets: lineChartDetails?.datasets,
                                        labels: lineChartDetails?.labels,
                                    }}
                                    options={lineChartOptions}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center mx-0 w-60 mt-3">
                    <SearchInput minLength={0} onSearch={onSearch} placeholder="Search" />
                    <div className="d-flex align-items-center px-2 border-neutral-700">
                        <div className="font-x-small-bold">Filter</div>
                        <div>
                            <CDropdown placement="bottom" className="mx-1 p-1 w-100">
                                <CDropdownToggle className="btn-secondary font-x-small-bold">
                                    {FilterItems[selectedFilerValue].name}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {FilterItems.map((item: any, index: number) => (
                                        <CDropdownItem key={index} onClick={() => null}>
                                            {item.name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </div>
                </div>
                <table className="custom-table table table-borderless table-hover shadow-6">
                    <thead className="font-medium">
                        <tr className="border-bottom">
                            <th className="w-40" title={t('rule') + ''}>
                                {t('policy_violation')}
                            </th>
                            <th className="w-30" title={t('severity') + ''}>
                                {t('resource_type_applies')}
                            </th>
                            <th className="w-20" title={t('reasoning_and_remediation') + ''}>
                                {t('failed_resources')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="font-small">
                        {displayPolicyDetails?.map((rule: PolicyRule, index: number) => (
                            <tr className="border-bottom" key={index}>
                                <td>{rule.display_name} </td>
                                <td>{rule.resource_type.map((resource: string) => ResourceType[resource])}</td>
                                <td>
                                    {rule.failed_resources}/{rule.total_resources}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SinglePolicy;
