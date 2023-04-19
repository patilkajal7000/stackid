import { getSingleGCPIdentityActivityLogs } from 'core/services/IdentitiesAPIService';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from 'shared/components/search_input/SearchInput';
import { GCPIdentityActivityLog } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import GCPActivityLogTableComponent from './GCPActivityLogTableComponent';

//const FilterItems: any = [{ id: 0, name: 'None' }];

type IdentitiesTableViewProps = {
    cloudAccountId: number;
    identityType: string;
    identityId: string;
};

const GCPSingleIdentityActivityLog = (props: IdentitiesTableViewProps) => {
    // const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [identityActivityLogs, setIdentityActivityLogs] = useState<GCPIdentityActivityLog[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<GCPIdentityActivityLog[]>([]);
    const [isAPILoading, setIsAPILoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        if (props.cloudAccountId && props.identityType && props.identityId) {
            setIsAPILoading(true);
            getSingleGCPIdentityActivityLogs(props.cloudAccountId, props.identityType, props.identityId)
                .then((response: any) => {
                    if (response) {
                        setIdentityActivityLogs(response);
                        setFilteredRecords(response);
                        setCurrentPage(currentPage);
                    }
                })
                .finally(() => setIsAPILoading(false));
        }
    }, [props.cloudAccountId, props.identityType, props.identityId]);

    const onSearchIdentites = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = identityActivityLogs?.filter(
                    (data: GCPIdentityActivityLog) =>
                        data.event_name.toLowerCase().includes(searchString.toLowerCase()) ||
                        data.activity.toLowerCase().includes(searchString.toLowerCase()),
                );
                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(identityActivityLogs);
            }
        },
        [identityActivityLogs],
    );

    return (
        <div className="container my-4">
            <div className="d-flex align-items-center mx-0 w-60 mt-4">
                <SearchInput onSearch={onSearchIdentites} placeholder="Search" />
            </div>

            <GCPActivityLogTableComponent
                data={filteredRecords}
                isLoading={isAPILoading}
                translate={t}
                selectedPage={currentPage}
            />
        </div>
    );
};

export default React.memo(GCPSingleIdentityActivityLog);
