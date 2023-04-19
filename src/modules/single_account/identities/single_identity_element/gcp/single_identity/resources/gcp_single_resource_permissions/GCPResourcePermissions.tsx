import { getGCPResourcePermissions } from 'core/services/IdentitiesAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import SelectedFilterButton from 'shared/components/buttons/SelectedFilterButton';
import SearchInput from 'shared/components/search_input/SearchInput';
import { LevelOfAccess, LevelOfAccessView, ResourcePermissionDetails } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import GCPResourcePermissionsTable from './GCPResourcePermissionsTable';

//const FilterItems: any = [{ id: 0, name: 'None' }];

type SingleResourcePermissionsProps = {
    translate: any;
    resourceId: string;
    identityId: string;
    identityType: string;
    cloudAccountId: number;
};
const GCPResourcePermissions = (props: SingleResourcePermissionsProps) => {
    // const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [resourcePermissions, setResourcePermissions] = useState<ResourcePermissionDetails[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<ResourcePermissionDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<typeof LevelOfAccess | typeof LevelOfAccessView>(
        LevelOfAccess.All,
    );

    useEffect(() => {
        setIsLoading(true);
        getGCPResourcePermissions(props.cloudAccountId, props.identityType, props.identityId, props.resourceId)
            .then((response: any) => {
                if (response) {
                    setResourcePermissions(response.permissions);
                    setFilteredRecords(response.permissions);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [props.resourceId]);

    const onSearchPermissions = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = resourcePermissions?.filter(
                    (data: ResourcePermissionDetails) =>
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

    const getCountOfRecords = (type: string | typeof LevelOfAccessView) => {
        return resourcePermissions.filter((r: ResourcePermissionDetails) => r.permission_type === type);
    };

    return (
        <>
            <div className="container my-2">
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
                        value={props.translate('owner')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.Write}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.Write)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.Write);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.Write));
                        }}
                        value={props.translate('editor')}
                    />

                    <SelectedFilterButton
                        isSelected={selectedFilter === LevelOfAccessView.Read}
                        showCount
                        count={getCountOfRecords(LevelOfAccessView.Read)?.length}
                        onClick={() => {
                            setSelectedFilter(LevelOfAccessView.Read);
                            setFilteredRecords(getCountOfRecords(LevelOfAccessView.Read));
                        }}
                        value={props.translate('viewer')}
                    />
                </div>
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchPermissions} placeholder="Search" />
                </div>

                <GCPResourcePermissionsTable data={filteredRecords} isLoading={isLoading} translate={props.translate} />
            </div>
        </>
    );
};

export default React.memo(GCPResourcePermissions);
