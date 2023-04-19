import React, { useState } from 'react';
import {
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CModal,
    CModalContent,
    CModalTitle,
} from '@coreui/react';
import './SchemaPopover.scss';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
import { useDispatch } from 'react-redux';

const UpdateSavedQueries = (props: any) => {
    const dispatch = useDispatch();
    const { updateQuery, open, setOpen, categoriesList, setQueryUpdated, updateQueryHistory } = props;
    const [name, setName] = useState<any>();
    const [category, setCategory] = useState<any>();
    const [shared, setShared] = useState<boolean>();
    const [query, setQuery] = useState<any>();

    const updateHistory = () => {
        updateQueryHistory(
            updateQuery?.id,
            name ? name : updateQuery?.name,
            category ? category : updateQuery?.category,
            shared !== updateQuery?.is_shared ? shared : updateQuery?.is_shared,
            query ? query : updateQuery?.query,
        );
        setOpen(false);
        setName('');
        setCategory('');
        setQuery('');
        setShared(undefined);
        setQueryUpdated(true);
    };

    return (
        <>
            <CModal visible={open} className="rounded-0">
                <CModalTitle>
                    <div className="font-large-bold float-start mx-2 my-2">Update Query</div>
                </CModalTitle>
                <CModalContent style={{ border: 'none' }}>
                    <div className="p-2 mb-2 header-background">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="p-2">Name: </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={updateQuery?.name}
                                            onChange={(e: any) => setName(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Category: </td>
                                    <td className="p-2">
                                        <CDropdown alignment={{ xs: 'start', lg: 'end' }}>
                                            <input
                                                type="text"
                                                defaultValue={updateQuery?.category}
                                                onChange={(e: any) => setCategory(e.target.value)}
                                                className="form-control"
                                                aria-label="Text input with dropdown button"
                                            />
                                            <CDropdownToggle className="ms-1" color="secondary" />
                                            <CDropdownMenu>
                                                {Object.keys(categoriesList)?.map((query: any, index: any) => (
                                                    <CDropdownItem key={index} onClick={() => setCategory(query)}>
                                                        {query}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Shared: </td>
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            defaultChecked={updateQuery?.is_shared}
                                            onChange={(e: any) => setShared(e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2" colSpan={2}>
                                        Query:
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2" colSpan={2}>
                                        <textarea
                                            spellCheck="false"
                                            className={`resize font-large form-control`}
                                            rows={12}
                                            onChange={(e) => setQuery(e.target.value)}
                                            defaultValue={updateQuery?.query}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex gap-2 flex-row-reverse">
                        <button
                            className="header-background border-0 w-auto mb-1 form-control font-medium-semibold float-start"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="header-background border-0 w-auto mb-1 form-control font-medium-semibold float-end"
                            disabled={
                                (name && name !== updateQuery?.name) ||
                                (category && category !== updateQuery?.category) ||
                                (query && query !== updateQuery?.query) ||
                                shared === !updateQuery?.is_shared
                                    ? false
                                    : true
                            }
                            onClick={() => {
                                updateHistory();
                                dispatch(setToastMessageAction(ToastVariant.SUCCESS, `${updateQuery?.name} Updated`));
                            }}
                        >
                            Update
                        </button>
                    </div>
                </CModalContent>
            </CModal>
        </>
    );
};

export default UpdateSavedQueries;
