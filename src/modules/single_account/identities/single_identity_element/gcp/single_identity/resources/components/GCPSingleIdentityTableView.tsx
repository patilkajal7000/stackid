import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from 'shared/components/search_input/SearchInput';
import { GCPIdentityResourceDetails } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import IdentityTableComponent from './IdentityTableComponent';

//const FilterItems: any = [{ id: 0, name: 'None' }];

type IdentitiesTableViewProps = {
    data: GCPIdentityResourceDetails[];
    onClickRow: (resourceData: GCPIdentityResourceDetails, currentPage: number, e: any) => void;
    translate: any;
    isLoading: boolean;
    currentPage: number;
};

const GCPSingleIdentityTableView = (props: IdentitiesTableViewProps) => {
    // const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [filteredRecords, setFilteredRecords] = useState<GCPIdentityResourceDetails[]>([]);
    const [currentPage] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        setFilteredRecords(props.data);
    }, [props.data]);

    const onSearchIdentites = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedIdentities = props.data?.filter(
                    (data: GCPIdentityResourceDetails) =>
                        data.resource_name.toLowerCase().includes(searchString.toLowerCase()) ||
                        data.resource_type.toLowerCase().includes(searchString.toLowerCase()),
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
        <div className="container my-4">
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

            <IdentityTableComponent
                onClickRow={props.onClickRow}
                data={filteredRecords}
                isLoading={props.isLoading}
                translate={t}
                selectedPage={currentPage}
                showFullTable={false}
            />
        </div>
    );
};

export default React.memo(GCPSingleIdentityTableView);
