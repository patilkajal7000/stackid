import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import RiskPosture from '../risk_posture/RiskPosture';

import { CProgress, CProgressBar, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { checkForDiscoveryStatusValue } from 'shared/service/AppService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCloudAction } from 'store/actions/CloudAccountActions';
import CIcon from '@coreui/icons-react';
import { cilInfo, cilOptions, cilPlus } from '@coreui/icons';
import dayjs from 'dayjs';
import { getRiskAssesmentReport } from 'core/services/DataEndpointsAPIService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
type TableComponentProps = {
    onAddNewAccount?: any;
    isLoading: boolean;
    t: any;
    cloudAccounts: CloudAccountModel[];
    onSelectCloudAccount: (cloudAccount: CloudAccountModel) => void;
    onResourceInventory: (cloudAccount: CloudAccountModel) => void;
    onStartDiscovery: (cloudAccount: CloudAccountModel) => void;
    onShowProgress: (cloudAccount: CloudAccountModel) => void;
    showErrorModal: (cloudAccount: CloudAccountModel, e: any) => void;
    onViewClick: (cloudAccount: CloudAccountModel) => void;
};

const lastActive = (time: any) => {
    return dayjs(parseInt(time) * 1000).format('DD MMM YY | hh:mm a');
};

const TableComponent = ({
    onAddNewAccount,
    isLoading,
    t,
    cloudAccounts,
    onSelectCloudAccount,
    onResourceInventory,
    onStartDiscovery,
    onShowProgress,
    showErrorModal,
}: TableComponentProps) => {
    const [selectedDropdown, setSelectedDropdown] = useState<CloudAccountModel | undefined>();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onRiskPage = (cloudAccount: any, e: any) => {
        e.stopPropagation();
        const path: any = location?.pathname;
        dispatch(setSelectedCloudAction(cloudAccount.id));

        if (cloudAccount.cloud_provider === 'AWS') {
            navigate({
                pathname: `${path}/${cloudAccount.id}/${cloudAccount.cloud_provider}/Risks/Overview`,
            });
        }
    };

    const errorCheckingStatement = (cloudAccount: CloudAccountModel) =>
        cloudAccount.discovery_status.application_discovery_error_details ||
        cloudAccount.discovery_status.resource_discovery_error_details;

    const getDiscoveryStatus = (cloudAccount: CloudAccountModel) => {
        return cloudAccount?.discovery_status?.isDiscoveryComplete ? (
            errorCheckingStatement(cloudAccount) ? (
                <div onClick={(e) => showErrorModal(cloudAccount, e)} role="presentation">
                    <div className="text-info">
                        <CIcon icon={cilInfo} className="me-2 text-neutral-600 pointer" />
                        {t('scan_information')}
                    </div>
                    <div className=" mt-1">
                        {t('discovery_completed_on')}
                        {`  ${
                            cloudAccount.last_scan_event_ts
                                ? lastActive(cloudAccount?.last_scan_event_ts)
                                : 'Loading...'
                        }`}
                    </div>
                </div>
            ) : (
                <div className="">
                    {t('discovery_completed_on')}
                    {`  ${
                        cloudAccount.last_scan_event_ts ? lastActive(cloudAccount?.last_scan_event_ts) : 'Loading...'
                    }`}
                </div>
            )
        ) : (
            <div onClick={() => onShowProgress(cloudAccount)} role="presentation">
                <div className="d-flex align-items-center">
                    <div>{t('discovery_ongoing')}</div>
                    <CProgress className="w-20 mx-2">
                        <CProgressBar
                            color="success"
                            value={(checkForDiscoveryStatusValue(cloudAccount.discovery_status) + 1) * 33}
                            animated
                            variant="striped"
                        />
                    </CProgress>
                </div>
                <div className="">
                    {t('discovery_completed_on')}
                    {`  ${
                        cloudAccount.last_scan_event_ts ? lastActive(cloudAccount?.last_scan_event_ts) : 'Loading...'
                    }`}
                </div>
            </div>
        );
    };

    const checkForModalShowing = (cloudAccount: CloudAccountModel, e: any) => {
        return cloudAccount?.discovery_status?.isDiscoveryComplete
            ? errorCheckingStatement(cloudAccount)
                ? e.stopPropagation()
                : null
            : e.stopPropagation();
    };

    const b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
        const byteCharacters = window.atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    function checkForMIMEType(cloudAccount: any) {
        getRiskAssesmentReport(cloudAccount.id, cloudAccount.org_id)
            .then((response: any) => {
                if (response == 'Report is scheduled, please try again in 15 minutes') {
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.WARNING,
                            'Report is scheduled, please try again in 15 minutes.',
                        ),
                    );
                } else if (response == 'This feature coming soon') {
                    dispatch(setToastMessageAction(ToastVariant.DANGER, 'This feature is coming soon.'));
                } else {
                    const blob = b64toBlob(
                        response,
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    );

                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'RiskAssesmentReport.docx';
                    link.href = blobUrl;
                    link.click();

                    dispatch(
                        setToastMessageAction(
                            ToastVariant.SUCCESS,
                            'RiskAssesmentReport.docx downloaded successfully.',
                        ),
                    );
                }
            })
            .catch((error: any) => {
                console.log('in error', error);
            });
    }

    return (
        <div className="container-fluid my-4">
            <table className="table table-borderless table-hover container custom-table shadow-6 rounded">
                <thead className="font-small-semibold">
                    <tr className="border-bottom">
                        <th className="ps-4 w-30 no-pointer" title={t('name')}>
                            {t('name')}
                        </th>
                        <th className="w-20 no-pointer text-center" title={t('risk_posture')}>
                            {t('risk_posture')}
                        </th>
                        <th className="w-20 no-pointer" title={t('cloud_platform') + ' ' + t('id')}>
                            {t('cloud_platform')} ({t('id')})
                        </th>
                        <th className="w-20 no-pointer" title={t('discovery_status')}>
                            {t('discovery_status')}
                        </th>
                        <th className="w-10 no-pointer text-center" title={t('action') + 's'}>
                            {t('action') + 's'}
                        </th>
                    </tr>
                </thead>
                <tbody className="font-small">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="">
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : cloudAccounts && cloudAccounts.length > 0 ? (
                        cloudAccounts.map((cloudAccount: CloudAccountModel, index: number) => (
                            <tr
                                key={index}
                                onClick={() => onSelectCloudAccount(cloudAccount)}
                                className={`cursor-pointer ${
                                    cloudAccounts.length - 1 !== index ? 'border-bottom' : ''
                                } `}
                            >
                                <td className="ps-4" data-si-qa-key={`account-name-${cloudAccount?.id}`}>
                                    {cloudAccount?.name}
                                </td>

                                <td className="px-2 py-0 pb-1 text-center">
                                    <div
                                        data-si-qa-key={`account-risk-posture-${cloudAccount.id}`}
                                        role="presentation"
                                        onClick={(e) => onRiskPage(cloudAccount, e)}
                                        onKeyDown={() => {
                                            return false;
                                        }}
                                        className={`d-flex align-items-center flex-column`}
                                    >
                                        <RiskPosture cloudAccount={cloudAccount} t={t} top={`top--7`} />
                                    </div>
                                </td>
                                <td className="px-2">
                                    <div className="">
                                        {cloudAccount.cloud_provider} (
                                        {cloudAccount?.cloud_provider === 'AWS'
                                            ? cloudAccount.account_details?.Account
                                            : cloudAccount?.name}
                                        )
                                    </div>
                                </td>
                                <td
                                    className="px-2"
                                    onClick={(e: any) => checkForModalShowing(cloudAccount, e)}
                                    role="presentation"
                                >
                                    <div className="">{getDiscoveryStatus(cloudAccount)}</div>
                                </td>
                                <td
                                    align="center"
                                    role="presentation"
                                    className="px-2 action-drop"
                                    onClick={(e: any) => {
                                        setSelectedDropdown(cloudAccount);
                                        e.stopPropagation();
                                    }}
                                >
                                    <CDropdown
                                        visible={selectedDropdown?.id === cloudAccount.id}
                                        placement="bottom-end"
                                    >
                                        <CDropdownToggle
                                            caret={false}
                                            className="py-0 px-0 dropdown-toggle-action shadow-none"
                                        >
                                            <CIcon
                                                icon={cilOptions}
                                                style={{ rotate: '90deg' }}
                                                className="secondary-color"
                                            />
                                        </CDropdownToggle>
                                        <CDropdownMenu className="pt-0" style={{ margin: 0 }}>
                                            <CDropdownItem
                                                data-si-qa-key={`account-dropdown-start-discovery`}
                                                onClick={(e: any) => {
                                                    onStartDiscovery(cloudAccount);
                                                    setSelectedDropdown(undefined);
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {t('start_discovery')}
                                            </CDropdownItem>
                                            <CDropdownItem
                                                data-si-qa-key={`account-dropdown-view-resource-inventory`}
                                                onClick={(e: any) => {
                                                    onResourceInventory(cloudAccount);
                                                    setSelectedDropdown(undefined);
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {t('view_resource_inventory')}
                                            </CDropdownItem>
                                            <CDropdownItem
                                                data-si-qa-key={`account-dropdown-Download-Risk-Assessment-Report`}
                                                onClick={(e: any) => {
                                                    checkForMIMEType(cloudAccount);
                                                    setSelectedDropdown(undefined);
                                                    e.stopPropagation();
                                                }}
                                            >
                                                Download Risk Assessment Report
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>
                                <div className="d-flex justify-content-center align-items-center font-medium-semibold">
                                    {t('no_cloudaccount')}
                                    <span className=" position-absolute icon-bg-circle-outline ms-4">
                                        <CIcon icon={cilPlus} size="lg" />
                                    </span>
                                    <button
                                        data-si-qa-key={`account-add-button`}
                                        type="button"
                                        className="btn btn-custom btn-link pe-0 ps-4 ms-4"
                                        onClick={onAddNewAccount}
                                        title={'Add Your Cloud Account'}
                                    >
                                        {t('add_your_account')}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(TableComponent);
