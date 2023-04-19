import React, { useCallback, useEffect, useState } from 'react';
import {
    getAllCloudAccountsWithDiscoveryStatus,
    startCloudAccountDiscovery,
} from 'core/services/CloudaccountsAPIService';
import { useLocation, useNavigate } from 'react-router';
import { CLOUDACCOUNTADD, CLOUDACCOUNTINITIALSETUP } from '..';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { useDispatch, useSelector } from 'react-redux';
import { setCloudAccountsAction, setSelectedCloudAction } from 'store/actions/CloudAccountActions';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { ToastVariant } from 'shared/utils/Constants';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { AppState } from 'store/store';
import { getDiscoveryStatus } from 'shared/service/ServerSentEvents';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import StepperComponent from 'shared/components/stepper/StepperComponent';
import CloudAccountCard from '../component/cloud_account_card/CloudAccountCard';
import TableComponent from '../component/table_component/TableComponent';
import { INVENTORY_URL } from 'modules/single_account';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CCardBody, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMinus, cilPlus, cilWarning } from '@coreui/icons';
// import { Accordion } from 'react-bootstrap';

const CloudAccounts = () => {
    // const [cloudAccountListOriginal, setCloudAccountListOriginal] = useState<CloudAccountModel[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const [discoveryintervals, setDiscoveryIntervals] = useState<NodeJS.Timeout>();
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [selectedCloudAccount, setSelectedCloudAccount] = useState<CloudAccountModel>();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [, setShowOrganisationDetailsModal] = useState(false);
    const [yourAccounts, setYourAccounts] = useState<any>([]);
    const [stackAccounts, setStackAccounts] = useState<any>([]);
    const cloudAccounts = useSelector((state: AppState) => state.cloudAccountState.cloudAccounts);
    const [arrow, setArrow] = useState<any>(false);

    const CloudAccountTableOne = (cloudAccount: CloudAccountModel) => {
        return cloudAccount.org_id !== '1111111111' ? true : false;
    };
    const CloudAccountTableTwo = (cloudAccount: CloudAccountModel) => {
        return cloudAccount.org_id === '1111111111' ? true : false;
    };

    useEffect(() => {
        const displayCloudAccountTableOne: CloudAccountModel[] = [];
        const displayCloudAccountTableTwo: CloudAccountModel[] = [];
        cloudAccounts.map((cloudAccount: CloudAccountModel) => {
            CloudAccountTableOne(cloudAccount) && displayCloudAccountTableOne.push(cloudAccount);
            CloudAccountTableTwo(cloudAccount) && displayCloudAccountTableTwo.push(cloudAccount);
        });
        setYourAccounts(displayCloudAccountTableOne);
        setStackAccounts(displayCloudAccountTableTwo);
    }, [cloudAccounts]);

    useEffect(() => {
        dispatch(setTabsAction('', '', '')); //to hide subheader
        dispatch(setBreadcrumbAction([])); //to hide breadcrumb
        getCloudAccounts();
    }, []);

    useEffect(() => {
        return () => {
            if (discoveryintervals) {
                clearInterval(discoveryintervals);
            }
        };
    }, [discoveryintervals]);

    const getCloudAccounts = () => {
        setIsLoading(true);
        getAllCloudAccountsWithDiscoveryStatus()
            .then((response: any) => {
                const cloudAccounts = response as CloudAccountModel[];

                if (cloudAccounts.length > 0) {
                    // setCloudAccountListOriginal(cloudAccounts);
                    dispatch(setCloudAccountsAction(cloudAccounts));
                    setIsLoading(false);
                    const cloudAccountDiscoveryStatusId: any = [];
                    cloudAccounts.map((cloudAccount: CloudAccountModel) => {
                        if (!cloudAccount?.discovery_status?.isDiscoveryComplete) {
                            cloudAccountDiscoveryStatusId.push(cloudAccount.id);
                        }
                    });
                    if (cloudAccountDiscoveryStatusId.length > 0) {
                        discoveryStatusPollService(cloudAccountDiscoveryStatusId.toString());
                    }
                } else {
                    navigate(CLOUDACCOUNTINITIALSETUP);
                }
            })
            .catch(() => setIsLoading(false));
    };

    const onAddNewAccount = () => {
        navigate(CLOUDACCOUNTADD);
    };

    const onSelectCloudAccount = (cloudAccount: CloudAccountModel) => {
        if (!cloudAccount.latest_discovery_id) {
            setSelectedCloudAccount(cloudAccount);
            if (
                cloudAccount?.discovery_status?.isDiscoveryComplete &&
                (cloudAccount.discovery_status?.application_discovery_error_details ||
                    cloudAccount.discovery_status?.resource_discovery_error_details)
            ) {
                setShowErrorModal(true);
            } else {
                setShowProgressModal(true);
            }
        } else {
            dispatch(setSelectedCloudAction(cloudAccount.id));
            let resourceType = 'aws_S3';
            if (cloudAccount.cloud_provider == 'GCP') {
                resourceType = 'bq_Dataset';
            }
            //TODO Route check state pass varible
            const url = `${location.pathname}/${cloudAccount.id}/${cloudAccount.cloud_provider}/dashboard/${resourceType}`;
            //   navigate({
            //         pathname: url,
            //         {state: { test: 'test'}})
            //     //     state: cloudAccount.discovery_status.end_time?.APPLICATION_DISCOVERY,
            //     // });
            navigate({ pathname: url });
        }
    };

    const onResourceInventory = (cloudAccount: CloudAccountModel) => {
        if (!cloudAccount.latest_discovery_id) {
            setSelectedCloudAccount(cloudAccount);
            if (
                cloudAccount?.discovery_status?.isDiscoveryComplete &&
                (cloudAccount.discovery_status?.application_discovery_error_details ||
                    cloudAccount.discovery_status?.resource_discovery_error_details)
            ) {
                setShowErrorModal(true);
            } else {
                setShowProgressModal(true);
            }
        } else {
            dispatch(setSelectedCloudAction(cloudAccount.id));
            let resourceType;
            if (cloudAccount.cloud_provider == 'GCP') {
                resourceType = 'bq_Dataset';
            }
            console.log(resourceType);
            navigate(INVENTORY_URL);
        }
    };

    const onStartDiscovery = (cloudAccount: CloudAccountModel) => {
        startCloudAccountDiscovery(cloudAccount.id).then((resp: any) => {
            setShowErrorModal(false);
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, resp + ': ' + cloudAccount.name));
            getCloudAccounts();
        });
    };

    /**
     * Deprecated will replace this with webhooks when refactor in place of polling
     */
    /**
     * Method for subscribing to SSE(Server Sent Events)
     * @param id: string of cloudccountid whose discovery has started
     */
    // const subscribeDiscoveryStatus = useCallback(
    //     (id: any) => {
    //         const eventSource = subscribeDiscoveryStatusService(id, dispatch, accessToken);
    //         setSource(eventSource);
    //     },
    //     [source],
    // );

    const discoveryStatusPollService = useCallback(
        (ids: any) => {
            const intervals = getDiscoveryStatus(ids, dispatch);
            setDiscoveryIntervals(intervals);
        },
        [discoveryintervals],
    );

    const onShowProgress = (cloudAccount: CloudAccountModel) => {
        setSelectedCloudAccount(cloudAccount);
        setShowProgressModal(true);
    };

    // const onSearchCloudAccount = (e: any) => {
    //     setCloudAccountList(
    //         cloudAccountListOriginal.filter((item: any) =>
    //             item.name.toLowerCase().includes(e.target.value.toLowerCase()),
    //         ),
    //     );
    // };

    const onShowErrorModal = (cloudAccount: CloudAccountModel, e: any) => {
        e.stopPropagation();
        setSelectedCloudAccount(cloudAccount);
        setShowErrorModal(true);
    };

    const onViewClick = (cloudAccount: CloudAccountModel) => {
        setSelectedCloudAccount(cloudAccount);
        setShowOrganisationDetailsModal(true);
    };

    const getErrorModalDetails = (cloudAccount: CloudAccountModel) => (
        <div>
            <div className="font-small-semibold"> {cloudAccount?.name}</div>
            <div className="float-end">
                <div className="font-small-semibold text-info">
                    <CIcon icon={cilWarning} className="me-2 text-neutral-600 pointer" />
                    {t('error_statment_1')}
                </div>
            </div>
        </div>
    );

    // const getOrganisationDetails = (cloudAccount: CloudAccountModel) => (
    //     <div>
    //         <div className="h3 text-black"> {t('organisation_hierarchy')}</div>
    //         <div className="font-small-semibold text-neutral-900 mt-4"> Org 123 - Project SI-dev - project 5 - project 52783 </div>
    //     </div>
    // );

    return (
        <div className="pt-4 mx-0">
            <CustomModal
                show={showProgressModal ? true : false}
                onHide={() => setShowProgressModal(false)}
                className="square-corner"
            >
                {selectedCloudAccount && <StepperComponent selectedCloudAccountid={selectedCloudAccount.id} t={t} />}
            </CustomModal>
            <CustomModal
                show={showErrorModal ? true : false}
                onHide={() => setShowErrorModal(false)}
                className="square-corner"
            >
                {selectedCloudAccount && getErrorModalDetails(selectedCloudAccount)}
            </CustomModal>
            {/* <CustomModal show={showOrganisationDetailsModal} onHide={() => setShowOrganisationDetailsModal(false)} className="square-corner">
                {selectedCloudAccount && getOrganisationDetails(selectedCloudAccount)}
            </CustomModal> */}
            <div className="container-fluid mx-0 my-2">
                <div className="d-flex justify-content-between flex-start align-items-center mb-2 container p-0">
                    <h4>{t('cloudaccount')}</h4>
                    <div>
                        <CTooltip trigger="hover" placement="bottom" content={t('add_account')}>
                            <button
                                type="button"
                                className="btn btn-custom-link ps-4 position-relative text-white"
                                onClick={onAddNewAccount}
                            >
                                <span className=" position-absolute ms--20 t-8">
                                    <CIcon icon={cilPlus} size="lg" />
                                </span>
                                {t('add_account')}
                            </button>
                        </CTooltip>
                    </div>
                </div>
            </div>
            <CloudAccountCard
                t={t}
                cloudAccounts={cloudAccounts}
                onSelectCloudAccount={onSelectCloudAccount}
                isLoading={isLoading}
            />
            <div className="container-fluid header-background mt-4">
                <div className="container d-flex justify-content-between px-1">
                    <div className="py-2 font-small-semibold">
                        {t('your_cloud_account')} ({yourAccounts.length > 0 ? yourAccounts.length : '0'})
                    </div>
                </div>
            </div>

            <TableComponent
                onAddNewAccount={onAddNewAccount}
                isLoading={isLoading}
                cloudAccounts={yourAccounts}
                onSelectCloudAccount={onSelectCloudAccount}
                onResourceInventory={onResourceInventory}
                onStartDiscovery={onStartDiscovery}
                onShowProgress={onShowProgress}
                t={t}
                showErrorModal={onShowErrorModal}
                onViewClick={onViewClick}
            />

            <CAccordion className="no-arrow-accordion">
                <CAccordionItem className="border-0 p-0" itemKey="0">
                    <CAccordionHeader
                        className="border-0 master-btn accordion-toggle w-100 bg-transparent"
                        onClick={() => setArrow(!arrow)}
                    >
                        <div className="container d-flex justify-content-between px-1">
                            <div className=" py-2 font-small-semibold">
                                {t('stack_cloud_account')} ({stackAccounts.length > 0 ? stackAccounts.length : '0'})
                            </div>
                            <div className="pt-2">
                                <span className="plus-minus">
                                    {arrow ? <CIcon icon={cilMinus}></CIcon> : <CIcon icon={cilPlus}></CIcon>}
                                </span>
                            </div>
                        </div>
                    </CAccordionHeader>
                    <CAccordionBody className="p-0">
                        <CCardBody className="p-0 pb-1 ">
                            {arrow && (
                                <TableComponent
                                    isLoading={isLoading}
                                    cloudAccounts={stackAccounts}
                                    onSelectCloudAccount={onSelectCloudAccount}
                                    onResourceInventory={onResourceInventory}
                                    onStartDiscovery={onStartDiscovery}
                                    onShowProgress={onShowProgress}
                                    t={t}
                                    showErrorModal={onShowErrorModal}
                                    onViewClick={onViewClick}
                                />
                            )}
                        </CCardBody>
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>
        </div>
    );
};

export default CloudAccounts;
