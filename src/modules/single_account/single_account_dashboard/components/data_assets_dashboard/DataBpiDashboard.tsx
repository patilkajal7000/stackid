import { CTooltip } from '@coreui/react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const DataBpiDashboard = (props: any) => {
    return (
        <div className="p-3">
            {props.loadingBpi ? (
                <div className="container">
                    <Skeleton height={80} className="mx-0 me-5" />
                    <Skeleton height={80} className="mx-0 me-5" />
                    <Skeleton height={80} className="mx-0 me-5" />
                    <Skeleton height={80} className="mx-0 me-5" />
                    <Skeleton height={80} className="mx-0 me-5" />
                </div>
            ) : (
                <>
                    <div>
                        <div data-si-qa-key="dashboard-risky-data-total" className="h4 mb-1 mt-1">
                            Risky Data Assets: {props?.bpiData.total_critical_resources || 0}
                        </div>
                        {/* <div className="h3 mb-3">Data Assets </div> */}
                    </div>
                    <table className="table table-borderless custom-table rounded overflow-hidden container mt-3">
                        <thead>
                            <tr>
                                <th className="w-60 ps-3">
                                    <CTooltip content="Data Asset Name" placement="top">
                                        <span> Name</span>
                                    </CTooltip>
                                </th>
                                <th className="w-20 ps-3">Type</th>

                                {props?.type == 'bq_Dataset' ? (
                                    <></>
                                ) : (
                                    <th colSpan={2} className="ps-3">
                                        <CTooltip content="Breach Prediction Index" placement="top">
                                            <span>BPI</span>
                                        </CTooltip>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {props?.bpiData?.data?.length === 0 ? (
                                <tr className="d-flex justify-content-center">
                                    <td colSpan={3}>No Data Available</td>
                                </tr>
                            ) : (
                                props?.bpiData?.data?.map((item: any, i: number) => {
                                    return (
                                        <tr
                                            key={i}
                                            onClick={(e) => props.onClickRow(item, e)}
                                            className={` cursor-pointer w-40`}
                                        >
                                            <td className="ps-3">{item?.root_resource}</td>
                                            <td className="ps-3">
                                                {item?.name
                                                    ? item?.name
                                                    : props.type == 'bq_Dataset'
                                                    ? 'Big Query Datasets'
                                                    : 'S3 Bucket'}
                                            </td>
                                            {props?.type == 'bq_Dataset' ? (
                                                <></>
                                            ) : (
                                                <td className="ps-3">
                                                    <span
                                                        data-si-qa-key={`dashboard-risky-BPI-${i}`}
                                                        style={{ color: '#ff647c' }}
                                                        className="h5"
                                                    >
                                                        {item?.bpi}
                                                    </span>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default DataBpiDashboard;
