import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IdentityDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { CBadge, CModal, CModalBody, CModalHeader, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilElevator, cilSortAlphaDown, cilSortAlphaUp, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import {
    addTags,
    DeleteTags,
    getAllPlatformTags,
    getGenericTags,
    UpdateTags,
} from 'core/services/DataEndpointsAPIService';
import AddTag from 'modules/single_account/data_endpoints/data_endpoints_summary/components/AddTag';
import { useMutation } from '@tanstack/react-query';
import EditTag from 'modules/single_account/data_endpoints/data_endpoints_summary/components/EditTag';
import ShowAllTags from 'modules/single_account/data_endpoints/data_endpoints_summary/components/ShowAllTags';
import { getIdentityOverview } from 'core/services/IdentitiesAPIService';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';

type TableComponentProps = {
    data: IdentityDetails[];
    onClickRow: (identityId: string) => void;
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
    accessType?: any;
    setRefreshData?: any;
    refresh?: boolean;
    identityType?: any;
    showBulkTagging?: boolean;
    setShowBulkTagging?: any;
    openPlatformTags?: any;
    selectedTab?: any;
};

const PageSize = 15;

const fedValue: any = {
    aws_FedOkta: 'FedOkta',
    aws_SCIMUser: 'SCIMUser',
    aws_SCIMGroup: 'SCIMGroup',
};

const UsersTableComponent = ({
    selectedTab,
    data,
    onClickRow,
    isLoading,
    translate,
    currentPageNo,
    accessType,
    setRefreshData,
    identityType,
    showBulkTagging,
    setShowBulkTagging,
}: TableComponentProps) => {
    const [ResourceId, setResourceId] = useState<any>('');
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const [allData, setAllData] = useState<IdentityDetails[]>([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [sortOrderUser, setSortOrderUser] = useState('');
    const [sortOrderResource, setSortOrderResource] = useState('');
    const [selectedTaggedData, setSelectedTaggedData] = useState([]);
    const [show, setShowDialogFlag] = useState(false);

    const [, setAllPlatformTags] = useState<any>();
    const params = useParams<any>();
    const [showAddTag, setShowAddTag] = useState<boolean>(false);
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const [selectedBucketId, setSelectedBucketId] = useState<any>();

    const [showEditTag, setShowEditTag] = useState<boolean>(false);
    const [tag_id, setTagId] = useState<any>('');
    const [editKey, setEditKey] = useState<any>();
    const [editValue, setEditValue] = useState<any>();

    const [showAllTags, setShowAllTags] = useState<boolean>(false);
    const [selectedPlatformTags, setSelectedPlatformTags] = useState<any>([]);
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId: any = userDetails?.org.organisation_id;
    const { data: ganericTagData } = getGenericTags(cloudAccountId);
    const [, setIdentityOverview] = useState<any>();
    const [identityOverviewArray, setIdentityOverviewArray] = useState<any>();
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const {
        data: plateformTags,
        isSuccess: isSucess,
        isLoading: plateformTagsLoading,
        isError: plateformTagsError,
        refetch: refetchgetAllPlatformTags,
    } = getAllPlatformTags(cloudAccountId, params?.type);
    useEffect(() => {
        const identityIdArray: any[] = [];
        if (data && data.length > 0) {
            data.map((bucket: any) => {
                identityIdArray.push(bucket.identity_id);
            });
            setIdentityOverviewArray(identityIdArray);
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
        setAllData(data);

        if (isSucess) {
            setAllPlatformTags(groupByKey(plateformTags, 'resource_id'));

            if (data && data.length) {
                data.map((bucket: any) => {
                    bucket.platformTags = plateformTags.filter((x: any) => x.resource_id === bucket.identity_id);
                });
            }
        }
    }, [data, plateformTags, plateformTagsLoading]);
    const {
        data: identityOverview,
        isSuccess: isIdentitySucess,
        isLoading: identityOverviewLoading,
        isError: identityOverviewError,
    } = getIdentityOverview(JSON.stringify(cloudAccountId), orgId, discoveryId, identityOverviewArray);

    useEffect(() => {
        if (isIdentitySucess) {
            setIdentityOverview(identityOverview);
        }
    }, [identityOverviewLoading]);
    //insert data call
    const mutation = useMutation({
        mutationFn: (tags: any) => {
            return addTags(tags);
        },
        onSuccess: () => {
            refetchgetAllPlatformTags();
        },
    });
    //update data call
    const updateMutation = useMutation({
        mutationFn: (tags: any) => {
            return UpdateTags(tags);
        },
        onSuccess: () => {
            refetchgetAllPlatformTags();
        },
    });
    //delete data call
    const deleteMutation = useMutation({
        mutationFn: (tags: any) => {
            return DeleteTags(tags);
        },
        onSuccess: () => {
            refetchgetAllPlatformTags();
        },
    });
    const handleAddTagform = (body: any) => {
        mutation.mutate(body);
    };

    // group by category
    function groupByKey(array: [], key: string) {
        return array.reduce((hash: any, obj: any) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
        }, {});
    }
    const handleUpdate = (event: any, data: any) => {
        event.stopPropagation();
        setShowAllTags(false);
        setShowEditTag(false);
        setRefreshData(false);
        let body: any = {};

        body = {
            tag_id: data?.tag_id,
            tag_key: data.editKey,
            tag_value: data.editValue,
            resource_ids: data.selectedId,
            resource_type: params?.type,
        };

        updateMutation.mutate(body);
    };
    const handleDelete = (e: any, data: any, type: any) => {
        e.stopPropagation();
        if (type == 'soft_delete') {
            const body = {
                tag_id: `${data}`,
                cloud_account_id: `${cloudAccountId}`,
                resource_type: `${identityType}`,
                resource_ids: selectedBucketId,
            };
            deleteMutation.mutate({ body, type });
        } else {
            e.stopPropagation();
            const body = {
                tag_id: data,
            };
            deleteMutation.mutate({ body });
        }
        setRefreshData(false);
        setShowAllTags(false);
        setShowEditTag(false);
    };
    const handleEditTag = (event: any, key: any, value: any, tag: any, tag_id: any, platformTags: any) => {
        const selectedTag = platformTags?.filter((item: any) => item.tag_id == tag_id);
        setSelectedPlatformTags(selectedTag);
        setResourceId(tag);
        event.stopPropagation();
        setShowEditTag(true);

        setEditKey(key);
        setEditValue(value);
        setTagId(tag_id);
    };
    const handleShowTags = (event: any, platformTags: any) => {
        event.stopPropagation();
        setShowAllTags(true);
        setSelectedPlatformTags(platformTags);
    };

    //sorting Data column
    const sorting = (title: any) => {
        if (sortOrder === 'ascending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] > b[title] ? 1 : -1));
            if (title === 'identity_name') {
                setSortOrderUser('ascending');
            } else if (title === 'resource_ids_count') {
                setSortOrderResource('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'identity_name') {
                setSortOrderUser('descending');
            } else if (title === 'resource_ids_count') {
                setSortOrderResource('descending');
            }
            setAllData(sortedData);
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };

    const openAllNativeTags = (data: any, e: any) => {
        e.stopPropagation();
        if (data.policy_tags.length > 0) {
            setSelectedTaggedData(data.policy_tags);
            setShowDialogFlag(true);
        }
    };

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return allData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, allData]);
    const handleAddTag = (event: any) => {
        event.stopPropagation();
        setShowAddTag(true);
    };

    return (
        <>
            <table className="table table-borderless table-hover custom-table container mt-4 rounded overflow-hidden">
                <thead>
                    <tr>
                        {/* <th className="ps-4 w-20 no-pointer"> {translate('risk_type')}</th> */}
                        <th onClick={() => sorting('identity_name')} className="ps-4 w-40">
                            {sortOrderUser === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="mx-1" />
                            ) : sortOrderUser === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="mx-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="mx-1" />
                            )}
                            {allData[0]?.identity_type === IdentityType.AwsIAMRole
                                ? translate('role')
                                : translate('user')}
                        </th>
                        {selectedTab === IdentityType.AwsFederated && <th>Identity Type</th>}

                        {/* added new tooltip */}
                        <th className="w-15 no-pointer px-3">
                            <CTooltip
                                content="Tags enable you to categorize your Cloud resources in different ways, 
                            for example, by purpose, owner, or environment or application or Data sensitivity"
                                placement="top"
                            >
                                <span>(#) {translate('tags')}</span>
                            </CTooltip>
                        </th>

                        <th className="w-15 no-pointer px-3">Platform {translate('tags')}</th>
                        {accessType !== 'unused_access' && (
                            <CTooltip content="Last activity by User">
                                <th className="w-15 no-pointer">
                                    {translate('last_activity')} {'(' + translate('data_assets') + ')'}
                                </th>
                            </CTooltip>
                        )}
                        <th onClick={() => sorting('resource_ids_count')} className="w-15">
                            {sortOrderResource === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="mx-1" />
                            ) : sortOrderResource === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="mx-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="mx-1" />
                            )}
                            # {translate('resource_access')}
                        </th>
                        <th className="no-pointer px-3">{translate('risk_score')}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="p-0">
                                <Skeleton count={7} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData?.length > 0 &&
                                currentTableData?.map((item: IdentityDetails, index: number) => (
                                    <tr key={index} onClick={() => onClickRow(item.identity_id)}>
                                        {/* <td className="ps-4"> - </td> */}
                                        <td className={`align-items-center ${!item.is_admin_permission && 'ps-4'}`}>
                                            {item.is_admin_permission && (
                                                <React.Fragment>
                                                    <CTooltip
                                                        trigger="hover"
                                                        placement="bottom"
                                                        content={translate('admin') + ' ' + translate('permission')}
                                                    >
                                                        <div className="cursor-pointer d-inline mt-1 me-2">
                                                            <CIcon icon={cilUser} className="pe-1" />
                                                        </div>
                                                    </CTooltip>
                                                </React.Fragment>
                                            )}
                                            {item.identity_name}
                                        </td>
                                        {allData[0]?.identity_type === IdentityType.AwsFedOkta && (
                                            <td className={'ps-1 w-10'}>{fedValue[item?.identity_type]}</td>
                                        )}

                                        <td className="w-10">
                                            <div
                                                role="presentation"
                                                className="word-ellips"
                                                onClick={(e) => {
                                                    openAllNativeTags(item, e);
                                                }}
                                            >
                                                <CTooltip
                                                    trigger="hover"
                                                    placement="bottom"
                                                    content={`${
                                                        item?.policy_tags && item?.policy_tags?.length > 0
                                                            ? `${
                                                                  item?.policy_tags[0]
                                                                      ? item?.policy_tags[0]?.Key +
                                                                        '=' +
                                                                        item?.policy_tags[0]?.Value
                                                                      : ''
                                                              }`
                                                            : 'Not Tagged'
                                                    }`}
                                                >
                                                    <span>
                                                        {item?.policy_tags && item?.policy_tags?.length > 0
                                                            ? '(' + item?.policy_tags.length + ') '
                                                            : '(0) '}
                                                        {item?.policy_tags && item?.policy_tags?.length > 0
                                                            ? item?.policy_tags[0].Key +
                                                              '=' +
                                                              item?.policy_tags[0]?.Value
                                                            : '-'}
                                                    </span>
                                                </CTooltip>
                                            </div>
                                        </td>
                                        {plateformTagsLoading ? (
                                            <td className="w-10">
                                                <Skeleton count={3} height={10} />
                                            </td>
                                        ) : (
                                            !plateformTagsError && (
                                                <td className="w-10">
                                                    <div aria-hidden="true" className="float-start">
                                                        {item.platformTags &&
                                                            item.platformTags.slice(0, 3).map((tag: any, i: any) => (
                                                                <CTooltip
                                                                    key={i}
                                                                    trigger="hover"
                                                                    placement="bottom"
                                                                    content={`Edit ${tag.tag_key}`}
                                                                >
                                                                    <CBadge
                                                                        color="info"
                                                                        shape="rounded-pill"
                                                                        className="me-1"
                                                                        onClick={(e) => {
                                                                            setSelectedBucketId([item.identity_id]);
                                                                            handleEditTag(
                                                                                e,
                                                                                tag.tag_key,
                                                                                tag.tag_value,
                                                                                tag.resource_id,
                                                                                tag.tag_id,
                                                                                item.platformTags,
                                                                            );
                                                                        }}
                                                                    >
                                                                        {tag.tag_key}={tag.tag_value}
                                                                    </CBadge>
                                                                </CTooltip>
                                                            ))}
                                                    </div>
                                                    {item.platformTags && item.platformTags.length > 3 && (
                                                        <CTooltip
                                                            trigger="hover"
                                                            placement="bottom"
                                                            content="Show more"
                                                        >
                                                            <CBadge
                                                                color="primary"
                                                                shape="rounded-pill"
                                                                className="me-1"
                                                                onClick={(e) => {
                                                                    setSelectedBucketId([item.identity_id]);
                                                                    handleShowTags(e, item.platformTags);
                                                                }}
                                                            >
                                                                Show all {item.platformTags.length}
                                                            </CBadge>
                                                        </CTooltip>
                                                    )}
                                                    <CTooltip trigger="hover" placement="bottom" content="Add Tag">
                                                        <CBadge
                                                            color="primary"
                                                            shape="rounded-pill"
                                                            onClick={(e) => {
                                                                setSelectedBucketId([item.identity_id]);
                                                                handleAddTag(e);
                                                            }}
                                                        >
                                                            Add tag
                                                        </CBadge>
                                                    </CTooltip>
                                                </td>
                                            )
                                        )}

                                        {accessType !== 'unused_access' && (
                                            <td>
                                                {item?.last_activity && item?.last_activity > -1 ? (
                                                    <div>
                                                        <div>
                                                            {dayjs(item?.last_activity).format('hh:mm A')} |
                                                            {dayjs(item?.last_activity).format('MMMM DD, YYYY')}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div> - </div>
                                                )}
                                            </td>
                                        )}
                                        <td> {item.resource_ids_count}</td>
                                        {identityOverviewLoading ? (
                                            <td className="w-20">
                                                <Skeleton count={3} height={10} />
                                            </td>
                                        ) : (
                                            !identityOverviewError && (
                                                <td>
                                                    {identityOverview?.map((identity: any) =>
                                                        identity.identity_name == item.identity_name
                                                            ? identity.risk_score == null
                                                                ? '-'
                                                                : identity.risk_score
                                                            : null,
                                                    )}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            {currentTableData.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={6}>{translate('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            <CModal
                className="tag-modal"
                visible={show}
                onClose={() => setShowDialogFlag(false)}
                aria-labelledby="example-custom-modal-styling-title"
                alignment="center"
            >
                <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                    <div className="h4">
                        {translate('tags')} ({selectedTaggedData.length})
                    </div>
                </CModalHeader>
                <CModalBody className="pt-1 pb-1">
                    <table className="table table-borderless table-hover custom-table container shadow-6 no-pointer rounded overflow-hidden">
                        <thead className="border-bottom font-small-semibold">
                            <tr>
                                <th className="no-pointer">{translate('key')}</th>
                                <th className="no-pointer">{translate('value')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTaggedData.map((ev: any, key: any) => {
                                return (
                                    <tr key={key}>
                                        <td className="p-2 no-pointer">{ev.Key}</td>
                                        <td className="p-2 no-pointer">{ev.Value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CModalBody>
            </CModal>

            {(showAddTag || showBulkTagging) && (
                <AddTag
                    data={allData}
                    type={showAddTag ? 'Add' : 'Bulk'}
                    open={showAddTag ? showAddTag : showBulkTagging}
                    setOpen={showAddTag ? setShowAddTag : setShowBulkTagging}
                    translte={translate}
                    cloudAccountId={cloudAccountId}
                    genericTags={ganericTagData}
                    resourceType={params?.type}
                    selectedBucketId={selectedBucketId}
                    setSelectedBucketIds={setSelectedBucketId}
                    currentPage={currentPage}
                    handleAddTag={handleAddTagform}
                    onPageChange={(page: number) => {
                        setCurrentPage(page);
                        // navigate('?pageNo=' + page);
                    }}
                />
            )}
            {showAllTags && (
                <ShowAllTags
                    data={selectedPlatformTags}
                    open={showAllTags}
                    setOpen={setShowAllTags}
                    translte={translate}
                    handleUpdate={(event: any, data: any) => handleUpdate(event, data)}
                    handleDelete={(event: any, data: any, type: string) => handleDelete(event, data, type)}
                />
            )}
            {showEditTag && (
                <EditTag
                    resource_id={ResourceId}
                    tagKey={editKey}
                    tagValue={editValue}
                    data={allData}
                    data1={selectedPlatformTags}
                    open={showEditTag}
                    tag_id={tag_id}
                    setOpen={setShowEditTag}
                    cloudAccountId={cloudAccountId}
                    translte={translate}
                    resourceType={params?.type}
                    selectedBucketId={selectedBucketId}
                    setSelectedBucketIds={setSelectedBucketId}
                    handleUpdate={(event: any, data: any) => handleUpdate(event, data)}
                    handleAddTag={handleAddTagform}
                    handleDelete={(event: any, data: any, type: string) => handleDelete(event, data, type)}
                />
            )}
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    navigate('?pageNo=' + page);
                }}
            />
        </>
    );
};

export default React.memo(UsersTableComponent);
