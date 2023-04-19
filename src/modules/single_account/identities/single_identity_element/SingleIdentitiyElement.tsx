import { getIdentityDetailsById, getSingleGCPIdentityInsights } from 'core/services/IdentitiesAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import {
    GCPSingleIdentityInsights,
    IdentityType,
    SingleIdentityInsightDetails,
} from 'shared/models/IdentityAccessModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, SCREEN_NAME, UserAccessType } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import SinglePolicy from './aws/single_policy/SinglePolicy';
import SingleIdentityInsight from './aws/single_user/components/SingleIdentityInsight';
import IdentitiesResources from './aws/single_user/resources/IdentityResources';
import AWSRisks from './aws/single_user/risks/AWSRisks';
import GCPSingleIdentityActivityLog from './gcp/single_identity/activity_logs/GCPSingleIdentityActivityLog';
import SingleGCPIdentityInsight from './gcp/single_identity/resources/components/SingleGCPIdentityInsight';
import GCPIdentityResources from './gcp/single_identity/resources/GCPIdentityResources';
import GCPRisks from './gcp/single_identity/risks/GCPRisks';
import SingleRole from './gcp/single_role/SingleRole';
import SingleIdentityActivityLog from '../../activityLogs/SingleIdentityActivityLog';

const IdentityMap = React.lazy(() => import('./aws/single_user/identity_gragh/IdentityMap'));

const SingleIdentityElement = () => {
    const { t } = useTranslation();
    const [identitiyInsight, setIdentityInsight] = useState<SingleIdentityInsightDetails | GCPSingleIdentityInsights>();
    const [isInsightAPILoading, setIsInsightAPILoading] = useState(false);

    const params = useParams<any>();
    const selectedTabName: string = params?.SETName ? params?.SETName : '';
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: string | undefined = params?.cloudAccountType ? params?.cloudAccountType : '';
    const type: any = params?.type ? params?.type : '';
    const resourceId: string | undefined = params?.rid ? params?.rid : '';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, selectedTabName, NAV_TABS_VALUE.IDENTITIES));
    }, [selectedTabName]);

    useEffect(() => {
        if (type == IdentityType.GCPRole) {
            dispatch(setTabsAction('', '', '')); // hide tabs
        } else {
            dispatch(setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, selectedTabName, NAV_TABS_VALUE.IDENTITIES));
        }

        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: 'Identities',
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.IDENTITIES +
                        '/' +
                        type,
                },
                { name: resourceId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        if (
            type.includes(IdentityType.AwsIAMUser) ||
            type === IdentityType.AwsIAMRole ||
            type === IdentityType.AwsFederated
        ) {
            getIdentityDetailsById(cloudAccountId, resourceId)
                .then((response: any) => {
                    if (response && response.identity_details) {
                        const identityDetails = response.identity_details;
                        const accessTypes = identityDetails?.access_types;
                        const insightDetails: SingleIdentityInsightDetails = {
                            identityName:
                                type === IdentityType.AwsIAMRole ? identityDetails.RoleName : identityDetails.UserName,
                            createdOn: identityDetails.CreateDate,
                            isMFAEnabled: response.mfa_enabled,
                            CanAssumeRole: identityDetails.CanAssumeRole,
                            isCanAssumeRole:
                                identityDetails.CanAssumeRole && identityDetails.CanAssumeRole.length > 0
                                    ? true
                                    : false,
                            isConsoleAccess: identityDetails.LoginProfile ? true : false,
                            isProgramaticAccess: identityDetails.AccessKeys ? true : false,
                            identityDetails,
                            identityType: type,
                            accessTypes: accessTypes,
                            isCanAssumeRoleOtherAccount:
                                accessTypes?.length > 0 &&
                                accessTypes.some((a: any) => a.type.includes(UserAccessType.ASSUME_ROLE_OTHER_ACCOUNT)),
                            isCanAssumeRoleSameAccount:
                                accessTypes?.length > 0 &&
                                accessTypes.some((a: any) => a.type.includes(UserAccessType.ASSUME_ROLE_SAME_ACCOUNT)),
                        };
                        setIdentityInsight(insightDetails);
                    }
                })
                .finally(() => setIsInsightAPILoading(false));
        } else if (type === IdentityType.GCPUserHuman || type === IdentityType.GCPUserApplication) {
            getSingleGCPIdentityInsights(cloudAccountId, type, resourceId)
                .then((response: any) => {
                    if (response) {
                        setIdentityInsight(response);
                    }
                })
                .finally(() => setIsInsightAPILoading(false));
        }
    }, []);

    return (
        <>
            {(type === IdentityType.AwsIAMUserHuman ||
                type === IdentityType.AwsIAMUserApplication ||
                type === IdentityType.AwsIAMRole ||
                type === IdentityType.AwsFederated) && (
                <>
                    <div className="shadow-7 p-3">
                        <SingleIdentityInsight
                            data={identitiyInsight as SingleIdentityInsightDetails}
                            isLoading={isInsightAPILoading}
                            translate={t}
                        />
                    </div>
                    <div>
                        {selectedTabName == NAV_TABS_VALUE.IDENTITY_MAP && <IdentityMap />}
                        {selectedTabName == NAV_TABS_VALUE.RISK && (
                            <div className="text-center mt-4">
                                {type == IdentityType.AwsFederated && <> Risk Details coming soon</>}
                                {type != IdentityType.AwsFederated && (
                                    <AWSRisks
                                        cloudAccountId={cloudAccountId}
                                        identitiyId={resourceId}
                                        identityType={type}
                                    />
                                )}
                            </div>
                        )}
                        {selectedTabName == NAV_TABS_VALUE.RESOURCES && (
                            <IdentitiesResources
                                singleIdentityInsightDetails={identitiyInsight as SingleIdentityInsightDetails}
                            />
                        )}
                        {selectedTabName == NAV_TABS_VALUE.POLICY && (
                            <div className="text-center mt-4"> Policy details coming soon </div>
                        )}
                        {selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && <SingleIdentityActivityLog />}
                        {/*selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && (
                            <div className="text-center mt-4"> Activity logs details coming soon </div>
                        )*/}
                    </div>
                </>
            )}
            {type === IdentityType.AWsIAMPolicy && (
                <div>
                    {selectedTabName == NAV_TABS_VALUE.RESOURCES && (
                        <>
                            <SinglePolicy />
                        </>
                    )}
                </div>
            )}

            {(type === IdentityType.GCPUserHuman || type === IdentityType.GCPUserApplication) && (
                <>
                    <div className="shadow-7 p-3">
                        <SingleGCPIdentityInsight
                            data={identitiyInsight as GCPSingleIdentityInsights}
                            isLoading={isInsightAPILoading}
                            translate={t}
                        />
                    </div>
                    <div>
                        {selectedTabName == NAV_TABS_VALUE.RISK && (
                            <div className="text-center mt-4">
                                {/* <SingleGCPIdentityInsight
                                    data={identitiyInsight as GCPSingleIdentityInsights}
                                    isLoading={isInsightAPILoading}
                                    translate={t}
                                /> */}
                                <GCPRisks
                                    cloudAccountId={cloudAccountId}
                                    identitiyId={resourceId}
                                    identityType={type}
                                />
                            </div>
                        )}
                        {selectedTabName == NAV_TABS_VALUE.RESOURCES && <GCPIdentityResources />}
                        {selectedTabName == NAV_TABS_VALUE.POLICY && (
                            <div className="text-center mt-4"> Policy details coming soon </div>
                        )}
                        {selectedTabName == NAV_TABS_VALUE.ACTIVITY_LOG && (
                            <GCPSingleIdentityActivityLog
                                cloudAccountId={cloudAccountId}
                                identityType={type}
                                identityId={resourceId}
                            />
                        )}
                    </div>
                </>
            )}
            {type === IdentityType.GCPRole && <SingleRole />}
        </>
    );
};

export default SingleIdentityElement;
