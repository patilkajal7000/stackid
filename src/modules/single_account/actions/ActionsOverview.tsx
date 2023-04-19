import React, { useEffect, useReducer, useState } from 'react';
import ActionsTable from './ActionsTable';
import { getSiRiskCount } from 'core/services/DataEndpointsAPIService';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { useParams } from 'react-router-dom';
import { SCREEN_NAME, NAV_TABS_VALUE } from 'shared/utils/Constants';
import Skeleton from 'react-loading-skeleton';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { getAllOrgAndRoles, riskTagsAPI } from 'core/services/userManagementAPIService';
import { UnstyledButton, Menu, Text, Group, Chip } from '@mantine/core';
import { IconFilter, IconChevronDown } from '@tabler/icons-react';

const ActionsOverview = () => {
    const [actionsData, setActionData] = useState<any>();
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const orgId = userDetails?.org.organisation_id;
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    const params = useParams<any>();
    const [render] = useState<any>(false);
    const [, setUsers] = useState<any>([]);
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';
    const [filterTag, setFilterTag] = useState<any>('OR');
    const dispatch = useDispatch();
    const [filterValue, setFilterValue] = useState<any>(undefined);
    const [isChipSelected, setIsChipSelected] = useState<any>();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: NAV_TABS_VALUE.RISKS,
                    path: '',
                },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, '', ''));
    }, []);

    useEffect(() => {
        //Active Data
        getAllOrgAndRoles()
            .then((res: any) => {
                const confirm = res
                    .filter((x: any) => x.status_text.includes('CONFIRMED'))
                    .sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
                setUsers(confirm);
                // setAssignUser(confirm.map((user: any) => user.name));
            })
            .catch(() => {
                console.log('No User Found');
            });

        riskTagsAPI(orgId, cloudAccountId).then((res: any) => {
            const temp: string[] = [];
            res.map((data: any) => {
                let arr = '';
                arr += data.Key + '=' + data.Value;
                temp.push(arr);
            });
            setActionData(temp);
        });
    }, []);
    useEffect(() => {
        if (discoveryId != 0) {
            setIsLoading(true);
            getSiRiskCount(orgId, cloudAccountId, discoveryId, filterValue).then((response: any) => {
                setIsLoading(false);
                setDisplayData(response);
            });
        }
    }, [discoveryId, filterValue, filterTag]);

    useEffect(() => {
        const temp: any = {};
        actionsData?.forEach((action: any) => {
            temp[action] = true;
        });
        setIsChipSelected(temp);
    }, [actionsData]);

    const getFilterString = (tagValue: any) => {
        if (isChipSelected && Object.values(isChipSelected)?.includes(true) && tagValue == 'OR') {
            const filterString = Object.keys(isChipSelected)
                .filter((element: any) => isChipSelected[element] === true)
                .map((tag: any) => '{"Key":"' + tag.split('=')[0] + '","Value":"' + tag.split('=')[1] + '"}')
                .join('|');

            setFilterValue(filterString);
        }
        if (isChipSelected && Object.values(isChipSelected)?.includes(true) && tagValue == 'AND') {
            let filterString = Object.keys(isChipSelected)
                .filter((element: any) => isChipSelected[element] === true)
                .map((tag: any) => '(?=.*{"Key":"' + tag.split('=')[0] + '","Value":"' + tag.split('=')[1] + '"})')
                .join('');
            filterString = '^' + filterString + '.*$';

            setFilterValue(filterString);
        }
    };

    const buttonSelect = (data: any) => {
        const temp: any = isChipSelected;
        temp[data] = !temp[data];
        setIsChipSelected(temp);
        forceUpdate();
        getFilterString(filterTag);
    };

    return (
        <>
            <div style={{ backgroundColor: '#D5E3F5', minHeight: '100vh' }}>
                <div className="container">
                    <div className="d-flex align-items-center mx-0 w-100 mt-4">
                        <Group mt={'lg'}>
                            <Group>
                                <IconFilter size={'34'} />
                                <Menu withArrow arrowPosition="center" position="bottom-end" shadow="sm">
                                    <Menu.Target>
                                        <UnstyledButton
                                            sx={() => ({
                                                display: 'block',
                                                border: '1px solid gray',
                                                padding: '4px',
                                                borderRadius: '10px',
                                            })}
                                        >
                                            <Group spacing={'xs'}>
                                                <Text size={'sm'}>{filterTag}</Text>
                                                <IconChevronDown size={20} />
                                            </Group>
                                        </UnstyledButton>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() => {
                                                setFilterTag('AND');
                                                getFilterString('AND');
                                            }}
                                        >
                                            AND
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() => {
                                                setFilterTag('OR');
                                                getFilterString('OR');
                                            }}
                                        >
                                            OR
                                        </Menu.Item>{' '}
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                            {isChipSelected &&
                                Object.keys(isChipSelected).map((tag: any) => {
                                    const value = isChipSelected[tag];

                                    return (
                                        <Chip
                                            variant="filled"
                                            key={tag}
                                            size="sm"
                                            radius={'xl'}
                                            checked={value}
                                            onChange={() => buttonSelect(tag)}
                                        >
                                            {tag}
                                        </Chip>
                                    );
                                })}
                        </Group>
                    </div>
                </div>
                {displayData && !isLoading && (
                    <ActionsTable
                        render={render}
                        actionsData={displayData}
                        isLoading={isLoading}
                        orgId={orgId}
                        cloudAccountId={cloudAccountId}
                    />
                )}
                {isLoading && (
                    <div className="container mt-3">
                        <table
                            className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden"
                            style={{ height: '100vh' }}
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <Skeleton count={15} height={54} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>{' '}
        </>
    );
};

export default ActionsOverview;
