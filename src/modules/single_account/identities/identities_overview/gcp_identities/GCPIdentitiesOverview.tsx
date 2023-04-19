import React, { useEffect, useState } from 'react';
// import FixTodayCards from '../../../../shared/components/fixTodayCard/FixTodayCard';
import { useTranslation } from 'react-i18next';
import { GCPRoleDetails, IdentitiesInsights, IdentityDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { useNavigate, useLocation } from 'react-router';
// import { FixTodayCard } from 'shared/models/GenericModel';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { getGCPIdentities, getGCPRoles, getGCPIdentitesInsights } from 'core/services/IdentitiesAPIService';
import { BadgeData } from 'shared/models/GenericModel';
import IdentitiesInsight from '../aws_identities/components/users/IdentitiesInsight';
import IdentitiesTableView from '../aws_identities/components/users/IdentitiesTableView';
import GCPRoleTableView from './components/roles/GCPRoleTableView';

type CustomTab = {
    name: string;
    type: IdentityType;
    count: number;
};
const GCPIdentitiesOverview = (props: any) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState<IdentityType>();
    const [tabList, setTabList] = useState<CustomTab[]>([]);

    const [isInsightAPILoading, setIsInsightAPILoading] = useState(false);
    const [humanIdentitiesInsight, setHumanIdentitiesInsight] = useState<IdentitiesInsights>();

    const [isServiceAccountInsightsLoading, setIsServiceAccountInsightsLoading] = useState(false);
    const [serviceAccountIdentitiesInsight, setServiceAccountIdentitiesInsight] = useState<IdentitiesInsights>();

    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [humanIdentityDetailsList, setHumanIdentityDetailsList] = useState<IdentityDetails[]>([]);

    const [isServiceAccountsLoading, setIsServiceAccountsLoading] = useState(false);
    const [serviceAccountDetailsList, setServiceAccountDetailsList] = useState<IdentityDetails[]>([]);

    const [isRoleAPILoading, setIsRoleAPILoading] = useState(false);
    const [roleDetailsList, setRoleDetailsList] = useState<GCPRoleDetails[]>([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: string | undefined | any = params?.cloudAccountType;
    let type: any = params?.type ? params?.type : '';
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo'); // bar

    useEffect(() => {
        if (selectedTab === IdentityType.GCPUserHuman) props.setIdentityType('human_user');
        if (selectedTab === IdentityType.GCPUserApplication) props.setIdentityType('app_user');
        if (selectedTab === IdentityType.GCPRole) props.setIdentityType('role');
    }, [selectedTab]);

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
        }
        if (type == IdentityType.AwsIAMUserHuman) {
            navigate(IdentityType.GCPUserHuman);
            type = IdentityType.GCPUserHuman;
        }
        /*------------------------------------------------ */
        // Added to show breadcrumb & tabs of reload
        // Todo - Refactore this code to call below api only once
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                { name: 'Identities', path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, '', ''));
        /*------------------------------------------------ */
        setSelectedTab(type);
        setIsInsightAPILoading(true);
        setIsServiceAccountInsightsLoading(true);
        setIsUsersLoading(true);
        setIsRoleAPILoading(true);
        getGCPIdentitesInsights(cloudAccountId, IdentityType.GCPUserHuman).then((response: any) => {
            if (response) {
                setHumanIdentitiesInsight(formatInsight(response));
                setIsInsightAPILoading(false);
            }
        });

        getGCPIdentitesInsights(cloudAccountId, IdentityType.GCPUserApplication).then((response: any) => {
            if (response) {
                setServiceAccountIdentitiesInsight(formatInsight(response));
                setIsServiceAccountInsightsLoading(false);
            }
        });

        getGCPIdentities(cloudAccountId, IdentityType.GCPUserHuman).then((response: any) => {
            if (response) {
                setHumanIdentityDetailsList(response);
                setIsUsersLoading(false);
            }
        });

        getGCPIdentities(cloudAccountId, IdentityType.GCPUserApplication).then((response: any) => {
            if (response) {
                setServiceAccountDetailsList(response);
                setIsServiceAccountsLoading(false);
            }
        });

        getGCPRoles(cloudAccountId).then((response: any) => {
            if (response) {
                setRoleDetailsList(response);
                setIsRoleAPILoading(false);
            }
        });
    }, []);

    useEffect(() => {
        // Todo - Call a separate API to get the count for all the tabs
        setTabList([
            {
                name: t('human_identities'),
                type: IdentityType.GCPUserHuman,
                count: humanIdentityDetailsList.length,
            },
            {
                name: t('application_identities'),
                type: IdentityType.GCPUserApplication,
                count: serviceAccountDetailsList.length,
            },
            { name: t('roles'), type: IdentityType.GCPRole, count: roleDetailsList.length },
        ]);
        setTabList([
            {
                name: t('human_identities'),
                type: IdentityType.GCPUserHuman,
                count: humanIdentityDetailsList.length,
            },
            {
                name: t('application_identities'),
                type: IdentityType.GCPUserApplication,
                count: serviceAccountDetailsList.length,
            },
            { name: t('roles'), type: IdentityType.GCPRole, count: roleDetailsList.length },
        ]);
    }, [humanIdentityDetailsList, serviceAccountDetailsList, roleDetailsList]);

    const formatInsight = (insightDetails: any) => {
        return {
            permissions: {
                title: 'Permissions',
                badgeData: insightDetails.permissions as BadgeData[],
            },
            accessType: {
                title: 'Access Type',
                badgeData: insightDetails.access_types as BadgeData[],
            },
            identitiesUsed: {
                title: '',
                badgeData: [] as BadgeData[],
            },
        };
    };

    const naviagateToSingleIdentityScreen = (identityId: string) => {
        navigate(
            `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${selectedTab}/${identityId}/${NAV_TABS_VALUE.RISK}`,
        );
    };

    const naviagateToSingleRoleScreen = (identityId: string) => {
        navigate(
            `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${selectedTab}/${identityId}/${NAV_TABS_VALUE.RISK}`,
        );
    };

    return (
        <div>
            <div className="container">
                <nav className="nav nav-custom nav-box text-center my-3">
                    {tabList &&
                        tabList.map((tab: CustomTab, index: number) => (
                            <span
                                key={index}
                                className={`nav-link font-small-semibold ${selectedTab == tab.type ? 'active' : ''} `}
                                onClick={() => {
                                    setSelectedTab(tab.type);
                                    navigate(
                                        `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${tab.type}?pageNo=${currentPage}`,
                                    );
                                }}
                                role="presentation"
                            >
                                {tab.name} ({tab.count})
                            </span>
                        ))}
                </nav>
            </div>
            {selectedTab === IdentityType.GCPUserHuman && (
                <div>
                    <div className="custom-shadow p-3">
                        <div className="container">
                            <IdentitiesInsight
                                data={humanIdentitiesInsight}
                                isLoading={isInsightAPILoading}
                                translate={t}
                                identityType={IdentityType.GCPUserHuman}
                            />
                        </div>
                    </div>

                    <IdentitiesTableView
                        tabCount={{}}
                        cloudAccountId={cloudAccountId}
                        currentPage={currentPage}
                        headerTitle={'Risky'}
                        isLoading={isUsersLoading}
                        data={humanIdentityDetailsList}
                        onClickRow={naviagateToSingleIdentityScreen}
                        identityType={IdentityType.GCPUserHuman}
                        accessCounts={props.accessCounts}
                        getSummaryDetails={props.getSummaryDetails}
                        identityNames={props.identityNames}
                    />
                </div>
            )}
            {selectedTab === IdentityType.GCPUserApplication && (
                <div>
                    <div className="custom-shadow p-3">
                        <div className="container">
                            <IdentitiesInsight
                                data={serviceAccountIdentitiesInsight}
                                isLoading={isServiceAccountInsightsLoading}
                                translate={t}
                                identityType={IdentityType.GCPUserApplication}
                            />
                        </div>
                    </div>

                    <IdentitiesTableView
                        tabCount={{}}
                        cloudAccountId={cloudAccountId}
                        currentPage={currentPage}
                        headerTitle={'Risky'}
                        isLoading={isServiceAccountsLoading}
                        data={serviceAccountDetailsList}
                        onClickRow={naviagateToSingleIdentityScreen}
                        identityType={IdentityType.GCPUserApplication}
                        accessCounts={props.accessCounts}
                        getSummaryDetails={props.getSummaryDetails}
                        identityNames={props.identityNames}
                    />
                </div>
            )}
            {selectedTab === IdentityType.GCPRole && (
                <div>
                    <GCPRoleTableView
                        currentPage={currentPage}
                        headerTitle={'Risky'}
                        isLoading={isRoleAPILoading}
                        translte={t}
                        data={roleDetailsList}
                        onClickRow={naviagateToSingleRoleScreen}
                        identityType={IdentityType.AwsIAMRole}
                    />
                </div>
            )}
        </div>
    );
};

export default GCPIdentitiesOverview;
