import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentitiesInsightDetail, IdentitiesInsights, IdentityType } from 'shared/models/IdentityAccessModel';
import { CChart } from '@coreui/react-chartjs';
import './index.css';
type InsightProps = {
    data: IdentitiesInsights | undefined;
    isLoading: boolean;
    translate: any;
    identityType: IdentityType;
};

const IdentitiesInsight = ({ data, isLoading, translate }: InsightProps) => {
    const isAllZero = (x: number) => x > 0;
    const legendView = (labelData: any, colorData: any, key: any) => {
        const graphData: any = labelData.map((label: any, index: number) => {
            return {
                color: colorData[index].color,
                label: label.label,
                key: index,
            };
        });

        return (
            <div className="legend" key={key}>
                {graphData.map((d: any, i: number) => {
                    return (
                        <div key={i} className="legendRow">
                            <div
                                style={{
                                    backgroundColor: d.color,
                                    width: 8,
                                    height: 8,
                                    display: 'inline-block',
                                    marginLeft: 5,
                                    marginRight: 5,
                                }}
                            />
                            <span className="font-x-small-bold">{d.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };
    return (
        <div className="mt-3">
            {isLoading ? (
                <div className="d-flex flex-row justify-content-around my-3">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column px-2">
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                        </div>
                        <div className="custom-count-badge">
                            <Skeleton height={100} />
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column px-2">
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                            <div className="custom-count-badge">
                                <Skeleton height={10} />
                            </div>
                        </div>
                        <div className="custom-count-badge">
                            <Skeleton height={100} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-row justify-content-around d-flex align-items-center">
                        {data &&
                            Object.keys(data).map((key: any, index: number) => {
                                const item: IdentitiesInsightDetail = data[key];
                                if (!item?.badgeData || Object.keys(item?.badgeData).length === 0) {
                                    return <div key={index}></div>;
                                } else {
                                    const colorData: any = [];
                                    const labelData: any = [];
                                    const Clabel: string[] = [];
                                    const Cdata: number[] = [];
                                    const Ccolor: any = ['#F8D9AE', '#d9e8cd', '#c5e3ff', '#f7899a', '#82e2c7'];
                                    item.badgeData &&
                                        item.badgeData.map((badge: [string, number]) => {
                                            Clabel.push(translate(badge[0]));
                                            Cdata.push(badge[1]);
                                        });

                                    Clabel.map((lebl: string) => {
                                        labelData.push({ label: lebl });
                                    });
                                    Ccolor.map((colr: string) => {
                                        colorData.push({ color: colr });
                                    });
                                    return (
                                        <div key={key}>
                                            <div key={key} className="font-small-semibold">
                                                {item.title}
                                            </div>
                                            <div
                                                key={index}
                                                className="d-flex flex-row "
                                                data-si-qa-key={`identity-chart-color-${colorData}`}
                                            >
                                                {legendView(labelData, colorData, key)}
                                                {Cdata.every(isAllZero) ? (
                                                    <CChart
                                                        type="doughnut" //doughnut
                                                        data={{
                                                            labels: Clabel,
                                                            datasets: [
                                                                {
                                                                    label: item.title,
                                                                    data: Cdata,
                                                                    backgroundColor: Ccolor,
                                                                },
                                                            ],
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                legend: {
                                                                    display: false,
                                                                    position: 'left',
                                                                    fullSize: false,
                                                                    labels: {
                                                                        padding: 10,
                                                                        boxWidth: 10,
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                ) : (
                                                    <React.Fragment>
                                                        <CChart
                                                            type="doughnut" //doughnut
                                                            data={{
                                                                labels: ['No Data'],
                                                                datasets: [
                                                                    {
                                                                        label: 'No Data',
                                                                        data: [1],
                                                                        backgroundColor: ['#dddddd'],
                                                                    },
                                                                ],
                                                            }}
                                                            options={{
                                                                responsive: true,
                                                                maintainAspectRatio: false,
                                                                plugins: {
                                                                    tooltip: {
                                                                        enabled: false,
                                                                        callbacks: {
                                                                            label: function () {
                                                                                return 'No Data';
                                                                            },
                                                                        },
                                                                    },
                                                                    legend: {
                                                                        onClick(event: any) {
                                                                            event.stopPropagation();
                                                                        },
                                                                        display: false,
                                                                        position: 'left',
                                                                        fullSize: false,
                                                                        labels: {
                                                                            padding: 10,
                                                                            boxWidth: 10,
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(IdentitiesInsight);
