import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from 'shared/components/search_input/SearchInput';
import { IdentityActivityLog } from 'shared/models/IdentityAccessModel';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import ActivityLogTableComponent from './ActivityLogTableComponent';
import { getIdentityAWSActivityLogs } from 'core/services/DataEndpointsAPIService';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import './ActivityLog.scss';
import { useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCalendar } from '@coreui/icons';

const FilterItems: any = [
    { id: 0, name: 'Event Name' },
    { id: 1, name: 'Event Source' },
    { id: 2, name: 'Event Time' },
    { id: 3, name: 'Org Id' },
    { id: 4, name: 'User Id' },
    { id: 5, name: 'Config Change Event' },
];

const SingleIdentityActivityLog = () => {
    const [identityActivityLogs, setIdentityActivityLogs] = useState<IdentityActivityLog[]>([]);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [filteredRecords, setFilteredRecords] = useState<IdentityActivityLog[]>([]);
    const [totalLogs, setTotalLogs] = useState<any>();
    const [totalSearchedLogs, setTotalSearchedLogs] = useState<any>();
    const [isAPILoading, setIsAPILoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const [dates, onDateChange] = useState<any>([date, new Date()]);
    const { t } = useTranslation();
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const params = useParams<any>();
    const limit = 15;
    const [dataBody, setDataBody] = useState<any>();
    const startTime: any = dates[0];
    const endTime: any = dates[1];

    const [countBody, setCountBody] = useState<any>({
        principalId: params.rid,
        accountId: params.cloudAccountId,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
    });

    useEffect(() => {
        const startTime = dates[0];
        const endTime = dates[1];

        setDataBody({
            principalId: params.rid,
            accountId: params.cloudAccountId,
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
            limit: 15,
            offset: (currentPage - 1) * limit,
        });
        setCountBody({
            principalId: params.rid,
            accountId: params.cloudAccountId,
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
        });
    }, [dates, currentPage]);

    useEffect(() => {
        if (dataBody) {
            setIsAPILoading(true);
            // to get the logs data
            getIdentityAWSActivityLogs(orgId, 'iam_activity_logs', dataBody)
                .then((response: any) => {
                    const responseData: any = [];
                    if (response) {
                        response.map((res: any) => {
                            responseData.push({
                                IsConfigChangeEvent: res?.si_is_config_change_event,
                                account_id: res?.account_id,
                                event_name: res?.event_name,
                                event_source: res?.event_source,
                                event_time: res?.start_time,
                                org_id: res?.org_id,
                                user_identity_principal_id: res?.user_identity_principal_id,
                            });
                        });
                        setIdentityActivityLogs(responseData);
                        setFilteredRecords(responseData);
                        getIdentityAWSActivityLogs(orgId, 'iam_activity_logs_count', countBody)
                            .then((response: any) => {
                                if (response) {
                                    setTotalLogs(response[0]?.count);
                                }
                            })
                            .finally(() => setIsAPILoading(false));
                    }
                })
                .finally(() => setIsAPILoading(false));
        }
    }, [dataBody]);

    const onSearchIdentites = (searchString: string) => {
        if (searchString.length >= MIN_SEARCH_LENGTH) {
            const selectedItems = identityActivityLogs?.filter((data: IdentityActivityLog) => {
                switch (selectedFilerValue) {
                    case 0:
                        return data.event_name.toLowerCase().includes(searchString.toLowerCase());
                    case 1:
                        return data.event_source.toLowerCase().includes(searchString.toLowerCase());
                    case 2:
                        return data.start_time.toLowerCase().includes(searchString.toLowerCase());
                    case 3:
                        return data.org_id.toLowerCase().includes(searchString.toLowerCase());
                    case 4:
                        return data.user_identity_principal_id.toLowerCase().includes(searchString.toLowerCase());
                    case 5:
                        return data.IsConfigChangeEvent.toString().toLowerCase().includes(searchString.toLowerCase());
                    default:
                        return data;
                }
            });
            setTotalSearchedLogs(selectedItems);

            if (selectedItems && selectedItems.length > 0) {
                setFilteredRecords(selectedItems);
                // callback && callback('');
            } else {
                setFilteredRecords([]);
                // callback && callback('No Items found.');
            }
        } else {
            setFilteredRecords(identityActivityLogs);
        }
    };

    return (
        <div className="my-4">
            <div className="container p-0">
                <div
                    className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded"
                    style={{ height: '46px', float: 'left', marginBottom: '0.5rem' }}
                >
                    <div className="font-x-small-bold">{t('filter')}</div>
                    <div className="w-100">
                        <CDropdown placement="bottom" className="p-2 w-100">
                            <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                <div className="pe-2 m-0">{FilterItems[selectedFilerValue].name}</div>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {FilterItems.map((item: any, index: number) => (
                                    <CDropdownItem
                                        key={index}
                                        onClick={() => setSelectedFilerValue(item.id)}
                                        data-si-qa-key={`identities-activitylog-filter-${item.id}`}
                                    >
                                        {item.name}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>
                <SearchInput
                    data-si-qa-key={`identities-activitylog-search-bar`}
                    customClass="float-start w-50"
                    onSearch={onSearchIdentites}
                    placeholder="Search"
                />
                <DateRangePicker
                    data-si-qa-key={`identities-activitylog-datepicker`}
                    className={`h-46 fw-light fs-5 shadow-5 border-neutral-700`}
                    onChange={onDateChange}
                    value={dates}
                    maxDate={new Date()}
                    format="MMM dd, yy"
                    calendarIcon={<CIcon icon={cilCalendar} size="xxl" className="mx-2 cursor-pointer text-primary" />}
                    clearIcon={null}
                />
            </div>

            <ActivityLogTableComponent
                data={filteredRecords}
                isLoading={isAPILoading}
                translate={t}
                selectedPage={currentPage}
                setSelectedPage={setCurrentPage}
                totalLogs={totalLogs}
                totalSearchedLogs={totalSearchedLogs}
            />
        </div>
    );
};

export default React.memo(SingleIdentityActivityLog);
