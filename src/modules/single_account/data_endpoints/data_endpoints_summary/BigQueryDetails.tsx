import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import React, { useCallback, useEffect, useState } from 'react';
import DataEndpointInsight from './components/DataEndpointInsight';
import FixTodayCards from './components/FixTodayCard';
import TableComponent from './components/TableComponent';
import SearchInput from '../../../../shared/components/search_input/SearchInput';
import { DataEndpointResorceModel } from 'shared/models/DataEndpointSummaryModel';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE, DATA_ASSETS } from 'shared/utils/Constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getDataEndpointsSummary } from 'core/services/DataEndpointsAPIService';

const FilterItems: any = [{ id: 0, name: 'None' }];

type BigQueryDetailsProps = {
    cloudAccountId: number;
    resource_type: string;
};

const BigQueryDetails = (props: BigQueryDetailsProps) => {
    const [bigQueryData, setBigQueryData] = useState<DataEndpointResorceModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fixTodayCards, setFixTodayCards] = useState<DataEndpointResorceModel[]>([]);
    const [displayData, setDisplayData] = useState<DataEndpointResorceModel[]>([]);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [, setPdfRecord] = useState<DataEndpointResorceModel[]>([]);
    const [, setCsvRecord] = useState<DataEndpointResorceModel[]>([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPlatformTags, setShowPlatformTags] = useState<boolean>(false);

    const openPlatformTags = (e: any) => {
        e.stopPropagation();
        setShowPlatformTags(true);
    };

    // useEffect(() => {
    //     getBigQueryDatasets(props.cloudAccountId)
    //         .then((res: any) => {
    //             // console.log('response::::', res);
    //             const data = res.sort((a: any, b: any) => {
    //                 if (!a.risk_score) a.risk_score = 0;
    //                 if (!b.risk_score) b.risk_score = 0;
    //                 const risk_score1 = a.risk_score,
    //                     risk_score2 = b.risk_score;
    //                 return risk_score1 > risk_score2 ? -1 : 1;
    //             });

    //             // setBigQueryData(data);
    //             // setDisplayData(data);
    //             // const fixTodayBuckets = data.slice(0, 3);
    //             // setFixTodayCards(fixTodayBuckets);
    //             // setIsLoading(false);
    //         })
    //         .catch(() => setIsLoading(false));
    // }, [props.resource_type]);
    useEffect(() => {
        getDataEndpointsSummary(props.cloudAccountId, props.resource_type)
            .then((res: any) => {
                const data = res.resources.sort((a: any, b: any) => {
                    if (!a.risk_score) a.risk_score = 0;
                    if (!b.risk_score) b.risk_score = 0;
                    const risk_score1 = a.risk_score,
                        risk_score2 = b.risk_score;
                    return risk_score1 > risk_score2 ? -1 : 1;
                });

                setBigQueryData(data);
                setDisplayData(data);
                const fixTodayBuckets = data.slice(0, 3);
                setFixTodayCards(fixTodayBuckets);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [props.resource_type]);

    const dataTableDetails = (item: DataEndpointResorceModel) => {
        gotoSingleTable(item);
    };

    const gotoSingleTable = (item: DataEndpointResorceModel) => {
        navigate(item.id + '/' + NAV_TABS_VALUE.TABLES);
    };

    const onSearch = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedItems = bigQueryData?.filter((data: DataEndpointResorceModel) =>
                    data.name.toLowerCase().includes(searchString.toLowerCase()),
                );
                if (selectedItems && selectedItems.length > 0) {
                    setDisplayData(selectedItems);
                    callback && callback('');
                } else {
                    setDisplayData([]);
                    callback && callback('No Items found.');
                }
            } else {
                setDisplayData(bigQueryData);
            }
        },
        [bigQueryData],
    );

    return (
        <>
            <DataEndpointInsight
                data={bigQueryData}
                dataAssestsTypeDisplayText="datasets"
                isLoading={isLoading}
                translate={t}
                iconName="gcp-icon"
            />

            <div className="h4 mt-4 container px-0">{t('lets_fix_today')}</div>
            <FixTodayCards
                translate={t}
                bucketData={fixTodayCards}
                onClickView={gotoSingleTable}
                isLoading={isLoading}
            />

            <div className="container-fluid mx-0 header-background">
                <div className="my-4 container py-2 font-small-semibold px-0 text-uppercase">
                    {t(DATA_ASSETS.BIG_QUERY)}
                </div>
            </div>
            <div className="container-fluid mx-0">
                <div className="container px-0 mb-2">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center px-2 me-1 border-neutral-700">
                            <div className="font-x-small-bold">{t('filter')}</div>
                            <div>
                                <CDropdown placement="bottom" className="mx-1 p-1 w-100">
                                    <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1">
                                        <div className="h6 pe-5  m-0">{FilterItems[selectedFilerValue].name}</div>
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
                        </div>
                        <SearchInput onSearch={onSearch} placeholder="Search Dataset" />
                    </div>
                </div>
            </div>
            <TableComponent
                handleOnPDF={(records: DataEndpointResorceModel[]) => setPdfRecord(records)}
                handleOnCSV={(records: DataEndpointResorceModel[]) => setCsvRecord(records)}
                onClickRow={dataTableDetails}
                data={displayData}
                isLoading={isLoading}
                translate={t}
                resourceType={props.resource_type}
                showBulkTagging={showPlatformTags}
                setShowBulkTagging={setShowPlatformTags}
                openPlatformTags={openPlatformTags}
            />
        </>
    );
};

export default React.memo(BigQueryDetails);
