import React, { useEffect, useState } from 'react';
import { getAppSummaryDetails } from 'core/services/IdentitiesAPIService';
import { AxiosError } from 'axios';
import SummaryDetailsTable from '../SummaryDetailsTable';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';

const TotalIdentityRisk = (props: any) => {
    const { data, orgId, accountId, interval } = props;
    const [compute, setCompute] = useState<any>();
    const [serverless, setServerless] = useState<any>();
    const [tableDetails, setTableDetails] = useState<any>();
    const [tableDetailsLoading, setTableDetailsLoading] = useState<boolean>(false);
    const [applicationType, setApplicationType] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<any>();

    useEffect(() => {
        if (data.length) {
            data?.map((data: any) => {
                if (data?.application_type === 'compute') setCompute(data?.counts);
                if (data?.application_type === 'serverless') setServerless(data?.counts);
            });
        }
    }, [data]);

    const showSummaryDetails = (applicationType: any, status: any) => {
        setTableDetailsLoading(true);
        setModalOpen(true);
        setApplicationType(applicationType);
        setStatus(status);

        const body = {
            discoveryId: `${props.discoveryId}`,
            accountId: `${accountId}`,
            interval: interval,
            applicationType: applicationType, //compute/serverless/all   default value is all
            status: status === 'created' ? 'added' : status, //added/deleted/total   default value is total
        };
        getAppSummaryDetails(body, orgId)
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
            <div>
                <div data-si-qa-key="dashboard-application-total" className="h4 my-0 mb-4 pt-2">
                    Applications: {(compute?.total || 0) + (serverless?.total || 0)}
                </div>
                <div className="d-flex justify-content-between">
                    <div className="p-2 w-30 d-flex flex-column text-center border rounded">
                        <div className="font-small-semibold mb-2"> Compute </div>
                        <div className="font-base-family-poppins mb-2 ">
                            <div className="font-small-semibold m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={` text-success`} />
                                <span
                                    data-si-qa-key="dashboard-application-compute-increase"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('compute', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Compute - created"
                                >
                                    {compute?.added ? compute?.added : 0}
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={` text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-application-compute-decrease"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('compute', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Compute - deleted"
                                >
                                    {compute?.deleted ? compute?.deleted : 0}
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-application-compute-total"
                                className="font-small-semibold mt-2"
                            >
                                Total: {compute?.total ? compute?.total : 0}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 w-30 d-flex flex-column text-center border rounded">
                        <div className="font-small-semibold mb-2">Serverless</div>
                        <div className="font-base-family-poppins mb-2">
                            <div className="font-small-semibold m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={` text-success`} />
                                <span
                                    data-si-qa-key="dashboard-application-serverless-increase"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('serverless', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Serverless - created"
                                >
                                    {serverless?.added ? serverless?.added : 0}
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={` text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-application-serverless-decrease"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('serverless', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Serverless - deleted"
                                >
                                    {serverless?.deleted ? serverless?.deleted : 0}
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-application-serverless-total"
                                className="font-small-semibold mt-2"
                            >
                                Total: {serverless?.total ? serverless?.total : 0}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 w-30 d-flex flex-column text-center border rounded">
                        <div className="font-small-semibold mb-2">Container</div>
                        <div className="font-base-family-poppins mb-2">
                            <div className="font-small-semibold m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={` text-success`} />
                                <span
                                    data-si-qa-key="dashboard-application-container-increase"
                                    className="cursor-pointer p-1"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Container - created"
                                >
                                    N/A
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={` text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-application-container-decrease"
                                    className="cursor-pointer p-1"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Container - deleted"
                                >
                                    N/A
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-application-container-total"
                                className="font-small-semibold mt-2"
                            >
                                Total: N/A
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <SummaryDetailsTable
                    type="applications"
                    accountId={accountId}
                    data={tableDetails}
                    loading={tableDetailsLoading}
                    idType={applicationType}
                    status={status}
                    open={modalOpen}
                    setOpen={setModalOpen}
                />
            )}
        </>
    );
};

export default TotalIdentityRisk;
