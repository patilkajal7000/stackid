import React from 'react';
import { CCard, CCardBody, CCardFooter } from '@coreui/react';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import RiskPosture from '../risk_posture/RiskPosture';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCloudAction } from 'store/actions/CloudAccountActions';
import CIcon from '@coreui/icons-react';
import { cilChevronRight, cilFolder } from '@coreui/icons';
import { getActualSeverityColor } from 'shared/service/Severity.service';

type CloudAccountCardProps = {
    cloudAccounts: CloudAccountModel[];
    onSelectCloudAccount: (cloudAccount: CloudAccountModel) => void;
    t: any;
    isLoading: boolean;
};
const CloudAccountCard = ({ cloudAccounts, onSelectCloudAccount, t, isLoading }: CloudAccountCardProps) => {
    // const errorCheckingStatement = (cloudAccount: CloudAccountModel) =>
    //     cloudAccount.discovery_status.application_discovery_error_details ||
    //     cloudAccount.discovery_status.resource_discovery_error_details;

    const checkForModalShowing = (cloudAccount: CloudAccountModel) => {
        // 8th May - show cloud account on top row irrespective of any discovery errors
        // return cloudAccount?.discovery_status?.isDiscoveryComplete && cloudAccount.org_id != '1111111111';
        return cloudAccount.org_id != '1111111111' ? true : false;
    };

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const onRiskPage = (cloudAccount: any) => {
        const path: any = location?.pathname;
        dispatch(setSelectedCloudAction(cloudAccount.id));
        if (cloudAccount.cloud_provider === 'AWS') {
            navigate({
                pathname: `${path}/${cloudAccount.id}/${cloudAccount.cloud_provider}/Risks/Overview`,
            });
        }
    };

    const getDisplayCloudAccount = () => {
        const displayCloudAccount: CloudAccountModel[] = [];

        cloudAccounts.map((cloudAccount: CloudAccountModel) => {
            checkForModalShowing(cloudAccount) &&
                displayCloudAccount.length < 4 &&
                displayCloudAccount.push(cloudAccount);
        });

        if (displayCloudAccount.length > 0) {
            displayCloudAccount.sort((a, b) => b.account_risk_score - a.account_risk_score);
            return displayCloudAccount.map((cloudAccount: CloudAccountModel) => {
                return (
                    <CCard className="custom-card short-details-card mx-0 me-2 w-25" key={'card_' + cloudAccount.id}>
                        <CCardBody className="card-body-details pe-0">
                            <div className="d-flex card-bottom shadow-1 cloud-card-status me-2 pe-1">
                                <div
                                    style={{ color: getActualSeverityColor(cloudAccount?.risk_label) }}
                                    className={`font-x-small-bold ps-3 }`}
                                >
                                    {cloudAccount?.risk_label}
                                </div>
                                {/* <CIcon icon={cilSpeedometer} className="Critical-icon-color mx-2"></CIcon> */}
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100 mt-1">
                                <div>
                                    <div className="icon-bg-circle">
                                        <CIcon icon={cilFolder} size="xl" />
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-2 my-0">
                                    <div className="card-title my-0">{cloudAccount.name}</div>
                                    <div className="card-sub-text">
                                        {t('cloud_platform')}: {cloudAccount.cloud_provider}
                                    </div>
                                </div>
                                <div
                                    role={'presentation'}
                                    onClick={() => onRiskPage(cloudAccount)}
                                    className="card-sub-text d-flex pointer risk-meter"
                                >
                                    <RiskPosture cloudAccount={cloudAccount} t={t} showChart={false} top={`top--15`} />
                                </div>
                            </div>
                        </CCardBody>
                        <CCardFooter className="px-0 py-0">
                            <button
                                data-si-qa-key={`account-view-details-${cloudAccount.id}`}
                                type="button"
                                className="btn-custom btn btn-link font-small-semibold"
                                onClick={() => onSelectCloudAccount(cloudAccount)}
                            >
                                {t('view_details')}
                                <CIcon icon={cilChevronRight} className="ms-2" />
                            </button>
                        </CCardFooter>
                    </CCard>
                );
            });
        }
    };

    return (
        <div className="container-fluid mx-0 px-0 my-2">
            {isLoading ? (
                <div className="d-flex container">
                    <Skeleton width={200} height={120} className="mx-0 me-5" />
                    <Skeleton width={200} height={120} className="mx-0 me-5" />
                    <Skeleton width={200} height={120} className="mx-0 me-5" />
                    <Skeleton width={200} height={120} className="mx-0 me-5" />
                </div>
            ) : (
                <div className="d-flex container px-0">
                    {cloudAccounts && cloudAccounts.length > 0 ? getDisplayCloudAccount() : <></>}
                </div>
            )}
        </div>
    );
};

export default React.memo(CloudAccountCard);
