import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import { useDispatch } from 'react-redux';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { getIdentitySummaryDetails } from 'core/services/IdentitiesAPIService';
import SummaryDetailsTable from '../SummaryDetailsTable';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import { CTooltip } from '@coreui/react';

const MonthNewsDashboard = (props: any) => {
    const [tableDetails, setTableDetails] = useState<any>();
    const [tableDetailsLoading, setTableDetailsLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [idType, setIdType] = useState<any>();
    const [status, setStatus] = useState<any>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { type, orgId, accountId, interval, summaryCounts } = props;

    const [humanIds, setHumanIds] = useState<any>();
    const [appIds, setAppIds] = useState<any>();
    const [roleIds, setRoleIds] = useState<any>();
    const [federatedIds, setFederatedIds] = useState<any>();

    useEffect(() => {
        if (summaryCounts?.length) {
            summaryCounts?.map((data: any) => {
                if (data?.id_type === 'app_user') setAppIds(data?.counts);
                if (data?.id_type === 'human_user') setHumanIds(data?.counts);
                if (data?.id_type === 'role') setRoleIds(data?.counts);
                if (data?.id_type === 'federated') setFederatedIds(data?.counts);
            });
        }
    }, [summaryCounts]);

    const IdentitiesDetails = (type: string) => {
        const text: any = location.pathname;

        const path: any = text.replace('dashboard/aws_S3', '');
        dispatch(setTabsAction('', NAV_TABS_VALUE.IDENTITIES));

        navigate({
            pathname: `${path}identities/${type}`,
        });
    };

    const showSummaryDetails = (idType: any, status: any) => {
        setTableDetailsLoading(true);
        setModalOpen(true);
        setIdType(idType);
        setStatus(status);
        const body = {
            discoveryId: `${props.discoveryId}`,
            accountId: `${accountId}`,
            interval: interval,
            idType: idType, //human_user/app_user/federated/role/all   default value is all
            status: status === 'created' ? 'added' : status, //added/deleted/total   default value is total
        };
        getIdentitySummaryDetails(body, orgId)
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
        <div>
            <div data-si-qa-key="dashboard-identities-widget-total" className="h4 mb-4 mt-1 pt-2">
                <CTooltip
                    content="An identity is a unique name with which we can identify a human or a thing in a given system."
                    placement="left"
                >
                    <span>Identities:</span>
                </CTooltip>{' '}
                {summaryCounts &&
                    (humanIds?.total || 0) + (appIds?.total || 0) + (roleIds?.total || 0) + (federatedIds?.total || 0)}
            </div>
            {summaryCounts && (
                <div className="d-flex">
                    <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                        <div className="font-small-semibold mb-2">Human</div>
                        <div className="font-base-family-poppins mb-2">
                            <div className="m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                <span
                                    data-si-qa-key="dashboard-identities-human-increase"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('human_user', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Human Identities - created"
                                >
                                    {humanIds?.added ? humanIds?.added : props?.type == 'bq_Dataset' ? 2 : 0}
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-identities-human-decrease"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('human_user', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Human Identities - deleted"
                                >
                                    {humanIds?.deleted ? humanIds?.deleted : 0}
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-identities-human-total"
                                role="presentation"
                                className="font-small-semibold mt-2 pointer"
                                onClick={() => IdentitiesDetails(IdentityType.AwsIAMUserHuman)}
                            >
                                Total: {humanIds?.total ? humanIds?.total : props?.type == 'bq_Dataset' ? 12 : 0}
                            </div>
                        </div>
                    </div>
                    <div className="me-2 w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                        <div className="font-small-semibold mb-2">Application</div>
                        <div className="font-base-family-poppins mb-2">
                            <div className="m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                <span
                                    data-si-qa-key="dashboard-identities-application-increase"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('app_user', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Application Identities - created"
                                >
                                    {appIds?.added ? appIds?.added : props?.type == 'bq_Dataset' ? 1 : 0}
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                <span
                                    data-si-qa-key="dashboard-identities-application-decrease"
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('app_user', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Application Identities - deleted"
                                >
                                    {appIds?.deleted ? appIds?.deleted : 0}
                                </span>
                            </div>
                            <div
                                data-si-qa-key="dashboard-identities-application-total"
                                role="presentation"
                                className="font-small-semibold mt-2 pointer"
                                onClick={() => IdentitiesDetails(IdentityType.AwsIAMUserApplication)}
                            >
                                Total: {appIds?.total ? appIds?.total : props?.type == 'bq_Dataset' ? 22 : 0}
                            </div>
                        </div>
                    </div>
                    {type == 'bq_Dataset' ? null : (
                        <div className="me-2  w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                            <div className="font-small-semibold mb-2">Roles</div>
                            <div className="font-base-family-poppins mb-2">
                                <div className="m-1">
                                    <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                    <span
                                        data-si-qa-key="dashboard-identities-roles-increase"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('role', 'created');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Roles - created"
                                    >
                                        {roleIds?.added ? roleIds?.added : 0}
                                    </span>
                                    <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                    <span
                                        data-si-qa-key="dashboard-identities-roles-decrease"
                                        role="presentation"
                                        className="cursor-pointer p-1"
                                        onClick={() => {
                                            showSummaryDetails('role', 'deleted');
                                        }}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Roles - deleted"
                                    >
                                        {roleIds?.deleted ? roleIds?.deleted : 0}
                                    </span>
                                </div>
                                <div
                                    data-si-qa-key="dashboard-identities-roles-total"
                                    role="presentation"
                                    className="font-small-semibold mt-2 pointer"
                                    onClick={() => IdentitiesDetails(IdentityType.AwsIAMRole)}
                                >
                                    Total: {roleIds?.total ? roleIds?.total : 0}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-25 d-flex flex-column justify-content-between text-center border rounded p-2">
                        <div className="font-small-semibold mb-2">Federated</div>
                        <div className="font-base-family-poppins mb-2">
                            <div className="m-1">
                                <CIcon icon={cilArrowTop} size="sm" className={`text-success`} />
                                <span
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('federated', 'created');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Federated - created"
                                >
                                    <span data-si-qa-key="dashboard-identities-fed-increase">
                                        {federatedIds?.added
                                            ? federatedIds?.added
                                            : props?.type == 'bq_Dataset'
                                            ? 2
                                            : 0}
                                    </span>
                                </span>
                                <CIcon icon={cilArrowBottom} size="sm" className={`text-danger`} />
                                <span
                                    role="presentation"
                                    className="cursor-pointer p-1"
                                    onClick={() => {
                                        showSummaryDetails('federated', 'deleted');
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Federated - deleted"
                                >
                                    <span data-si-qa-key="dashboard-identities-fed-decrease">
                                        {federatedIds?.deleted ? federatedIds?.deleted : 0}
                                    </span>
                                </span>
                            </div>
                            <div
                                role="presentation"
                                className="font-small-semibold mt-2 pointer"
                                onClick={() => IdentitiesDetails(IdentityType.AwsFederated)}
                            >
                                <span data-si-qa-key="dashboard-identities-fed-total">
                                    Total:{' '}
                                    {federatedIds?.total ? federatedIds?.total : props?.type == 'bq_Dataset' ? 2 : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalOpen && (
                <SummaryDetailsTable
                    type="identities"
                    accountId={accountId}
                    data={tableDetails}
                    loading={tableDetailsLoading}
                    idType={idType}
                    status={status}
                    open={modalOpen}
                    setOpen={setModalOpen}
                />
            )}
        </div>
    );
};

export default MonthNewsDashboard;
