import { deleteSavedQuery, updateSavedQuery } from 'core/services/DataEndpointsAPIService';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import SchemaInfoPopover from './SchemaInfoPopover';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCopy, cilInfo, cilPencil, cilTrash } from '@coreui/icons';
import { AppState } from 'store/store';
import UpdateSavedQueries from './UpdateSavedQueries';
import SearchInput from 'shared/components/search_input/SearchInput';
import { useQuery } from '@tanstack/react-query';
import { http_get } from 'core/services/BaseURLAxios';

const fetchSchemaTables = () => {
    return useQuery<any, any, any>({
        queryKey: ['schema_tables'],
        queryFn: async () => await http_get('/analyticscore/schemas'),
        staleTime: 3.6e6,
    });
};

const SchemaTables = (props: any) => {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [updateQuery, setUpdateQuery] = useState<any>();
    const [updateQueryPopover, setUpdateQueryPopover] = useState<boolean>(false);
    const [schema, setSchema] = useState<any>([]);
    const [schemaData, setSchemaData] = useState<any>([]);
    const [schemaInfo, setSchemaInfo] = useState<any>();
    const [searchSchema, setSearchSchema] = useState<any>();
    const [searchSaved, setSearchSaved] = useState<any>();
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const {
        setQueryBody,
        setQueryDeleted,
        setQueryUpdated,
        selectedTab,
        setSelectedTab,
        categoriesList,
        categoriesInfo,
        setCategoriesInfo,
    } = props;

    const { status: schemaTablesStatus, data: schemaTablesData, error: schemaTablesError } = fetchSchemaTables();

    useEffect(() => {
        if (schemaTablesData) {
            setSchema(new Object(Object.values(schemaTablesData)));
            setSchemaData(new Object(Object.values(schemaTablesData)));
        }
    }, [schemaTablesData]);

    // search for schema and saved queries
    useEffect(() => {
        if (searchSchema) {
            const searchData: any[] = [];
            schema.map((s: any) => {
                if (s?.name?.includes(searchSchema)) searchData.push(s);
            });
            searchData ? setSchemaData(searchData) : setSchemaData(schema);
        } else setSchemaData(schema);

        if (searchSaved) {
            const searchData: any[] = [];
            Object.values(categoriesInfo)?.map((category: any) => {
                // search category-wise
                if (category[0].category.includes(searchSaved)) searchData.push(category);
                // category?.map((query: any) => {
                //     if (query?.name.includes(searchSaved))
                //         searchData.push(category);
                // })
            });
            searchData ? setCategoriesInfo(searchData) : setCategoriesInfo(categoriesList);
        } else setCategoriesInfo(categoriesList);
    }, [searchSchema, searchSaved]);

    const deleteQueryHistory = (id: any, name: any) => {
        deleteSavedQuery(orgId, id)
            .then(() => {
                setQueryDeleted(true);
                dispatch(setToastMessageAction(ToastVariant.SUCCESS, `${name} Deleted`));
            })
            .catch(() => console.log('Delete Error'));
    };

    const updateQueryHistory = (id: any, name: any, category: any, shared: any, query: any) => {
        const body = {
            query: `${query}`,
            name: `${name}`,
            status: 'successful',
            is_shared: shared,
            category: `${category}`,
        };

        updateSavedQuery(orgId, id, body)
            .then(() => {
                console.log('updated');
            })
            .catch(() => console.log('Error'));
    };

    return (
        <>
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item pointer">
                        <span
                            className={`nav-link ${selectedTab === 'Schema' && 'active'}`}
                            aria-current="page"
                            role="presentation"
                            onClick={() => setSelectedTab('Schema')}
                        >
                            Schema
                        </span>
                    </li>
                    <li className="nav-item pointer">
                        <span
                            className={`nav-link ${selectedTab === 'Saved' && 'active'}`}
                            role="presentation"
                            onClick={() => setSelectedTab('Saved')}
                        >
                            Saved
                        </span>
                    </li>
                </ul>
                {selectedTab === 'Schema' ? (
                    <SearchInput
                        customClass={`mt-3 mb-3 w-auto fs-5`}
                        onSearch={(e) => setSearchSchema(e)}
                        placeholder="Search Tables"
                    />
                ) : (
                    <SearchInput
                        customClass={`mt-3 mb-3 w-auto fs-5`}
                        onSearch={(e) => setSearchSaved(e)}
                        placeholder="Search Category"
                    />
                )}
            </div>
            {schemaTablesStatus === 'loading' ? (
                <div className="d-flex justify-content-between container px-0">
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        <tbody>
                            <tr>
                                <td>
                                    <Skeleton count={10} height={48} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : schemaTablesStatus === 'error' ? (
                <span className="text-danger">Error: {schemaTablesError.message}</span>
            ) : (
                <>
                    {selectedTab === 'Schema' ? (
                        <CAccordion className="schema-table" flush>
                            {schemaData?.map((table: any, key: any) => (
                                <>
                                    <CAccordionItem itemKey={key + 1}>
                                        <CAccordionHeader className="border-0 p-0 m-0 ">
                                            <div role="presentation" className="container-fluid mb-2 py-1 ps-0">
                                                <div className="container d-flex p-0 justify-content-between">
                                                    <div className="float-start">
                                                        {table.name}
                                                        <span>
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content={table.name}
                                                            >
                                                                <CIcon
                                                                    icon={cilInfo}
                                                                    className="ms-2 text-neutral-600 pointer"
                                                                    onClick={() => {
                                                                        setModalOpen(true);
                                                                        setSchemaInfo(schemaData[key]);
                                                                    }}
                                                                />
                                                            </CTooltip>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CAccordionHeader>
                                        <CAccordionBody>
                                            <div className="container font-medium pb-3">
                                                {table?.columns?.map((col: any, index: any) => (
                                                    <div className="p-2 ps-0 d-flex accordian-items" key={index}>
                                                        <div className="float-start">{col.name}</div>
                                                        <div>
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content={col.name}
                                                            >
                                                                <CIcon
                                                                    icon={cilCopy}
                                                                    className="ms-2 text-neutral-400 pointer"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(col?.name);
                                                                        dispatch(
                                                                            setToastMessageAction(
                                                                                ToastVariant.SUCCESS,
                                                                                'column copied to clipboard.',
                                                                            ),
                                                                        );
                                                                    }}
                                                                />
                                                            </CTooltip>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </>
                            ))}
                        </CAccordion>
                    ) : (
                        <CAccordion className="history-list" flush>
                            {Object.keys(categoriesInfo).length > 0 ? (
                                Object.values(categoriesInfo)?.map((category: any, key: any) => (
                                    <>
                                        <CAccordionItem key={key}>
                                            <CAccordionHeader className="border-0 p-0 m-0 ">
                                                <div className="container-fluid mb-2 py-1 ps-0">
                                                    <div className="container d-flex p-0 justify-content-between">
                                                        <CTooltip
                                                            trigger="hover"
                                                            placement="bottom"
                                                            content={category[0]?.category}
                                                        >
                                                            <div className="float-start">{category[0]?.category}</div>
                                                        </CTooltip>
                                                    </div>
                                                </div>
                                            </CAccordionHeader>
                                            {category?.map((query: any, index: any) => (
                                                <CAccordionBody className="header-background p-0" key={index}>
                                                    <div className="container font-medium header-background">
                                                        <div
                                                            className="ps-0 accordian-items header-background"
                                                            key={key}
                                                        >
                                                            <div className="p-2">
                                                                <CTooltip
                                                                    trigger="hover"
                                                                    placement="bottom"
                                                                    content="Add Query"
                                                                >
                                                                    <div
                                                                        onClick={() =>
                                                                            setQueryBody({ query: query?.query })
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="pointer float-start"
                                                                    >
                                                                        {query?.name}
                                                                    </div>
                                                                </CTooltip>
                                                                <span>
                                                                    <CTooltip
                                                                        trigger="hover"
                                                                        placement="bottom"
                                                                        content="Edit Query"
                                                                    >
                                                                        <CIcon
                                                                            icon={cilPencil}
                                                                            className="ms-2 text-neutral-400 pointer"
                                                                            onClick={() => {
                                                                                setUpdateQueryPopover(true);
                                                                                setUpdateQuery(query);
                                                                            }}
                                                                        />
                                                                    </CTooltip>
                                                                    <CTooltip
                                                                        trigger="hover"
                                                                        placement="bottom"
                                                                        content="Delete Query"
                                                                    >
                                                                        <CIcon
                                                                            icon={cilTrash}
                                                                            className="ms-2 text-neutral-400 pointer"
                                                                            onClick={() =>
                                                                                deleteQueryHistory(
                                                                                    query?.id,
                                                                                    query?.name,
                                                                                )
                                                                            }
                                                                        />
                                                                    </CTooltip>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CAccordionBody>
                                            ))}
                                        </CAccordionItem>
                                    </>
                                ))
                            ) : (
                                <div>No Saved Queries</div>
                            )}
                        </CAccordion>
                    )}
                </>
            )}

            {modalOpen && <SchemaInfoPopover schemaContent={schemaInfo} open={modalOpen} setOpen={setModalOpen} />}
            {updateQuery && (
                <UpdateSavedQueries
                    categoriesList={categoriesList}
                    updateQuery={updateQuery}
                    updateQueryHistory={updateQueryHistory}
                    open={updateQueryPopover}
                    setOpen={setUpdateQueryPopover}
                    setQueryUpdated={setQueryUpdated}
                />
            )}
        </>
    );
};

export default SchemaTables;
