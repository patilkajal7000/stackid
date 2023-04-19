import { CChart } from '@coreui/react-chartjs';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BPIModel } from 'shared/models/BPIModel';
import { AppState } from 'store/store';
import dayjs from 'dayjs';
import { getBpiScoreSeverity, getSeverityColor } from 'shared/service/Severity.service';
import { BpiTimeLine } from 'core/services/ApplicationAPIService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Skeleton from 'react-loading-skeleton';
import { CCard, CContainer, CImage, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cibDiscover, cilStorage, cilPlus, cilMinus, cilTag } from '@coreui/icons';
import { getAllDissmisedRisks } from 'core/services/DataEndpointsAPIService';
import { SeverityType } from 'shared/models/RHSModel';

type DataElmentDetailsProps = {
    name: string;
    createdBy: string;
    creationDate: string;
    isLoading: boolean;
    resourceDetails: any;
    native_tags?: any;
    data_security?: any;
};

type BPISeverity = {
    bpiPercentage: number;
    severity: string;
    severityColor: string;
};

const DataElmentDetails = (props: DataElmentDetailsProps) => {
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [bpiSeverity, setBPISeverity] = useState<BPISeverity>();

    const [lineChartDetails, setLineChartDetails] = useState<any>();
    const [lineChartData, setLineChartData] = useState<any>([]);
    // const [chartDataPrepare, setChartDataPrepare] = useState([]);
    // const [chartDataPrepareLebal, setChartDataPrepareLebal] = useState([]);
    const [lineChartOptions, setLineChartOptions] = useState<any>();
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    // const dispatch = useDispatch();
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;

    const bpiState = useSelector((state: AppState) => state.bpiState);
    const bpiDetailsState: BPIModel = bpiState.bpiDetails;
    const bpiLineChart = useRef();
    const { t } = useTranslation();

    const { data: dismissedRisks, refetch: refetchgetAllDismissedRisks } = getAllDissmisedRisks(orgId, cloudAccountId);
    useEffect(() => {
        refetchgetAllDismissedRisks();
    }, []);

    useEffect(() => {
        if (bpiState && bpiState.bpiDetails) {
            const bpiPercentage = bpiDetailsState?.bpi | 0;
            const severity = getBpiScoreSeverity(bpiPercentage);
            const severityColor = getSeverityColor(severity);
            setBPISeverity({ bpiPercentage, severity, severityColor });
        }
    }, [bpiState.bpiDetails]);
    useEffect(() => {
        if (isCardOpen && lineChartData.length === 0) {
            BpiTimeLine(orgId, cloudAccountId, props?.name)
                .then((res: any) => {
                    setLineChartData(res);
                })
                .catch((err: AxiosError) => {
                    console.log(' timeline err:::::', err);
                });
        }
    }, [isCardOpen, lineChartData]);

    const getLineChartData = () => {
        const array: any = [];
        const array2: any = [];
        lineChartData.map((item: any) => {
            const date = dayjs(item.last_checked_on).format('DD/MM/YYYY');
            array2.unshift(date);
            array.unshift(item.bpi);

            // setChartDataPrepare(array);
            // setChartDataPrepareLebal(array2);
        });

        // array2.push('.');

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
            labels: array2,
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
                    data: array,
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
                xAxes: {
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
                // And this will affect the horizontal lines (yAxe) of your dataset
                yAxes: {
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
            },
            elements: {
                line: {
                    borderWidth: 2,
                },
            },
        });
    };
    useEffect(() => {
        getLineChartData();
    }, [isCardOpen, lineChartData]);

    // useEffect(() => {
    //     const divElement: any = bpiLineChart?.current;
    //     const canvas = divElement?.getElementsByTagName('canvas')[0];
    //     let gradient;
    //     if (canvas) {
    //         const ctx = canvas.getContext('2d');
    //         gradient = ctx.createLinearGradient(0, 0, 0, 450);
    //         gradient.addColorStop(0.3, 'rgba(103, 203, 249, 0)');
    //         gradient.addColorStop(0.1, 'rgba(181, 228, 251, 0.8)');
    //     }

    //     setLineChartDetails({
    //         labels: chartDataPrepareLebal,
    //         datasets: [
    //             {
    //                 label: 'BPI',
    //                 fill: 'start',
    //                 lineTension: 0.3,
    //                 backgroundColor: gradient,
    //                 borderColor: 'rgb(103, 203, 249)',
    //                 pointBorderWidth: 2,
    //                 pointBackgroundColor: '#ED5A71',
    //                 pointBorderColor: '#ED5A71',
    //                 pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    //                 pointHoverBorderColor: 'rgba(75,192,192,0.5)',
    //                 pointHoverBorderWidth: 2,
    //                 pointRadius: 4,
    //                 pointHoverRadius: 6,
    //                 data: chartDataPrepare,
    //             },
    //         ],
    //     });

    //     setLineChartOptions({
    //         maintainAspectRatio: false,
    //         legend: {
    //             display: false,
    //         },
    //         tooltips: {
    //             displayColors: false,
    //             cornerRadius: 0,
    //             callbacks: {
    //                 label: function (tooltipItem, data) {
    //                     if (
    //                         data?.datasets &&
    //                         tooltipItem?.datasetIndex != undefined &&
    //                         tooltipItem?.datasetIndex > -1 &&
    //                         tooltipItem?.index != undefined &&
    //                         tooltipItem?.index > -1
    //                     ) {
    //                         const dataset = data?.datasets[tooltipItem?.datasetIndex];
    //                         if (dataset && dataset?.data && dataset?.data[tooltipItem?.index]) {
    //                             const datarecord: any = dataset?.data[tooltipItem?.index];
    //                             return datarecord?.x + ' BPI :' + datarecord?.y;
    //                         }
    //                         return '';
    //                     }
    //                     return '';
    //                 },
    //             },
    //         },
    //         scales: {
    //             // The following will affect the vertical lines (xAxe) of your dataset

    //             xAxes: [
    //                 {
    //                     gridLines: {
    //                         color: '#C5C5CA',
    //                         borderDash: [4, 2],
    //                         zeroLineColor: '#C5C5CA',
    //                     },
    //                     ticks: {
    //                         fontSize: 11,
    //                         fontColor: '#9C9C9C',
    //                     },
    //                 },
    //             ],
    //             // And this will affect the horizontal lines (yAxe) of your dataset
    //             yAxes: [
    //                 {
    //                     gridLines: {
    //                         color: '#C5C5CA',
    //                         borderDash: [4, 2],
    //                     },
    //                     ticks: {
    //                         fontSize: 11,
    //                         fontColor: '#9C9C9C',
    //                         min: 0,
    //                         max: 100,
    //                         stepSize: 20,
    //                     },
    //                     stacked: true,
    //                 },
    //             ],
    //         },
    //         elements: {
    //             line: {
    //                 borderWidth: 2,
    //             },
    //         },
    //     });
    // }, [isCardOpen]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        props.isLoading && toggleCard();
    }, [props.isLoading]);

    //const options: Chart.ChartOptions =
    const toggleCard = () => {
        setIsCardOpen(!isCardOpen);
    };

    return (
        <CContainer fluid className="shadow-7 p-3">
            <CContainer className="p-0">
                <div className="d-flex justify-content-between">
                    <div className="me-4 icon-bg-circle icon-bg-circle-fa">
                        <CIcon icon={cilStorage} size={'xl'} className="mx-1 " />
                    </div>
                    <div className="me-auto">
                        <div className="opacity-09">{props.name} </div>
                        <div className="h6 opacity-08">
                            {t('creator')} : {props.createdBy} |{' '}
                            {props.creationDate && dayjs(props.creationDate).format('MMM DD, YYYY')}
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <div className="font-medium-semibold">
                            {dismissedRisks?.resources?.includes(props.name) ? 0 : bpiSeverity?.bpiPercentage}%
                            <CTooltip content="Breach Prediction Index">
                                <span>{t('bpi')}</span>
                            </CTooltip>
                        </div>
                        <CCard
                            className={`custom-card status-indicator-chip ${
                                dismissedRisks?.resources?.includes(props.name)
                                    ? getSeverityColor(SeverityType.LOW)
                                    : bpiSeverity?.severityColor
                            } d-flex flex-row align-items-center justify-content-center`}
                        >
                            <div>
                                <CIcon icon={cibDiscover} className="mx-2 severity-icon" />
                            </div>
                            <div className="severity-text">
                                {dismissedRisks?.resources?.includes(props.name)
                                    ? getBpiScoreSeverity(0)
                                    : bpiSeverity?.severity}
                            </div>
                        </CCard>
                        {props.resourceDetails.Logging && Object.keys(props.resourceDetails.Logging).length > 0 ? (
                            <CTooltip trigger="hover" content={t('logging_enabled')}>
                                <div className="icon-bg-circle d-flex flex-row align-items-center justify-content-center">
                                    <em className="icon icon-alert-danger icon-list font-16" />
                                </div>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" content={t('logging_not_enabled')}>
                                <div className="icon-bg-circle d-flex flex-row align-items-center justify-content-center icon-danger">
                                    <em className="icon icon-alert-danger icon-unlist font-20" />
                                </div>
                            </CTooltip>
                        )}
                        {props.data_security?.is_encrypted ? (
                            <CTooltip trigger="hover" content={t('encryption_enabled')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir ">
                                    <em className="icon icon-alert-danger icon-lock font-20" />
                                </div>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" content={t('encryption_not_enabled')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                    <em className="icon icon-alert-danger icon-unlock font-20" />
                                </div>
                            </CTooltip>
                        )}
                        {props.data_security?.is_public ? (
                            <CTooltip trigger="hover" content={t('public')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                    <CImage
                                        src={require('assets/images/visibility_on.svg')}
                                        style={{
                                            filter: 'invert(57%) sepia(76%) saturate(2618%) hue-rotate(314deg) brightness(102%) contrast(101%)',
                                        }}
                                    />
                                </div>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" content={t('not_public')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir ">
                                    <CImage
                                        src={require('assets/images/visibility_off.svg')}
                                        style={{
                                            filter: 'invert(61%) sepia(18%) saturate(758%) hue-rotate(138deg) brightness(91%) contrast(87%)',
                                        }}
                                    />
                                </div>
                            </CTooltip>
                        )}
                        {props.data_security?.is_versioned ? (
                            <CTooltip trigger="hover" content={t('versioning_enabled')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                    <em className="icon icon-alert-danger icon-stack font-20" />
                                </div>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" content={t('versioning_not_enabled')}>
                                <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                    <em className="icon icon-alert-danger icon-unstack font-20" />
                                </div>
                            </CTooltip>
                        )}
                        {props.native_tags ? (
                            <CTooltip
                                trigger="hover"
                                content={
                                    (props.native_tags && props.native_tags.length ? props.native_tags.length : 0) +
                                    ' ' +
                                    t('tag_applied')
                                }
                            >
                                <div className="m-1 icon-bg-circle d-flex flex-row align-items-center justify-content-center">
                                    <CIcon icon={cilTag} size="xl" className="tag-icon" />
                                </div>
                            </CTooltip>
                        ) : (
                            <CTooltip trigger="hover" content={t('tags_not_found')}>
                                <div className="m-1 icon-bg-circle d-flex flex-row align-items-center justify-content-center icon-danger">
                                    <CImage
                                        src={require('assets/images/outline-label-off.svg')}
                                        width="24px"
                                        className="tag-icon danger-icon"
                                        style={{
                                            filter: 'invert(57%) sepia(76%) saturate(2618%) hue-rotate(314deg) brightness(102%) contrast(101%)',
                                        }}
                                    />
                                </div>
                            </CTooltip>
                        )}
                        {!dismissedRisks?.resources?.includes(props.name) && (
                            <div
                                className="mx-2 position-absolute icon-bg-circle-outline pointer"
                                style={{ right: 0 }}
                                role="presentation"
                                onClick={toggleCard}
                            >
                                {isCardOpen ? <CIcon icon={cilMinus} size="lg" /> : <CIcon icon={cilPlus} size="lg" />}
                            </div>
                        )}
                    </div>
                </div>
                <div className={`py-0 ${isCardOpen ? 'show' : 'collapse'}`}>
                    <div className="d-flex flex-row align-content-center py-3">
                        {/* <div>
                            <div className="h1">
                                {bpiSeverity?.bpiPercentage}% <div className="h4">{t('bpi')}</div>
                            </div>
                            {bpiDetailsState?.last_checked_on && (
                                <div className="font-caption">
                                    {t('as_on')} {convertToDateFormat(bpiDetailsState?.last_checked_on)}
                                </div>
                            )}
                        </div> */}
                        <div className="flex-fill">
                            <div className="h5">{t('bpi_timeline')} </div>

                            {isCardOpen && lineChartData.length > 0 ? (
                                <div className="mt-4 ">
                                    <CChart
                                        type="line"
                                        id="bpi_chart"
                                        data={{
                                            datasets: lineChartDetails?.datasets,
                                            labels: lineChartDetails?.labels,
                                        }}
                                        options={lineChartOptions}
                                    />
                                </div>
                            ) : (
                                <Skeleton height={120} className="flex-fill" />
                            )}
                        </div>
                    </div>
                </div>
            </CContainer>
        </CContainer>
    );
};

export default DataElmentDetails;
