import { CNav, CNavItem, CNavLink, CHeader } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import { SubHeaderTab } from 'shared/models/TabsModel';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import { AppState } from 'store/store';
import { setGraphDataAction } from 'store/actions/GraphActions';
import dayjs from 'dayjs';
import { cilHome } from '@coreui/icons';

export type Props = {
    screenName: string;
    activeTab: string;
};

const NavTabs = (props: Props) => {
    const { t } = useTranslation();
    const [tabsList, setTabsList] = useState<SubHeaderTab[] | undefined | any>([]);
    const [activeTab, setActiveTab] = useState<string>();
    const [isPolicy, setIsPolicy] = useState<boolean>(false);
    const domainName = window.location.href;
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const routes = location.pathname?.split('/');
    const cloudAccountType: any = routes[3];

    const tabsScreenMap = new Map<string, SubHeaderTab[]>();
    const [lastScan, setLastScan] = useState<any>('');
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const tabSelected = useSelector((state: AppState) => state.graphState.data.tabSelected);

    // const resourceType = window.location.hash.split('/').pop();

    // useEffect(() => {
    //     if (resourceType === 'aws_RelationalDatabaseService') setActiveTabName('Data Assets');
    // }, [resourceType]);

    tabsScreenMap.set(SCREEN_NAME.SINGLE_DATA_ELEMENT, [
        // {
        //     tabName: t(NAV_TABS_VALUE.POLICY),
        //     tabValue: NAV_TABS_VALUE.POLICY,
        // },
        // {
        //     tabName: t(NAV_TABS_VALUE.ACTIVITY_LOG),
        //     tabValue: NAV_TABS_VALUE.ACTIVITY_LOG,
        // },
        // {
        //     tabName: t(NAV_TABS_VALUE.INFORMATION),
        //     tabValue: NAV_TABS_VALUE.INFORMATION,
        // },
        {
            tabName: t(NAV_TABS_VALUE.RISK_MAP),
            tabValue: NAV_TABS_VALUE.RISK_MAP,
        },
        {
            tabName: t(NAV_TABS_VALUE.RISK_DETAILS),
            tabValue: NAV_TABS_VALUE.RISK_DETAILS,
        },
        {
            tabName: t(NAV_TABS_VALUE.ACCESS_DETAILS),
            tabValue: NAV_TABS_VALUE.ACCESS_DETAILS,
        },
        {
            tabName: t(NAV_TABS_VALUE.APPLICATIONS_EXPOSED),
            tabValue: NAV_TABS_VALUE.APPLICATIONS_EXPOSED,
        },

        {
            tabName: t(NAV_TABS_VALUE.ACTIVITY_LOG),
            tabValue: NAV_TABS_VALUE.ACTIVITY_LOG,
        },
    ]);

    tabsScreenMap.set(SCREEN_NAME.SINGLE_DATA_ELEMENT_DATASET, [
        {
            tabName: t(NAV_TABS_VALUE.TABLES),
            tabValue: NAV_TABS_VALUE.TABLES,
        },
        {
            tabName: t(NAV_TABS_VALUE.IDENTITIES),
            tabValue: NAV_TABS_VALUE.IDENTITIES,
        },
        {
            tabName: t(NAV_TABS_VALUE.ACTIVITY_LOG),
            tabValue: NAV_TABS_VALUE.ACTIVITY_LOG,
        },
    ]);

    tabsScreenMap.set(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, [
        {
            tabName: t(NAV_TABS_VALUE.DASHBOARD),
            tabValue: NAV_TABS_VALUE.DASHBOARD,
            resourceType: 'aws_S3',
            parentTab: true,
        },
        {
            tabName: t(NAV_TABS_VALUE.DATA_ENDPOINTS),
            tabValue: NAV_TABS_VALUE.DATA_ENDPOINTS,
            resourceType: 'aws_S3',
            parentTab: true,
        },
        // {
        //     tabName: t(NAV_TABS_VALUE.POLICIES),
        //     tabValue: NAV_TABS_VALUE.POLICIES,
        // },
        {
            tabName: t(NAV_TABS_VALUE.IDENTITIES),
            tabValue: NAV_TABS_VALUE.IDENTITIES,
            resourceType: IdentityType.AwsIAMUserHuman,
            parentTab: true,
        },
        {
            tabName: t(NAV_TABS_VALUE.APPLICATIONS),
            tabValue: NAV_TABS_VALUE.APPLICATIONS,
            resourceType: 'Overview',
            parentTab: true,
        },
        {
            tabName: t(NAV_TABS_VALUE.RISKS), //change the name Action To Risk
            tabValue: NAV_TABS_VALUE.RISKS,
            resourceType: 'Overview',
            parentTab: true,
        },
        // keeping query analytics tab hidden from the users for now
        // {
        //     tabName: t(NAV_TABS_VALUE.ANALYTICS),
        //     tabValue: NAV_TABS_VALUE.ANALYTICS,
        //     resourceType: 'Overview',
        // },
        {
            tabName: t(NAV_TABS_VALUE.CONFIGURATION),
            tabValue: NAV_TABS_VALUE.CONFIGURATION,
            resourceType: 'Overview',
            parentTab: true,
        },
    ]);

    tabsScreenMap.set(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, [
        {
            tabName: t(NAV_TABS_VALUE.IDENTITY_MAP),
            tabValue: NAV_TABS_VALUE.IDENTITY_MAP,
        },
        {
            tabName: t(NAV_TABS_VALUE.RISK),
            tabValue: NAV_TABS_VALUE.RISK,
        },
        {
            tabName: t(NAV_TABS_VALUE.RESOURCES),
            tabValue: NAV_TABS_VALUE.RESOURCES,
        },
        {
            tabName: t(NAV_TABS_VALUE.ACTIVITY_LOG),
            tabValue: NAV_TABS_VALUE.ACTIVITY_LOG,
        },
        // {
        //     tabName: t(NAV_TABS_VALUE.POLICY),
        //     tabValue: NAV_TABS_VALUE.POLICY,
        // },
    ]);
    tabsScreenMap.set(SCREEN_NAME.SINGLE_APPLICATION_ELEMENT, [
        {
            tabName: t(NAV_TABS_VALUE.APPLICATIONS_DETAILS),
            tabValue: NAV_TABS_VALUE.APPLICATIONS_DETAILS,
        },
        {
            tabName: t(NAV_TABS_VALUE.APPLICATIONS_MAP),
            tabValue: NAV_TABS_VALUE.APPLICATIONS_MAP,
        },

        // {
        //     tabName: t(NAV_TABS_VALUE.POLICY),
        //     tabValue: NAV_TABS_VALUE.POLICY,
        // },
    ]);
    tabsScreenMap.set(SCREEN_NAME.SINGLE_DATA_ASSET_IDENTITY, [
        {
            tabName: t(NAV_TABS_VALUE.IDENTITY_ACCESS),
            tabValue: NAV_TABS_VALUE.IDENTITY_ACCESS,
        },
        {
            tabName: t(NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE),
            tabValue: NAV_TABS_VALUE.ACCESS_VIA_ASSUME_ROLE,
        },
        {
            tabName: t(NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS),
            tabValue: NAV_TABS_VALUE.CROSS_ACCOUNT_ACCESS,
        },
    ]);

    tabsScreenMap.set(SCREEN_NAME.SINGLE_DATASET_TABLE, [
        {
            tabName: t(NAV_TABS_VALUE.COLUMNS),
            tabValue: NAV_TABS_VALUE.COLUMNS,
        },
        {
            tabName: t(NAV_TABS_VALUE.IDENTITIES),
            tabValue: NAV_TABS_VALUE.IDENTITIES,
        },
    ]);

    useEffect(() => {
        if (domainName.includes('aws_IAMPolicy')) {
            setIsPolicy(true);
        } else {
            setIsPolicy(false);
        }

        if (props.screenName) {
            setTabsList(tabsScreenMap.get(props.screenName));
        }

        if (props.activeTab && props.activeTab != '') {
            setActiveTab(props.activeTab);
        } else {
            const routes = location.pathname?.split('/');
            if (routes && routes.length > 0) {
                setActiveTab(routes[routes.length - 2]);
            }
        }
    }, [props, location]);
    useEffect(() => {
        if (activeTab === 'risk_map') {
            if (tabSelected) {
                setActiveTab('Risk Details');
            }
        }
        if (activeTab === 'Risk Details') {
            if (tabSelected === false) {
                setActiveTab('risk_map');
            }
        }
    }, [tabSelected]);

    const updateRoute = (tabName: string, resourceType: string | undefined) => {
        setActiveTab(tabName);
        if (tabName === 'Risk Details') {
            setActiveTab(tabName);
            dispatch(
                setGraphDataAction({
                    tabSelected: true,
                    nodes: [],
                    links: [],
                    risk: undefined,
                }),
            );
        }
        //Todo - Need to improve this: Due to timing contrain natigate using below work around.

        if (tabName === 'policies' || tabName === 'policy') {
            return;
        } else {
            if (props.screenName === SCREEN_NAME.DATA_ENDPOINTS_SUMMARY) {
                const routes = location.pathname?.split('/');

                if (routes && routes.length > 0) {
                    let basePath = '/' + routes[1] + '/' + routes[2] + '/' + routes[3];
                    if (routes[3] === 'GCP') {
                        basePath += '/' + tabName + '/' + IdentityType.GCPUserHuman;
                    } else {
                        basePath += '/' + tabName + '/' + resourceType;
                    }

                    navigate(basePath);
                }
            } else {
                const paths = location.pathname.replace(/[^/]*$/, tabName);

                navigate(paths);
            }
        }
    };

    //Last scan time
    const getLastScanTime = () => {
        setLastScan(selectedcloudAccounts?.last_scan_event_ts);
    };
    useEffect(() => {
        getLastScanTime();
    }, [selectedcloudAccounts]);
    const lastActive = () => {
        return dayjs(parseInt(lastScan) * 1000).format('DD MMM YY | hh:mm a');
    };

    return (
        <>
            <div
                // style={{ top: '45px', zIndex: '1040', left: '122px' }}
                className="font-x-small-bold mt-3 position-fixed last-scan-time"
            >
                {t('discovery_completed_on')}
                {`  ${lastScan ? lastActive() : 'Loading...'}`}
            </div>

            <div className="container d-flex px-0 mt-3">
                <CHeader className="border-0  c-subheader">
                    {/* <CNav component="nav" variant={tabsState.parentTab ? 'pills' : 'tabs'} className="flex-column flex-sm-row"> */}
                    {tabsList &&
                        tabsList.map((tab: SubHeaderTab, index: number) => (
                            <CNav
                                // variant={'tabs'}
                                // className={'tabs-custom border-0'}
                                variant={tab.parentTab ? 'tabs' : 'pills'}
                                className={tab.parentTab ? 'tabs-custom border-0' : 'tabs-child border-0'}
                                key={index}
                            >
                                <CNavItem key={index} className={tab.parentTab ? 'nav-tabs' : 'nav-tabs1'}>
                                    <CNavLink
                                        active={tab.tabValue == activeTab}
                                        data-tab={tab.tabValue}
                                        onClick={() => {
                                            updateRoute(tab.tabValue, tab?.resourceType);
                                        }}
                                        disabled={
                                            cloudAccountType == 'GCP'
                                                ? 'Applications' == tab.tabValue || 'Risks' == tab.tabValue
                                                    ? true
                                                    : false
                                                : isPolicy &&
                                                  !tab.parentTab &&
                                                  tab.tabName.toLocaleLowerCase() != 'resources'
                                                ? true
                                                : false
                                        }
                                    >
                                        <span className={tab.parentTab ? 'h5' : 'h6'}>
                                            {tab.tabName == t(NAV_TABS_VALUE.DASHBOARD) ? (
                                                <CIcon icon={cilHome} size="lg" />
                                            ) : (
                                                tab.tabName
                                            )}
                                        </span>
                                    </CNavLink>
                                </CNavItem>
                            </CNav>
                        ))}
                </CHeader>
            </div>
        </>
    );
};

export default React.memo(NavTabs);
