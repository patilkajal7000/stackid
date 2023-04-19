import { CAccordion, CAccordionCollapse, CAccordionItem } from '@coreui/react';
import { getTableIdentities } from 'core/services/DataEndpointsAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import SearchInput from 'shared/components/search_input/SearchInput';
import { GCPIdentityDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { setTabsAction } from 'store/actions/TabsStateActions';
import DatasetIdentitiesTable from '../../../identities_tab/components/DatasetIdentitiesTable';

type CustomTab = {
    name: string;
    type: IdentityType;
};

type DatasetIdentitiesProps = {
    cloudAccountId: number;
    datasetName: string;
    tableId: string;
};
const TableIdentities = (props: DatasetIdentitiesProps) => {
    const [subTabList, setSubTabList] = useState<CustomTab[]>([]);
    const [selectedSubTab, setSelectedSubTab] = useState<IdentityType>(IdentityType.GCPUserHuman);
    const [filteredRecords, setFilteredData] = useState<GCPIdentityDetails[]>([]);
    const [identities, setIdentities] = useState<GCPIdentityDetails[]>([]);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedIdentity, setSelectedIdentity] = useState<GCPIdentityDetails>();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo');

    useEffect(() => {
        dispatch(setTabsAction(SCREEN_NAME.SINGLE_DATASET_TABLE, NAV_TABS_VALUE.IDENTITIES));
        const tabs = [
            {
                name: t('human') + ' ' + t('identities'),
                type: IdentityType.GCPUserHuman,
            },
            {
                name: t('applications') + ' ' + t('identities'),
                type: IdentityType.GCPUserApplication,
            },
        ];

        setSubTabList(tabs);
    }, []);

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
        }
        setIsLoading(true);
        setIdentities([]);
        setFilteredData([]);
        getTableIdentities(props.cloudAccountId, props.datasetName, props.tableId, selectedSubTab)
            .then((response: any) => {
                setIsLoading(false);
                if (response) {
                    setIdentities(response);
                    setFilteredData(response);
                }
            })
            .catch((error: any) => {
                setIsLoading(false);
                console.log('in error', error);
            });
    }, [selectedSubTab]);

    const onClickView = (identityDetails: GCPIdentityDetails) => {
        setSelectedIdentity(identityDetails);
        setShowPermissionModal(true);
    };

    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (identities) {
                if (searchString.length >= MIN_SEARCH_LENGTH) {
                    const selectedIdentities = identities?.filter((data: GCPIdentityDetails) =>
                        data.name.toLowerCase().includes(searchString.toLowerCase()),
                    );
                    if (selectedIdentities && selectedIdentities.length > 0) {
                        setFilteredData(selectedIdentities);
                        callback && callback('');
                    } else {
                        setFilteredData([]);
                        callback && callback('No Items found.');
                    }
                } else {
                    setFilteredData(identities);
                }
            }
        },
        [identities],
    );

    return (
        <div className="container">
            <nav className="nav nav-custom nav-box text-center my-3">
                {subTabList &&
                    subTabList.map((tab: CustomTab, index: number) => (
                        <span
                            key={index}
                            className={`nav-link font-small-semibold ${selectedSubTab == tab.type ? 'active' : ''} `}
                            onClick={() => {
                                setSelectedSubTab(tab.type);
                            }}
                            role="presentation"
                        >
                            {tab.name}
                        </span>
                    ))}
            </nav>

            <div className="my-2">
                <SearchInput onSearch={onSearch} placeholder="Search" />
            </div>

            <DatasetIdentitiesTable
                currentPageNo={currentPage}
                data={filteredRecords}
                isLoading={isLoading}
                onClickView={onClickView}
                translate={t}
            />

            <CustomModal
                show={showPermissionModal}
                onHide={() => setShowPermissionModal(false)}
                className="square-corner"
            >
                <div className="h3 mt-2">{selectedIdentity?.name}</div>
                {selectedIdentity && (
                    <PopupModal
                        permissionDetails={selectedIdentity.permission_details.permissions}
                        userName={selectedIdentity.name}
                        translate={t}
                        roleName={selectedIdentity.permission_details.role_name}
                    />
                )}
            </CustomModal>
        </div>
    );
};

export default TableIdentities;

type PopupModlProps = {
    permissionDetails: { [key: string]: string[] };
    roleName: string;
    userName: string;
    translate: any;
};

const PopupModal = (props: PopupModlProps) => {
    /* 
    const ContextAwareToggle = (keyObj: { eventKey: string }, callback: (arg0: string) => string) => {
        const currentEventKey = useContext(AccordionContext);
        const eventKey = keyObj.eventKey;
        const isCurrentEventKey = currentEventKey === eventKey;
        return (
            <div className="ms-auto">
                {isCurrentEventKey ? <Remove className="toggle-icon" /> : <Add className="toggle-icon" />}
            </div>
        );
    };
    */
    return (
        <>
            <div className="mt-3">
                <div className="font-small-semibold mb-2">Role: {props.roleName}</div>
                {Object.keys(props.permissionDetails as unknown as string).map(
                    (highLevelPermission: string, index: number) => (
                        <CAccordion key={index} className="custom-accordion mt-2">
                            <CAccordionItem
                                itemKey={'highLevelPermission' + index}
                                className="accordion-header"
                                onClick={(e) => {
                                    console.log(e);
                                }}
                            >
                                <div className="d-flex w-100 font-small-semibold ">
                                    <div className="text-uppercase">
                                        {highLevelPermission}: {props.permissionDetails[highLevelPermission].length}
                                    </div>
                                    {/* <ContextAwareToggle eventKey={'highLevelPermission' + index}></ContextAwareToggle> */}
                                </div>
                            </CAccordionItem>
                            <CAccordionCollapse>
                                <div className="d-flex flex-wrap mx-5 my-2">
                                    {props.permissionDetails[highLevelPermission].map(
                                        (action: string, index: number) => (
                                            <div
                                                className="w-50 my-2 font-small text-neutral-900"
                                                key={'action' + index}
                                            >
                                                {' '}
                                                {action}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CAccordionCollapse>
                        </CAccordion>
                    ),
                )}
            </div>
        </>
    );
};
