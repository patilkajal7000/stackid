import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { getResourceSummaryDetails } from 'core/services/IdentitiesAPIService';
import SummaryDetailsTable from '../SummaryDetailsTable';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';

const NewDataDashboard = (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { bpiData, accountId, interval, orgId } = props;
    const [tableDetails, setTableDetails] = useState<any>();
    const [tableDetailsLoading, setTableDetailsLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [s3Counts, setS3Counts] = useState<any>();
    const [RDSCounts, setRDSCounts] = useState<any>();
    const [RDSClusterCounts, setRDSClusterCounts] = useState<any>();
    const [redShiftCounts, setRedShiftCounts] = useState<any>();
    const [dynamoDBTableCounts, setDynamoDBTableCounts] = useState<any>();
    const [dynamoDBExportCounts, setDynamoDBExportCounts] = useState<any>();
    const [resourceType, setResourceType] = useState<any>();
    const [status, setStatus] = useState<any>();

    useEffect(() => {
        if (bpiData.length) {
            bpiData?.map((data: any) => {
                if (data?.resource_type === 'aws_S3') setS3Counts(data?.counts);
                if (data?.resource_type === 'aws_RDSInstance') setRDSCounts(data?.counts);
                if (data?.resource_type === 'aws_RedshiftCluster') setRedShiftCounts(data?.counts);
                if (data?.resource_type === 'aws_DynamoDBTable') setDynamoDBTableCounts(data?.counts);
                if (data?.resource_type === 'aws_DynamoDBExport') setDynamoDBExportCounts(data?.counts);
                if (data?.resource_type === 'aws_RDSCluster') setRDSClusterCounts(data?.counts);
            });
        }
    }, [bpiData]);

    const goToDataAssets = (type: string) => {
        const text: any = location.pathname;

        const path: any = text.replace('dashboard/aws_S3', `data_assets/${type}`);
        navigate({
            pathname: `${path}`,
        });
    };

    const showSummaryDetails = (resourceType: any, status: any) => {
        setTableDetailsLoading(true);
        setModalOpen(true);
        setResourceType(resourceType);
        setStatus(status);

        const body = {
            discoveryId: `${props.discoveryId}`,
            accountId: `${accountId}`,
            interval: interval,
            resourceType: resourceType, //aws_S3, aws_RelationalDatabaseService etc   default value is all
            status: status === 'created' ? 'added' : status, //added/deleted/total   default value is total
        };
        getResourceSummaryDetails(body, orgId)
            .then((res: any) => {
                setTableDetailsLoading(false);
                setTableDetails(res);
            })
            .catch((err: AxiosError) => {
                setTableDetailsLoading(false);
                console.log('Error: ', err);
            });
    };

    return (
        <>
            <div data-si-qa-key="dashboard-data-assets-widget-total" className="h4 mb-4 mt-1 pt-2">
                Data Assets:{' '}
                {(s3Counts?.total || 0) +
                    (RDSCounts?.total || 0) +
                    (redShiftCounts?.total || 0) +
                    (RDSClusterCounts?.total || 0) +
                    (dynamoDBTableCounts?.total || 0) +
                    (dynamoDBExportCounts?.total || 0)}
            </div>
            <div className="d-flex">
                <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                    <div className="font-small-semibold mb-2">
                        {props?.type == 'bq_Dataset' ? 'Big Query Datasets' : 'S3 Buckets'}{' '}
                    </div>
                    <div className="font-base-family-poppins mb-1 ">
                        <div className="m-1">
                            <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                            <span
                                data-si-qa-key="dashboard-data-assets-Buckets-increase"
                                role="presentation"
                                className="cursor-pointer p-1"
                                onClick={() => {
                                    showSummaryDetails('aws_S3', 'created');
                                }}
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                    props?.type == 'bq_Dataset'
                                        ? 'Big Query Datasets - created'
                                        : 'S3 Buckets - created'
                                }
                            >
                                {s3Counts?.added ? s3Counts?.added : props?.type == 'bq_Dataset' ? 2 : 0}
                            </span>
                            <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                            <span
                                data-si-qa-key="dashboard-data-assets-Buckets-decrease"
                                role="presentation"
                                className="cursor-pointer p-1"
                                onClick={() => {
                                    showSummaryDetails('aws_S3', 'deleted');
                                }}
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                    props?.type == 'bq_Dataset'
                                        ? 'Big Query Datasets - deleted'
                                        : 'S3 Buckets - deleted'
                                }
                            >
                                {s3Counts?.deleted ? s3Counts?.deleted : 0}
                            </span>
                        </div>
                        <div
                            data-si-qa-key="dashboard-data-assets-Buckets-total"
                            role="presentation"
                            className="font-small-semibold mt-2 pointer"
                            onClick={() => {
                                goToDataAssets('aws_S3');
                            }}
                        >
                            Total: {s3Counts?.total ? s3Counts?.total : props?.type == 'bq_Dataset' ? 4 : 0}
                        </div>
                    </div>
                </div>
                {props?.type == 'bq_Dataset' ? null : (
                    <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                        <div className="font-small-semibold mb-2">
                            RDS<br></br>Instances
                        </div>
                        <div className="font-base-family-poppins mb-1">
                            <div className="m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                <span
                                    data-si-qa-key="dashboard-data-assets-Instances-increase"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('aws_RelationalDatabaseService', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="RDS - created"
                                >
                                    {RDSCounts?.added ? RDSCounts?.added : 0}
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-data-assets-Instances-decrease"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('aws_RelationalDatabaseService', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="RDS - deleted"
                                >
                                    {RDSCounts?.deleted ? RDSCounts?.deleted : 0}
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-data-assets-Instances-total"
                                role="presentation"
                                className="font-small-semibold mt-2 pointer"
                                onClick={() => {
                                    goToDataAssets('aws_RDSInstance');
                                }}
                            >
                                Total: {RDSCounts?.total ? RDSCounts?.total : 0}
                            </div>
                        </div>
                    </div>
                )}
                {props?.type == 'bq_Dataset' ? null : (
                    <>
                        <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                            <div className="font-small-semibold mb-2">
                                RDS<br></br>Clusters
                            </div>
                            <div className="font-base-family-poppins mb-1 ">
                                <div className="m-1">
                                    <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-RDSCluster-increase"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_RDSCluster', 'created');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="RDSCluster - created"
                                    >
                                        {RDSClusterCounts?.added ? RDSClusterCounts?.added : 0}
                                    </span>
                                    <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-RDSCluster-decrease"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_RDSCluster', 'deleted');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="RDSCluster - deleted"
                                    >
                                        {RDSClusterCounts?.deleted ? RDSClusterCounts?.deleted : 0}
                                    </span>
                                </div>
                                <div
                                    data-si-qa-key="dashboard-data-assets-RDSCluster-total"
                                    role="presentation"
                                    className="font-small-semibold mt-2 pointer"
                                    onClick={() => {
                                        goToDataAssets('aws_RDSCluster');
                                    }}
                                >
                                    Total: {RDSClusterCounts?.total ? RDSClusterCounts?.total : 0}
                                </div>
                            </div>
                        </div>
                        <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                            <div className="font-small-semibold mb-2">Redshift Cluster</div>
                            <div className="font-base-family-poppins mb-1 ">
                                <div className="m-1">
                                    <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-Cluster-increase"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_RedshiftCluster', 'created');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Redshift Cluster - created"
                                    >
                                        {redShiftCounts?.added ? redShiftCounts?.added : 0}
                                    </span>

                                    <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-Cluster-decrease"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_RedshiftCluster', 'deleted');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Redshift Cluster - deleted"
                                    >
                                        {redShiftCounts?.deleted ? redShiftCounts?.deleted : 0}
                                    </span>
                                </div>
                                <div
                                    data-si-qa-key="dashboard-data-assets-Cluster-total"
                                    role="presentation"
                                    className="font-small-semibold mt-2 pointer"
                                    onClick={() => {
                                        goToDataAssets('aws_RedshiftCluster');
                                    }}
                                >
                                    Total: {redShiftCounts?.total ? redShiftCounts?.total : 0}
                                </div>
                            </div>
                        </div>
                        <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                            <div className="font-small-semibold mb-2">DynamoDB Tables</div>
                            <div className="font-base-family-poppins mb-1 ">
                                <div className="m-1">
                                    <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-dynamoDBTable-increase"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_DynamoDBTable', 'created');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="DynamoDBTable - created"
                                    >
                                        {dynamoDBTableCounts?.added ? dynamoDBTableCounts?.added : 0}
                                    </span>
                                    <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-dynamoDBTable-decrease"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_DynamoDBTable', 'deleted');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="DynamoDBTable - deleted"
                                    >
                                        {dynamoDBTableCounts?.deleted ? dynamoDBTableCounts?.deleted : 0}
                                    </span>
                                </div>
                                <div
                                    data-si-qa-key="dashboard-data-assets-dynamoDBTable-total"
                                    role="presentation"
                                    className="font-small-semibold mt-2 pointer"
                                    onClick={() => {
                                        goToDataAssets('aws_DynamoDBTable');
                                    }}
                                >
                                    Total: {dynamoDBTableCounts?.total ? dynamoDBTableCounts?.total : 0}
                                </div>
                            </div>
                        </div>
                        <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                            <div className="font-small-semibold mb-2">DynamoDB Exports</div>
                            <div className="font-base-family-poppins mb-1 ">
                                <div className="m-1">
                                    <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-dynamoDBExport-increase"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_DynamoDBExport', 'created');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="DynamoDBExport - created"
                                    >
                                        {dynamoDBExportCounts?.added ? dynamoDBExportCounts?.added : 0}
                                    </span>
                                    <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                    <span
                                        data-si-qa-key="dashboard-data-assets-dynamoDBExport-decrease"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('aws_DynamoDBExport', 'deleted');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="DynamoDBExport - deleted"
                                    >
                                        {dynamoDBExportCounts?.deleted ? dynamoDBExportCounts?.deleted : 0}
                                    </span>
                                </div>
                                <div
                                    data-si-qa-key="dashboard-data-assets-dynamoDBExport-total"
                                    role="presentation"
                                    className="font-small-semibold mt-2 pointer"
                                    onClick={() => {
                                        goToDataAssets('aws_DynamoDBExport');
                                    }}
                                >
                                    Total: {dynamoDBExportCounts?.total ? dynamoDBExportCounts?.total : 0}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {modalOpen && (
                <SummaryDetailsTable
                    type="data_assets"
                    accountId={accountId}
                    data={tableDetails}
                    loading={tableDetailsLoading}
                    idType={resourceType}
                    status={status}
                    open={modalOpen}
                    setOpen={setModalOpen}
                />
            )}
        </>
    );
};

export default NewDataDashboard;
