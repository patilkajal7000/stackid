import { getResourcePermissionsById } from 'core/services/IdentitiesAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import SelectedFilterButton from 'shared/components/buttons/SelectedFilterButton';
import SearchInput from 'shared/components/search_input/SearchInput';
import { LevelOfAccess, LevelOfAccessView, ResourcePermissions } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import ResourcePermissionsTableComponent from './ResourcePermissionsTableComponent';

type SingleResourcePermissionsProps = {
    translate: any;
    resourceId: string;
    identityId: string;
    cloudAccountId: number;
};
const SingleResourcePermissions = (props: SingleResourcePermissionsProps) => {
    const [resourcePermissions, setSesourcePermissions] = useState<ResourcePermissions[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<ResourcePermissions[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<typeof LevelOfAccess | typeof LevelOfAccessView>(
        LevelOfAccess.All,
    );

    useEffect(() => {
        setIsLoading(true);
        getResourcePermissionsById(props.cloudAccountId, props.identityId, props.resourceId).then((response: any) => {
            if (response) {
                setSesourcePermissions(response);
                setIsLoading(false);
                setFilteredRecords(response);
            }
        });
    }, [props.resourceId]);

    const onSearchPermissions = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = resourcePermissions?.filter(
                    (data: ResourcePermissions) =>
                        data.permission_name.includes(searchString) || data.permission_type.includes(searchString),
                );
                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(resourcePermissions);
            }
        },
        [resourcePermissions],
    );

    const getCountOfRecords = (type: typeof LevelOfAccess | typeof LevelOfAccessView) => {
        return resourcePermissions.filter((r: ResourcePermissions) => r.permission_type === type);
    };

    return (
        <>
            <div className="container p-0 my-2">
                <div className="d-flex flex-row align-content-around">
                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccess.All}
                        showCount
                        count={resourcePermissions.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccess.All);
                            setFilteredRecords(resourcePermissions);
                        }}
                        value={props.translate('all')}
                    />
                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.ALL}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.ALL)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.ALL);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.ALL));
                        }}
                        value={props.translate('admin')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.PermissionsManagement}
                        showCount
                        count={getCountOfRecords(LevelOfAccess.PermissionsManagement)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccess.PermissionsManagement);
                            setFilteredRecords(getCountOfRecords(LevelOfAccess.PermissionsManagement));
                        }}
                        value={props.translate('permission_management')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.Write}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.Write)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.Write);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.Write));
                        }}
                        value={props.translate('write')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.Read}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.Read)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.Read);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.Read));
                        }}
                        value={props.translate('read')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.List}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.List)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.List);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.List));
                        }}
                        value={props.translate('list')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.Tagging}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.Tagging)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.Tagging);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.Tagging));
                        }}
                        value={props.translate('tags')}
                    />
                </div>
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchPermissions} placeholder="Search" />
                </div>

                <ResourcePermissionsTableComponent
                    data={filteredRecords}
                    isLoading={isLoading}
                    translate={props.translate}
                    identityId={props.identityId}
                />
            </div>
        </>
    );
};

export default React.memo(SingleResourcePermissions);
