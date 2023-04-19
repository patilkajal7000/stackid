import CIcon from '@coreui/icons-react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { GCPSingleIdentityInsights } from 'shared/models/IdentityAccessModel';
import { UserAccessType } from 'shared/utils/Constants';
import { cilCheckCircle, cilChevronRight } from '@coreui/icons';

type InsightProps = {
    data: GCPSingleIdentityInsights | undefined;
    isLoading: boolean;
    translate: any;
};

const SingleGCPIdentityInsight = ({ data, isLoading, translate }: InsightProps) => {
    const [identitiesModal, setIdentitiesModal] = useState<typeof UserAccessType>();

    const showModal = (accessType: typeof UserAccessType) => {
        setIdentitiesModal(accessType);
    };

    const getArrowButton = (onClickArrow: () => void) => {
        return (
            <div
                role="presentation"
                className="btn-custom btn btn-link font-small-semibold p-0"
                onClick={() => onClickArrow()}
            >
                <CIcon icon={cilChevronRight} size="sm" />
            </div>
        );
    };

    const getYesOrNo = (value: boolean) => {
        return value ? (
            <div>
                <em className="icon icon-alert-danger icon-danger font-16 me-1" />
                Yes
            </div>
        ) : (
            <div>
                <CIcon icon={cilCheckCircle} className="icon icon-success mx-1" /> No
            </div>
        );
    };

    const getHeadings = (accessType: typeof UserAccessType, showArrow: boolean) => (
        <div className="d-flex align-items-center justify-content-center">
            {translate(accessType)}
            {showArrow &&
                getArrowButton(() => {
                    showModal(accessType);
                })}
        </div>
    );

    return (
        <>
            <div className="mt-3">
                {isLoading ? (
                    <div className="container d-flex justify-content-between">
                        <div className="w-25">
                            <Skeleton height={10} />
                            <Skeleton height={10} />
                        </div>
                        <div className="w-70">
                            <Skeleton height={25} />
                            <Skeleton height={25} />
                        </div>
                    </div>
                ) : (
                    data && (
                        <div className="container d-flex justify-content-between">
                            <div>
                                <div className="opacity-09 h5"> {data.identity_name} </div>
                                <div className="h6 opacity-08 text-capitalize">
                                    {translate('last_activity').toLowerCase()}:{' '}
                                    {data.last_activity && data.last_activity > -1
                                        ? dayjs.unix(data.last_activity).format('MMM Do, YYYY')
                                        : '-'}
                                </div>
                            </div>
                            <div className="w-70">
                                <table className="table custom-table insight-table rounded overflow-hidden">
                                    <thead>
                                        <tr>
                                            <th className="px-1">
                                                {' '}
                                                {getHeadings('programmatic_access', data.programmatic_access)}
                                            </th>
                                            <th className="px-1">
                                                {' '}
                                                {getHeadings('console_access', data.console_access)}
                                            </th>
                                            <th className="px-1"> {translate('can_impersonate_service_account')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{getYesOrNo(data.programmatic_access)}</td>
                                            <td>{getYesOrNo(data.console_access)}</td>
                                            <td>{getYesOrNo(data.can_impersonate_service_account)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}
            </div>
            <CustomModal
                size="xl"
                className="square-corner align-content-center"
                show={identitiesModal != undefined}
                onHide={() => {
                    setIdentitiesModal(undefined);
                }}
            >
                <>
                    {identitiesModal === UserAccessType.PROGRAMATIC_ACCESS && (
                        <div>
                            <div className="h3"> {translate('programmatic_access')} </div>
                            <div className="mt-4">
                                <table className="table custom-table info-table">
                                    <thead>
                                        <tr className="font-small-semibold">
                                            <th> {translate('access_id')}</th>
                                            <th> {translate('created_on')}</th>
                                            <th> {translate('status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>-</td>
                                            <td>- </td>
                                            <td> - </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {identitiesModal === UserAccessType.CONSOLE_ACCESS && (
                        <div>
                            <div className="h3"> {translate('login_access')} </div>
                            <div className="mt-4">
                                <table className="table custom-table info-table">
                                    <tbody>
                                        <tr>
                                            <td className="w-20 title"> {translate('password_last_used')} </td>
                                            <td> - </td>
                                        </tr>
                                        <tr>
                                            <td className="w-20 title"> {translate('created_on')} </td>
                                            <td>-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            </CustomModal>
        </>
    );
};

export default React.memo(SingleGCPIdentityInsight);
