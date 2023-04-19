import { getSingleGCPIdentityDetails } from 'core/services/IdentitiesAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { GCPIdentityResourceDetails } from 'shared/models/IdentityAccessModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import GCPSingleIdentityTableView from './components/GCPSingleIdentityTableView';
import GCPResourcePermissions from './gcp_single_resource_permissions/GCPResourcePermissions';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';

const GCPIdentityResources = () => {
    const [identityResourceDetails, setIdentityResourceDetails] = useState<GCPIdentityResourceDetails[]>([]);
    const [selectedResourceDetails, setSelectedResourceDetails] = useState<GCPIdentityResourceDetails | null>(null);
    const [isAPILoading, setIsAPILoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type ? params?.type : '';
    const identityId = params?.rid ? params?.rid : '';

    useEffect(() => {
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
                { name: identityId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, NAV_TABS_VALUE.RESOURCES));
        /*------------------------------------------------ */

        setIsAPILoading(true);
        getSingleGCPIdentityDetails(cloudAccountId, type, identityId)
            .then((response: any) => {
                if (response) {
                    setIdentityResourceDetails(response);
                    setCurrentPage(currentPage);
                }
            })
            .finally(() => setIsAPILoading(false));
    }, []);

    const onClickRow = (identity: GCPIdentityResourceDetails, currentPage: number) => {
        setCurrentPage(currentPage);
        setSelectedResourceDetails(identity);
    };

    return (
        <div>
            {!selectedResourceDetails && (
                <>
                    <GCPSingleIdentityTableView
                        currentPage={currentPage}
                        data={identityResourceDetails}
                        isLoading={isAPILoading}
                        onClickRow={onClickRow}
                        translate={t}
                    />
                </>
            )}

            {selectedResourceDetails && (
                <div>
                    <div className="container-fluid mt-3">
                        <div className="d-flex align-items-center">
                            <div className="container p-0">
                                <div className="h5">
                                    <CIcon
                                        icon={cilArrowLeft}
                                        size="xl"
                                        className="me-2 pt-2 cursor-pointer text-primary"
                                        onClick={() => setSelectedResourceDetails(null)}
                                    />
                                    <span className="title">{selectedResourceDetails.resource_name}</span>
                                </div>
                                <div className="h6 text-neutral">{selectedResourceDetails.resource_type}</div>
                            </div>
                        </div>
                    </div>
                    <GCPResourcePermissions
                        translate={t}
                        identityId={identityId}
                        cloudAccountId={cloudAccountId}
                        resourceId={selectedResourceDetails.resource_id}
                        identityType={type}
                    />
                </div>
            )}
        </div>
    );
};

export default GCPIdentityResources;
