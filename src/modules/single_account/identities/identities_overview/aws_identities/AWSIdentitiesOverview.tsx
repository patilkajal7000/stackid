import React, { useEffect, useState } from 'react';
// import FixTodayCards from '../../../../shared/components/fixTodayCard/FixTodayCard';
import { useTranslation } from 'react-i18next';
import { IdentitiesInsights, IdentityDetails, IdentityType, InsightOverview } from 'shared/models/IdentityAccessModel';
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
import { getIdentitiesSummaryTotal, getUsersOverview } from 'core/services/IdentitiesAPIService';
import { BadgeData } from 'shared/models/GenericModel';
import PoliciesTableView from './components/policies/PoliciesTableView';
import IdentitiesInsight from './components/users/IdentitiesInsight';
import IdentitiesTableView from './components/users/IdentitiesTableView';
import FederatedTableView from './components/federated/FederatedTableView';
import AWSIdentitiesRoles from './components/roles/AWSIdentitiesRoles';
type CustomTab = {
    name: string;
    type: IdentityType;
    count: number;
};
const AWSIdentitiesOverview = (props: any) => {
    const { t } = useTranslation();
    const [humanIdentityDetailsList, setHumanIdentityDetailsList] = useState<IdentityDetails[]>([]);
    const [humanIdentitiesInsight, setHumanIdentitiesInsight] = useState<IdentitiesInsights>();
    const [applicationIdentityDetailsList, setApplicationIdentityDetailsList] = useState<IdentityDetails[]>([]);
    const [applicationIdentitiesInsight, setApplicationIdentitiesInsight] = useState<IdentitiesInsights>();
    const [isInsightAPILoading, setIsInsightAPILoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState<IdentityType>();
    const [tabList, setTabList] = useState<CustomTab[]>([]);
    const [refreshData, setRefreshData] = useState(false);
    const [roleTotalCount, setRoleTotalCount] = useState(0);
    const [policiesTotalCount, setPoliciesTotalCount] = useState(0);
    const [humanIdentitiesTotalCount, setHumanIdentitiesTotalCount] = useState(0);
    const [federatedIdentitiesTotalCount, setFederatedIdentitiesTotalCount] = useState(0);
    const [applicationIdentitesTotalCount, setApplicationIdentitesTotalCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams<any>();
    const abortController = new AbortController();

    // const cloudAccountId: string | undefined | any = params?.cloudAccountId;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: string | undefined | any = params?.cloudAccountType;
    const type: string | undefined | any = params?.type;
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo'); // bar
    useEffect(() => {
        if (selectedTab === IdentityType.AwsIAMUserHuman) props.setIdentityType('human_user');
        if (selectedTab === IdentityType.AwsIAMUserApplication) props.setIdentityType('app_user');
        if (selectedTab === IdentityType.AwsIAMRole) props.setIdentityType('role');
        if (selectedTab === IdentityType.AwsFederated) props.setIdentityType('federated');
    }, [selectedTab]);

    useEffect(() => {
        // To set the total count for all tabs
        getIdentitiesSummaryTotal(cloudAccountId).then((response: any) => {
            if (!response) return;
            setRoleTotalCount(response?.role_count);
            setPoliciesTotalCount(response?.policies_count);
            setHumanIdentitiesTotalCount(response?.human_identites_count);
            setFederatedIdentitiesTotalCount(response?.federated_identities_count);
            setApplicationIdentitesTotalCount(response?.application_identities_count);
        });

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
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

        getUsersOverview(cloudAccountId).then((response: any) => {
            const res = response as InsightOverview;
            setHumanIdentityDetailsList(res.human_identities.overview_data);
            setApplicationIdentityDetailsList(res.application_identities.overview_data);
            setHumanIdentitiesInsight(formatInsight(res.human_identities.insight_details));
            setApplicationIdentitiesInsight(formatInsight(res.application_identities.insight_details));
            setIsInsightAPILoading(false);
        });

        return () => {
            abortController.abort();
        };
    }, [refreshData]);

    useEffect(() => {
        setTabList([
            {
                name: t('human') + ' ' + t('identities'),
                type: IdentityType.AwsIAMUserHuman,
                count: humanIdentitiesTotalCount,
            },
            {
                name: t('application') + ' ' + t('identities'),
                type: IdentityType.AwsIAMUserApplication,
                count: applicationIdentitesTotalCount,
            },
            { name: t('roles'), type: IdentityType.AwsIAMRole, count: roleTotalCount },
            { name: t('fed_identities'), type: IdentityType.AwsFederated, count: federatedIdentitiesTotalCount },
            { name: t('policies'), type: IdentityType.AWsIAMPolicy, count: policiesTotalCount },
        ]);
    }, [
        roleTotalCount,
        policiesTotalCount,
        humanIdentitiesTotalCount,
        federatedIdentitiesTotalCount,
        applicationIdentitesTotalCount,
    ]);
    // useEffect(() => {
    //     getDataByTab();
    // }, [selectedTab]);
    // const getDataByTab = () => {
    //     getObjKey(selectedTab);
    // };
    // function getObjKey(value: any) {

    //     if (value === IdentityType.AwsIAMUserHuman) {
    //         // eslint-disable-next-line no-var
    //         var tab = 'human_identities';
    //     } else if (value === IdentityType.AwsIAMUserApplication) {
    //         // eslint-disable-next-line no-var
    //         var tab = 'application_identities';
    //     } else if (value === IdentityType.AwsIAMRole) {
    //         // eslint-disable-next-line no-var
    //         var tab = 'roles';
    //     }
    // }
    // useEffect(() => {
    //     const top3Items = identityDetailsList.sort((a: any, b: any) => b.risk_score - a.risk_score).slice(0, 3);
    //     const fixTodayBuckets: FixTodayCard[] = top3Items.map(({ identity_id, identity_name }) => ({ id: identity_id, title: identity_name }));
    //     setFixTodayItems(fixTodayBuckets);
    // }, [identityDetailsList])

    // const gotoSingleUserIdentities = (identitiesId: string) => {
    //     history.push('/' + identitiesId + '/' + NAV_TABS_VALUE.RISK_MAP);
    // };

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
            `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${selectedTab}/${identityId}/${NAV_TABS_VALUE.IDENTITY_MAP}`,
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
                                    navigate(`/accounts/${cloudAccountId}/${cloudAccountType}/identities/${tab.type}`);
                                }}
                                role="presentation"
                                data-si-qa-key={`identity-mainTabs-${tab.type}`}
                            >
                                {tab.name} ({tab.count})
                            </span>
                        ))}
                </nav>
            </div>
            {selectedTab === IdentityType.AwsIAMUserHuman && (
                <div>
                    <div className="custom-shadow p-3">
                        <div className="container">
                            <IdentitiesInsight
                                data={humanIdentitiesInsight}
                                isLoading={isInsightAPILoading}
                                translate={t}
                                identityType={IdentityType.AwsIAMUserHuman}
                            />
                        </div>
                    </div>

                    {/* <div className="h4 mt-4 container"> {t('needs_attention')} </div>
                    <FixTodayCards
                        data={identityDetailsList
                            ?.filter((d: IdentityDetails) => d.accessTypes.includes(UserAccessType.LOGIN_ACCESS))
                            .map((d: IdentityDetails) => {
                                return { id: d.identity_id, title: d.identity_name };
                            })
                            .splice(0, 3)}
                        onClickView={(id: string) => naviagateToSingleIdentityScreen(id)}
                        translate={t}
                        isLoading={isInsightAPILoading}
                    /> */}

                    <IdentitiesTableView
                        tabCount={{}}
                        cloudAccountId={cloudAccountId}
                        currentPage={currentPage}
                        headerTitle={'Risky'}
                        isLoading={isInsightAPILoading}
                        data={humanIdentityDetailsList}
                        onClickRow={naviagateToSingleIdentityScreen}
                        identityType={IdentityType.AwsIAMUserHuman}
                        accessCounts={props.accessCounts}
                        getSummaryDetails={props.getSummaryDetails}
                        identityNames={props.identityNames}
                        accessType={props.accessType}
                        setRefreshData={setRefreshData}
                        refresh={refreshData}
                    />
                </div>
            )}
            {selectedTab === IdentityType.AwsIAMUserApplication && (
                <div>
                    <div className="custom-shadow p-3">
                        <div className="container">
                            <IdentitiesInsight
                                identityType={IdentityType.AwsIAMUserApplication}
                                data={applicationIdentitiesInsight}
                                isLoading={isInsightAPILoading}
                                translate={t}
                            />
                        </div>
                    </div>

                    {/* <div className="h4 mt-4 container d-flex flex-start"> {t('needs_attention')} </div>
                    <FixTodayCards
                        data={identityDetailsList
                            ?.filter((d: IdentityDetails) => d.accessTypes.includes(UserAccessType.PROGRAMATIC_ACCESS))
                            .map((d: IdentityDetails) => {
                                return { id: d.identity_id, title: d.identity_name };
                            })
                            .splice(0, 3)}
                        onClickView={(id: string) => naviagateToSingleIdentityScreen(id)}
                        translate={t}
                        isLoading={isInsightAPILoading}
                    /> */}
                    <IdentitiesTableView
                        tabCount={{}}
                        cloudAccountId={cloudAccountId}
                        currentPage={currentPage}
                        headerTitle={'Risky'}
                        isLoading={isInsightAPILoading}
                        data={applicationIdentityDetailsList}
                        onClickRow={naviagateToSingleIdentityScreen}
                        identityType={IdentityType.AwsIAMUserApplication}
                        accessCounts={props.accessCounts}
                        getSummaryDetails={props.getSummaryDetails}
                        identityNames={props.identityNames}
                        accessType={props.accessType}
                    />
                </div>
            )}
            {selectedTab === IdentityType.AwsIAMRole && (
                <AWSIdentitiesRoles
                    accessCounts={props.accessCounts}
                    getSummaryDetails={props.getSummaryDetails}
                    identityNames={props.identityNames}
                    accessType={props.accessType}
                />
            )}
            {selectedTab === IdentityType.AWsIAMPolicy && (
                <div>
                    <PoliciesTableView />
                </div>
            )}

            {selectedTab === IdentityType.AwsFederated && (
                <div>
                    <FederatedTableView
                        accessCounts={props.accessCounts}
                        getSummaryDetails={props.getSummaryDetails}
                        identityNames={props.identityNames}
                        accessType={props.accessType}
                        selectedTab={selectedTab}
                    />
                </div>
            )}
        </div>
    );
};

export default AWSIdentitiesOverview;
