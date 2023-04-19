import React, { useState, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DataEndpointResorceModel } from 'shared/models/DataEndpointSummaryModel';
import { SeverityType } from 'shared/models/RHSModel';
import { getSeverityScoreColor } from 'shared/service/Severity.service';
import Pagination from 'shared/components/pagination/Pagination';
import { CBadge, CImage, CModal, CModalBody, CModalHeader, CTooltip } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSortAlphaDown, cilSortAlphaUp, cilElevator } from '@coreui/icons';
import ShowAllTags from './ShowAllTags';
import AddTag from './AddTag';
import {
    addTags,
    DeleteTags,
    getAllDissmisedRisks,
    getAllPlatformTags,
    getGenericTags,
    UpdateTags,
} from 'core/services/DataEndpointsAPIService';
import { useMutation } from '@tanstack/react-query';
import EditTag from './EditTag';
import { AppState } from 'store/store';
import { useSelector } from 'react-redux';

type TableComponentProps = {
    handleOnCSV: (data: DataEndpointResorceModel[]) => void;
    handleOnPDF: (data: DataEndpointResorceModel[]) => void;
    data: DataEndpointResorceModel[];
    onClickRow: (data: DataEndpointResorceModel, e: any) => void;
    isLoading: boolean;
    translate: any;
    resourceType: string;
    showBulkTagging: boolean;
    setShowBulkTagging?: any;
    openPlatformTags?: any;
};

const TableComponent = ({
    handleOnCSV,
    handleOnPDF,
    data: s3Data,
    onClickRow,
    isLoading,
    translate: translte,
    resourceType,
    showBulkTagging,
    setShowBulkTagging,
}: TableComponentProps) => {
    const [allData, setAllData] = useState<DataEndpointResorceModel[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [ResourceId, setResourceId] = useState<any>('');
    const [sortOrderName, setSortOrderName] = useState('');
    const [sortOrderBPI, setSortOrderBPI] = useState('');
    const [selectedTaggedData, setSelectedTaggedData] = useState([]);
    const [classificationTaggedData, setClassificationTaggedData] = useState([]);
    const [show, setShowDialogFlag] = useState(false);
    const [selectedBucketId, setSelectedBucketId] = useState<any>();

    const [showEditTag, setShowEditTag] = useState<boolean>(false);
    const [tag_id, setTagId] = useState<any>('');
    const [editKey, setEditKey] = useState<any>();
    const [editValue, setEditValue] = useState<any>();

    const [showAllTags, setShowAllTags] = useState<boolean>(false);
    const [selectedPlatformTags, setSelectedPlatformTags] = useState<any>([]);
    const [showAddTag, setShowAddTag] = useState<boolean>(false);
    const [, setAllPlatformTags] = useState<any>();

    // const [topPlatformTags, setTopPlatformTags] = useState<any>([]);
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;

    const PageSize = 15;
    const currentPageNo = 1;

    const { data: dismissedRisks, refetch: refetchgetAllDismissedRisks } = getAllDissmisedRisks(orgId, cloudAccountId);

    useEffect(() => {
        refetchgetAllDismissedRisks();
    }, []);

    const {
        data: plateformTags,
        isSuccess: isSucess,
        isLoading: plateformTagsLoading,
        isError: plateformTagsError,
        refetch: refetchgetAllPlatformTags,
    } = getAllPlatformTags(cloudAccountId, params?.type);

    useEffect(() => {
        if (s3Data && s3Data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
        setAllData(s3Data);
        if (isSucess) {
            setAllPlatformTags(groupByKey(plateformTags, 'resource_id'));

            if (s3Data && s3Data.length) {
                s3Data.map((bucket: any) => {
                    bucket.platformTags = plateformTags.filter((x: any) => x.resource_id === bucket.id);
                });
            }
        }
    }, [s3Data, plateformTags]);
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

    const { data: ganericTagData } = getGenericTags(cloudAccountId);

    // group by category
    function groupByKey(array: [], key: string) {
        return array.reduce((hash: any, obj: any) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
        }, {});
    }

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return allData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, allData]);

    const sorting = (title: any) => {
        if (sortOrder === 'ascending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] > b[title] ? 1 : -1));
            if (title === 'name') {
                setSortOrderName('ascending');
            } else if (title === 'risk_score') {
                setSortOrderBPI('ascending');
            }
            setAllData(sortedData);
            setSortOrder('descending');
        } else if (sortOrder === 'descending') {
            const sortedData = [...allData].sort((a: any, b: any) => (a[title] < b[title] ? 1 : -1));
            if (title === 'name') {
                setSortOrderName('descending');
            } else if (title === 'risk_score') {
                setSortOrderBPI('descending');
            }
            setAllData(sortedData);
            setSortOrder('ascending');
        } else {
            setSortOrder('');
        }
    };

    const openAllNativeTags = (data: any, e: any) => {
        e.stopPropagation();

        if (data?.native_tags) {
            data.native_tags.unshift(
                data.native_tags.splice(
                    data.native_tags.findIndex((item: any) => item.Key === classificationTaggedData),
                    1,
                )[0],
            );
            setSelectedTaggedData(data.native_tags);
            setShowDialogFlag(true);
        }
    };

    const handleEditTag = (event: any, key: any, value: any, tag: any, tag_id: any, platformTags: any) => {
        const selectedTag = platformTags.filter((item: any) => item.tag_id == tag_id);

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

    const handleAddTag = (event: any) => {
        event.stopPropagation();
        setShowAddTag(true);
    };

    useEffect(() => {
        currentTableData.length > 0 &&
            currentTableData?.map((data: any) => {
                if (data?.data_classification_tags) {
                    setClassificationTaggedData(data?.data_classification_tags[0]);
                }
            });
    }, [currentTableData]);

    useEffect(() => {
        handleOnPDF(allData);
        handleOnCSV(allData);
    }, [allData]);
    const handleUpdate = (event: any, data: any) => {
        event.stopPropagation();
        setShowAllTags(false);
        setShowEditTag(false);

        let body: any = {};

        body = {
            tag_id: data?.tag_id,
            tag_key: data.editKey,
            tag_value: data.editValue,
            resource_type: `${resourceType}`,
            resource_ids: data.selectedId,
        };

        updateMutation.mutate(body);
    };
    const handleDelete = (e: any, data: any, type: any) => {
        e.stopPropagation();
        if (type == 'soft_delete') {
            const body = {
                tag_id: `${data}`,
                cloud_account_id: `${cloudAccountId}`,
                resource_type: `${resourceType}`,
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
        setShowAllTags(false);
        setShowEditTag(false);
    };

    return (
        <div className="container px-0">
            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                <thead className="border-bottom font-small-semibold">
                    <tr>
                        <th onClick={() => sorting('name')} className="w-30 px-4">
                            {sortOrderName === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="me-1" />
                            ) : sortOrderName === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="me-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="me-1" />
                            )}
                            {resourceType === 'aws_S3' ? translte('bucket_name') : translte('name')}
                        </th>
                        <th onClick={() => sorting('risk_score')} className="w-5 px-3">
                            {sortOrderBPI === 'ascending' ? (
                                <CIcon icon={cilSortAlphaDown} className="me-1" />
                            ) : sortOrderBPI === 'descending' ? (
                                <CIcon icon={cilSortAlphaUp} className="me-1" />
                            ) : (
                                <CIcon icon={cilElevator} className="me-1" />
                            )}
                            <CTooltip content="Breach Prediction Index">
                                <span>{translte('bpi')}</span>
                            </CTooltip>
                        </th>
                        <th className="w-10 no-pointer px-3">
                            <CTooltip content="Severity level ">
                                <span>{translte('status')}</span>
                            </CTooltip>
                        </th>

                        <th className="w-10 no-pointer px-3">(#) {translte('tags')}</th>
                        <th className="w-15 no-pointer px-3">Platform {translte('tags')}</th>

                        {resourceType === 'bq_Dataset' && <th className="w-10">{translte('classification')}</th>}
                        <th className="w-15 no-pointer px-3">{translte('data_security')}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <Skeleton count={3} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData.length > 0 &&
                                currentTableData?.map((data: DataEndpointResorceModel, index: number) => {
                                    const risk_score_percentage = data.risk_score | 0;
                                    return Object.values(SeverityType).map((val: any) => {
                                        if (getSeverityScoreColor(risk_score_percentage) === val) {
                                            return (
                                                <tr
                                                    key={data.id}
                                                    onClick={(e) =>
                                                        resourceType === 'aws_RDSInstance' ||
                                                        resourceType === 'aws_RDSCluster' ||
                                                        resourceType === 'aws_DynamoDBTable' ||
                                                        resourceType === 'aws_DynamoDBExport'
                                                            ? onClickRow(data, e)
                                                            : onClickRow(data, e)
                                                    }
                                                    className={` cursor-pointer w-40 ${
                                                        s3Data.length - 1 !== index ? 'border-bottom' : ''
                                                    }`}
                                                >
                                                    <td
                                                        className={
                                                            dismissedRisks?.resources?.includes(data.name)
                                                                ? `text-primary px-4`
                                                                : `px-4`
                                                        }
                                                    >
                                                        <div className="">{data.name}</div>
                                                    </td>
                                                    <td className="w-10 ">
                                                        {dismissedRisks?.resources?.includes(data.name)
                                                            ? 0
                                                            : risk_score_percentage}
                                                        %{/* <ArrowUpwardIcon className={`${val}-icon-color`} /> */}
                                                    </td>
                                                    <td className="w-10">
                                                        <div className="d-flex flex-row align-items-center justify-content-start ">
                                                            {dismissedRisks?.resources?.includes(data.name) ? (
                                                                <>
                                                                    <em
                                                                        className={`${
                                                                            SeverityType.LOW
                                                                        }-icon-color me-1 icon-${SeverityType.LOW.toLowerCase()}`}
                                                                    />
                                                                    <div
                                                                        className={`font-small-semibold ${SeverityType.LOW}-icon-color`}
                                                                    >
                                                                        {SeverityType.LOW}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <em
                                                                        className={`${val}-icon-color me-1 icon-${val.toLowerCase()}`}
                                                                    />
                                                                    <div
                                                                        className={`font-small-semibold ${val}-icon-color`}
                                                                    >
                                                                        {val}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="w-10">
                                                        <div
                                                            role="presentation"
                                                            className="word-ellips"
                                                            onClick={(e) => {
                                                                openAllNativeTags(data, e);
                                                            }}
                                                        >
                                                            <CTooltip
                                                                trigger="hover"
                                                                content={`${
                                                                    data?.data_classification_tags
                                                                        ? data?.data_classification_tags
                                                                        : data?.native_tags
                                                                        ? data?.native_tags[0]?.Key +
                                                                          '=' +
                                                                          data?.native_tags[0]?.Value
                                                                        : 'Not Tagged'
                                                                }`}
                                                            >
                                                                <span>
                                                                    {data?.native_tags
                                                                        ? '(' + data?.native_tags.length + ') '
                                                                        : '(0) '}

                                                                    {data?.data_classification_tags
                                                                        ? data?.data_classification_tags
                                                                        : data?.native_tags
                                                                        ? data?.native_tags[0]?.Key +
                                                                          '=' +
                                                                          data?.native_tags[0]?.Value
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
                                                                    {data.platformTags &&
                                                                        data.platformTags
                                                                            .slice(0, 3)
                                                                            .map((tag: any, i: any) => (
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
                                                                                        onClick={(e) =>
                                                                                            handleEditTag(
                                                                                                e,
                                                                                                tag.tag_key,
                                                                                                tag.tag_value,
                                                                                                tag.resource_id,
                                                                                                tag.tag_id,
                                                                                                data.platformTags,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {tag.tag_key}={tag.tag_value}
                                                                                    </CBadge>
                                                                                </CTooltip>
                                                                            ))}
                                                                </div>
                                                                {data.platformTags && data.platformTags.length > 3 && (
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
                                                                                setSelectedBucketId([data.id]);
                                                                                handleShowTags(e, data.platformTags);
                                                                            }}
                                                                        >
                                                                            Show all {data.platformTags.length}
                                                                        </CBadge>
                                                                    </CTooltip>
                                                                )}
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    placement="bottom"
                                                                    content="Add Tag"
                                                                >
                                                                    <CBadge
                                                                        color="primary"
                                                                        shape="rounded-pill"
                                                                        onClick={(e) => {
                                                                            setSelectedBucketId([data.id]);
                                                                            handleAddTag(e);
                                                                        }}
                                                                    >
                                                                        Add tag
                                                                    </CBadge>
                                                                </CTooltip>
                                                            </td>
                                                        )
                                                    )}
                                                    {resourceType == 'bq_Dataset' && (
                                                        <td className="w-10"> {data?.native_tags?.classification} </td>
                                                    )}
                                                    <td className="px-3 py-1 ">
                                                        <div className="d-flex justify-content-start">
                                                            {data?.data_security?.is_encrypted ? (
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    content={translte('encryption_enabled')}
                                                                >
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir ">
                                                                        <em className="icon icon-alert-danger icon-lock font-20" />
                                                                    </div>
                                                                </CTooltip>
                                                            ) : (
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    content={translte('encryption_not_enabled')}
                                                                >
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                                                        <em className="icon icon-alert-danger icon-unlock font-20" />
                                                                    </div>
                                                                </CTooltip>
                                                            )}

                                                            {data?.data_security?.is_public ? (
                                                                <CTooltip trigger="hover" content={translte('public')}>
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                                                        <CImage
                                                                            src={require('assets/images/visibility_on.svg')}
                                                                            style={{
                                                                                filter: 'invert(57%) sepia(76%) saturate(2618%) hue-rotate(314deg) brightness(102%) contrast(101%)',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </CTooltip>
                                                            ) : (
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    content={translte('not_public')}
                                                                >
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir ">
                                                                        <CImage
                                                                            src={require('assets/images/visibility_off.svg')}
                                                                            style={{
                                                                                filter: 'invert(61%) sepia(18%) saturate(758%) hue-rotate(138deg) brightness(91%) contrast(87%)',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </CTooltip>
                                                            )}

                                                            {data?.data_security?.is_versioned ? (
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    content={translte('versioning_enabled')}
                                                                >
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                                        <em className="icon icon-alert-danger icon-stack font-20" />
                                                                    </div>
                                                                </CTooltip>
                                                            ) : (
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    content={translte('versioning_not_enabled')}
                                                                >
                                                                    <div className="m-1 d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-danger td-cir">
                                                                        <em className="icon icon-alert-danger icon-unstack font-20" />
                                                                    </div>
                                                                </CTooltip>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* <td>
                                                        <CDropdown>
                                                            <CDropdownToggle caret={false} className="p-0">
                                                                <MoreHorizIcon
                                                                    fontSize="medium"
                                                                    className="secondary-color"
                                                                />
                                                            </CDropdownToggle>
                                                        </CDropdown>
                                                    </td> */}
                                                </tr>
                                            );
                                        }
                                    });
                                })}
                            {currentTableData.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={6}>{translte('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            <CModal visible={show} alignment="center" className="tag-modal" onClose={() => setShowDialogFlag(false)}>
                <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                    <div className="h4">
                        {translte('tags')} ({selectedTaggedData.length})
                    </div>
                </CModalHeader>
                <CModalBody className="pt-1 pb-1">
                    <table className="table table-borderless table-hover custom-table container shadow-6 no-pointer rounded overflow-hidden">
                        <thead className="border-bottom">
                            <tr>
                                <th className="no-pointer">{translte('key')}</th>
                                <th className="no-pointer">{translte('value')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTaggedData.map((ev: any, key: any) => {
                                return (
                                    <tr
                                        className={`${classificationTaggedData === ev.Key ? 'classification-tag' : ''}`}
                                        key={key}
                                    >
                                        <td className="p-2 no-pointer">{ev.Key}</td>
                                        <td className="p-2 no-pointer">{ev.Value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CModalBody>
            </CModal>
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
                    translte={translte}
                    resourceType={params?.type}
                    handleUpdate={(event: any, data: any) => handleUpdate(event, data)}
                    handleAddTag={handleAddTagform}
                    handleDelete={(event: any, data: any, type: string) => handleDelete(event, data, type)}
                />
            )}
            {showAllTags && (
                <ShowAllTags
                    data={selectedPlatformTags}
                    open={showAllTags}
                    setOpen={setShowAllTags}
                    translte={translte}
                    handleUpdate={(event: any, data: any) => handleUpdate(event, data)}
                    handleDelete={(event: any, data: any, type: string) => handleDelete(event, data, type)}
                />
            )}
            {(showAddTag || showBulkTagging) && (
                <AddTag
                    data={allData}
                    type={showAddTag ? 'Add' : 'Bulk'}
                    open={showAddTag ? showAddTag : showBulkTagging}
                    setOpen={showAddTag ? setShowAddTag : setShowBulkTagging}
                    translte={translte}
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
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={s3Data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    navigate('?pageNo=' + page);
                }}
            />
        </div>
    );
};

export default React.memo(TableComponent);
