import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ResourcePermissions } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { getIdentityConnectionsMap } from 'core/services/IdentitiesAPIService';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setTabsAction } from 'store/actions/TabsStateActions';

type TableComponentProps = {
    data: ResourcePermissions[];
    isLoading: boolean;
    translate: any;
    identityId: any;
};

const PageSize = 15;

const ResourcePermissionsTableComponent = ({ data, isLoading, translate, identityId }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const params = useParams<any>();
    const resourceId: string | undefined = params?.rid ? params?.rid : '';
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const [policyName, setPolicyName] = useState<any>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (data && data.length > 0) setCurrentPage(1);
    }, [data]);

    useEffect(() => {
        getIdentityConnectionsMap(cloudAccountId, resourceId, discoveryId)
            .then((response: any) => {
                const nodes = response?.nodes;
                setPolicyName(Object.values(nodes));
            })
            .catch((error: any) => {
                console.log('in error', error);
            });
    }, [discoveryId]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, data]);

    const naviagateToIdentityScreen = (identityId: string) => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, 'Identity Map'));
        navigate(
            '/accounts/' +
                cloudAccountId +
                '/AWS/identities/aws_IAMRole/' +
                identityId +
                '/' +
                NAV_TABS_VALUE.IDENTITY_MAP,
        );
    };

    return (
        <>
            <table className="table table-borderless custom-table container mt-4">
                <thead>
                    <tr>
                        <th className="ps-5"> {translate('permission_name')} </th>
                        <th> {translate('permission_type')} </th>
                        <th> {translate('policy_name')} </th>
                        <th> Policy {translate('risk_score')}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="p-0">
                                <Skeleton count={6} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: ResourcePermissions, index: number) => (
                                    <tr key={index}>
                                        <td className="w-30 text-truncate ps-5" title={item.permission_name}>
                                            {item.permission_name == '*' ? (
                                                <b className="text-black">{item.permission_name}</b>
                                            ) : (
                                                item.permission_name
                                            )}
                                        </td>
                                        <td> {item.permission_type}</td>
                                        <td>
                                            {item.policies.map((policy: string, i: number) => (
                                                <span key={i}>
                                                    <span> {policy}</span>
                                                    {i <= item.policies.length - 2 && <span>, </span>}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="pointer">
                                            {item.policies.map((policy: string, i: number) =>
                                                policyName
                                                    .filter((riskPolicy: { name: string }) => riskPolicy.name == policy)
                                                    .map((risk: any) => (
                                                        <span
                                                            key={i}
                                                            onClickCapture={() => naviagateToIdentityScreen(identityId)}
                                                        >
                                                            <span>{risk.si_risk_score}</span>
                                                            {i <= item.policies.length - 2 && <span>, </span>}
                                                        </span>
                                                    )),
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            {currentTableData?.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={4}>{translate('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={data?.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>
    );
};

export default React.memo(ResourcePermissionsTableComponent);
