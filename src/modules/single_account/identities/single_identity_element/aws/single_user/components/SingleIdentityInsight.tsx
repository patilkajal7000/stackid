import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { IdentityType, SingleIdentityInsightDetails } from 'shared/models/IdentityAccessModel';
import { UserAccessType } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilChevronRight } from '@coreui/icons';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { CTooltip } from '@coreui/react';
dayjs.extend(advancedFormat);

type InsightProps = {
    data: SingleIdentityInsightDetails | undefined;
    isLoading: boolean;
    translate: any;
};

const SingleIdentityInsight = ({ data, isLoading, translate }: InsightProps) => {
    const [identitiesModal, setIdentitiesModal] = useState<typeof UserAccessType>();
    const showModal = (accessType: typeof UserAccessType) => {
        setIdentitiesModal(accessType);
    };

    const getArrowButton = (onClickArrow: () => void) => {
        return (
            <div
                role="presentation"
                className="btn-custom btn btn-link font-small-semibold p-0 ms-1"
                onClick={() => onClickArrow()}
                data-si-qa-key={`identities-popup-arrow-btn`}
            >
                <CIcon icon={cilChevronRight} size="sm" />
            </div>
        );
    };

    const getYesOrNo = (value: boolean) => {
        return value ? (
            <div>
                <em className="icon icon-alert-danger icon-danger font-16 me-2" />
                Yes
            </div>
        ) : (
            <div>
                <CIcon icon={cilCheckCircle} className="icon icon-success mx-2" />
                No
            </div>
        );
    };
    const MFAEnabled = (value: boolean) => {
        return value ? (
            <div>
                <CIcon icon={cilCheckCircle} className="icon icon-success mx-2" />
                Yes
            </div>
        ) : (
            <div>
                <em className="icon icon-alert-danger icon-danger font-16 me-2" />
                No
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
                        <div className="container p-0 d-flex justify-content-between">
                            <div>
                                <div className="opacity-09 h5"> {data.identityName} </div>
                                <div className="h6 opacity-08">
                                    {data?.identityType === IdentityType.AwsIAMRole
                                        ? translate('role')
                                        : translate('user')}{' '}
                                    {translate('created_on').toLowerCase()}:
                                    {data.createdOn && dayjs(data.createdOn).format('MMM Do, YYYY')}
                                </div>
                            </div>
                            {(data.identityType.includes(IdentityType.AwsIAMUser) ||
                                data.identityType.includes(IdentityType.AwsFederated)) && (
                                <div className="w-70">
                                    <table className="table custom-table insight-table rounded overflow-hidden">
                                        <thead>
                                            <tr>
                                                <CTooltip content="Multi factor authentication">
                                                    <th className="px-1">
                                                        {getHeadings(UserAccessType.MFA_ENABLED, false)}
                                                    </th>
                                                </CTooltip>
                                                <th className="px-1">
                                                    {getHeadings(
                                                        UserAccessType.PROGRAMATIC_ACCESS,
                                                        data.isProgramaticAccess,
                                                    )}
                                                </th>
                                                {(data.identityType === IdentityType.AwsIAMUserHuman ||
                                                    data.identityType === IdentityType.AwsFederated) && (
                                                    <th className="px-1">
                                                        {getHeadings(UserAccessType.LOGIN_ACCESS, data.isConsoleAccess)}
                                                    </th>
                                                )}
                                                <th className="px-1">
                                                    {getHeadings(UserAccessType.ASSUME_ROLE, data.isCanAssumeRole)}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-1">
                                                    <span data-si-qa-key={`identities-mfa-enabled`}>
                                                        {MFAEnabled(data.isMFAEnabled)}
                                                    </span>
                                                </td>
                                                <td className="px-1">
                                                    <span data-si-qa-key={`identities-programatic-access`}>
                                                        {getYesOrNo(data.isProgramaticAccess)}
                                                    </span>
                                                </td>
                                                {(data.identityType === IdentityType.AwsIAMUserHuman ||
                                                    data.identityType === IdentityType.AwsFederated) && (
                                                    <td className="px-1">
                                                        <span data-si-qa-key={`identities-console-access`}>
                                                            {getYesOrNo(data.isConsoleAccess)}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-1">
                                                    <span data-si-qa-key={`identities-can-assume-role`}>
                                                        {getYesOrNo(data.isCanAssumeRole)}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {data.identityType === IdentityType.AwsIAMRole && (
                                <div className="w-70">
                                    <table className="table custom-table insight-table rounded overflow-hidden">
                                        <thead>
                                            <tr>
                                                <th className="px-1">
                                                    {getHeadings(UserAccessType.ASSUME_ROLE, data.isCanAssumeRole)}
                                                </th>
                                                <th className="px-1">
                                                    {getHeadings(
                                                        UserAccessType.ASSUME_ROLE_SAME_ACCOUNT,
                                                        data.isCanAssumeRoleSameAccount,
                                                    )}
                                                </th>
                                                <th className="px-1">
                                                    {getHeadings(
                                                        UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT,
                                                        data.isCanAssumeRoleOtherAccount,
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{getYesOrNo(data.isCanAssumeRole)}</td>
                                                <td>{getYesOrNo(data.isCanAssumeRoleSameAccount)}</td>
                                                <td>{getYesOrNo(data.isCanAssumeRoleOtherAccount)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
                                        {data?.identityDetails &&
                                            data.identityDetails.AccessKeys &&
                                            data.identityDetails.AccessKeys.AccessKeyMetadata &&
                                            data.identityDetails.AccessKeys.AccessKeyMetadata.map(
                                                (
                                                    accessKeyData: {
                                                        AccessKeyId: string;
                                                        CreateDate: string;
                                                        Status: string;
                                                    },
                                                    i: number,
                                                ) => (
                                                    <tr key={i}>
                                                        <td> {accessKeyData.AccessKeyId} </td>
                                                        <td>
                                                            {' '}
                                                            {dayjs(accessKeyData.CreateDate).format('MMM Do, YYYY')}
                                                        </td>
                                                        <td> {accessKeyData.Status} </td>
                                                    </tr>
                                                ),
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {identitiesModal === UserAccessType.LOGIN_ACCESS && (
                        <div>
                            <div className="h3"> {translate('login_access')} </div>
                            <div className="mt-4">
                                <table className="table custom-table info-table">
                                    <tbody>
                                        <tr>
                                            <td className="w-20 title"> {translate('password_last_used')} </td>
                                            <td>
                                                {data?.identityDetails && data.identityDetails.PasswordLastUsed
                                                    ? dayjs(data.identityDetails.PasswordLastUsed).format('MMM D, YYYY')
                                                    : translate('user_not_present')}
                                            </td>
                                        </tr>
                                        {data?.identityDetails &&
                                            data.identityDetails.LoginProfile &&
                                            data.identityDetails.LoginProfile.LoginProfile &&
                                            data.identityDetails.LoginProfile.LoginProfile.CreateDate && (
                                                <tr>
                                                    <td className="w-20 title"> {translate('created_on')} </td>
                                                    <td>
                                                        {' '}
                                                        {dayjs(
                                                            data.identityDetails.LoginProfile.LoginProfile.CreateDate,
                                                        ).format('MMM D, YYYY')}{' '}
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {identitiesModal === UserAccessType.ASSUME_ROLE && (
                        <div>
                            <div className="h3"> {translate('assume_role')} </div>
                            <div className="mt-4">
                                <table className="table custom-table info-table">
                                    <tbody>
                                        {data?.identityDetails &&
                                            data.identityDetails.CanAssumeRole &&
                                            data.identityDetails.CanAssumeRole.map(
                                                (
                                                    assumeRole: {
                                                        assumed_role_name: string;
                                                        aws_account_id: string;
                                                        policy_name: string;
                                                        si_account_id: number;
                                                    },
                                                    i: number,
                                                ) => (
                                                    <tr key={i}>
                                                        <td className="py-4 text-info-table">
                                                            Can assume role "{assumeRole.assumed_role_name}" in account
                                                            "{assumeRole.aws_account_id}"
                                                            {assumeRole.policy_name ? (
                                                                <> by way of policy "{assumeRole.policy_name}."</>
                                                            ) : (
                                                                '.'
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {(identitiesModal === UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT ||
                        identitiesModal === UserAccessType.ASSUME_ROLE_SAME_ACCOUNT) && (
                        <div>
                            <div className="h3">
                                {translate(
                                    identitiesModal === UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT
                                        ? UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT
                                        : UserAccessType.ASSUME_ROLE_SAME_ACCOUNT,
                                )}
                            </div>
                            <div className="mt-4">
                                <table className="table custom-table info-table">
                                    <tbody>
                                        {data?.identityDetails &&
                                            data.identityDetails.access_types &&
                                            data.identityDetails.access_types.map((access_type: any, i: number) => (
                                                <tr key={i}>
                                                    <>
                                                        {identitiesModal === UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT &&
                                                        access_type.type.includes(
                                                            UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT,
                                                        ) ? (
                                                            <td className="py-4 text-info-table">
                                                                {translate('can_be_assumed')}{' '}
                                                                {access_type.resource ? access_type.resource : ' '}{' '}
                                                                {access_type.resource_path
                                                                    ? '"' + access_type.resource_path + '"'
                                                                    : ''}{' '}
                                                                from account{' '}
                                                                {access_type.account_id
                                                                    ? '"' + access_type.account_id + '"'
                                                                    : ''}
                                                                .
                                                            </td>
                                                        ) : (
                                                            identitiesModal ===
                                                                UserAccessType.ASSUME_ROLE_SAME_ACCOUNT &&
                                                            access_type.type.includes(
                                                                UserAccessType.ASSUME_ROLE_SAME_ACCOUNT,
                                                            ) && (
                                                                <td className="py-4 text-info-table">
                                                                    {translate('can_be_assumed')}{' '}
                                                                    {access_type.resource ? access_type.resource : ' '}{' '}
                                                                    {access_type.resource_path
                                                                        ? '"' + access_type.resource_path + '"'
                                                                        : ''}
                                                                    .
                                                                </td>
                                                            )
                                                        )}
                                                    </>
                                                </tr>
                                            ))}
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

export default React.memo(SingleIdentityInsight);
