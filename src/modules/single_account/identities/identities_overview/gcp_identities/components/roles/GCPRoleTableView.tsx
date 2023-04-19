import React, { useCallback, useEffect, useState } from 'react';
import SearchInput from 'shared/components/search_input/SearchInput';
import { GCPRoleDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import GCPRoleTableComponent from './GCPRoleTableComponent';

type IdentitiesTableViewProps = {
    headerTitle: string;
    data: GCPRoleDetails[];
    onClickRow: (id: string) => void;
    translte: any;
    isLoading: boolean;
    identityType: IdentityType;
    currentPage: number;
};
const GCPRoleTableView = (props: IdentitiesTableViewProps) => {
    const [filteredRecords, setFilteredRecords] = useState<GCPRoleDetails[]>([]);

    useEffect(() => {
        setFilteredRecords([]);
        setFilteredRecords(props.data);
    }, [props.data]);

    const onSearchIdentites = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = props.data?.filter((data: GCPRoleDetails) =>
                    data.role_name.toLowerCase().includes(searchString.toLowerCase()),
                );
                if (selectedIdentities && selectedIdentities.length > 0) {
                    setFilteredRecords(selectedIdentities);
                    callback && callback('');
                } else {
                    setFilteredRecords([]);
                    callback && callback('No Items found');
                }
            } else {
                setFilteredRecords(props.data);
            }
        },
        [props.data],
    );

    return (
        <>
            <div className="container my-5">
                <div className="d-flex align-items-center mx-0 w-60 mt-4">
                    <SearchInput onSearch={onSearchIdentites} placeholder="Search" />
                    {/* <div className="d-flex align-items-center px-2 shadow-6 border-neutral-700">
                        <div className="font-x-small-bold">Filter</div>
                        <div>
                            <CDropdown placement="bottom" className="mx-1 p-1 w-100">
                                <CDropdownToggle className="btn-secondary font-x-small-bold">
                                    {FilterItems[selectedFilerValue].name}
                                </CDropdownToggle>
                                
                                <CDropdownMenu>
                                    {FilterItems.map((item: any, index: number) => (
                                        <CDropdownItem key={index} onClick={() => setSelectedFilerValue(item.id)}>
                                            {item.name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </div> */}
                </div>

                <GCPRoleTableComponent
                    currentPageNo={props.currentPage}
                    onClickRow={(identityId: string) => props.onClickRow(identityId)}
                    data={filteredRecords}
                    translate={props.translte}
                    isLoading={props.isLoading}
                />
            </div>
        </>
    );
};

export default React.memo(GCPRoleTableView);
