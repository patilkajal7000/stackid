import React, { useEffect, useState } from 'react';
import { CInputGroup, CFormInput, CButton, CTooltip, CImage } from '@coreui/react';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilX } from '@coreui/icons';

const MINIMU_LENGTH = 'Min length should be ';

type SearchInputProps = {
    onSearch: (searchString: string, callback?: (message: string) => void) => void;
    placeholder: string;
    minLength: number;
    customClass?: string;
    initialValue?: string;
};

const SearchInput = (props: SearchInputProps) => {
    const [searchValue, setSearchValue] = useState(props.initialValue || '');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(MINIMU_LENGTH + props.minLength + '.');

    useEffect(() => {
        if (props.initialValue) {
            setSearchValue(props.initialValue);
        }
    }, [props.initialValue]);

    const onChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsError(false);
        const value = event.target.value.trim();
        setSearchValue(value);
        if (value.length >= props.minLength) {
            props.onSearch(value, updateErrorMessage);
        } else {
            props.onSearch('', () => setIsError(false));
            if (value.length > 0) {
                setIsError(true);
                setErrorMessage(MINIMU_LENGTH + props.minLength + '.');
            } else {
                setIsError(false);
            }
        }
    };

    // const renderTooltip = (propsSingle: any) => (
    //     <CTooltip id="button-tooltip" className="custom-tooltip error-text" {...propsSingle}>
    //         {errorMessage}
    //     </CTooltip>
    // );

    const updateErrorMessage = (message: string) => {
        if (message.length > 0) {
            setIsError(true);
            setErrorMessage(message);
        }
    };

    const onClickSearchAndCleanIcon = () => {
        props.onSearch('', () => setIsError(false));
        setSearchValue('');
        setIsError(false);
    };

    return (
        <CInputGroup className={`d-flex ${props.customClass} me-1 align-items-center`}>
            <CFormInput
                className={`w-50 shadow-5 border-neutral-700 font-medium-semibold custom-input custom-input-auth input-search rounded overflow-hidden ${
                    isError ? 'invalid-input' : ''
                }`}
                type="text"
                placeholder={props.placeholder}
                value={searchValue}
                onChange={onChangeSearchValue}
                style={{ borderColor: isError ? 'red' : '' }}
            />
            <div className="search-right-sec d-flex">
                <CButton
                    variant="outline"
                    color="light"
                    className="btn btn-custom btn-search pt-2"
                    onClick={onClickSearchAndCleanIcon}
                >
                    {searchValue.length > 0 ? <CIcon icon={cilX} size="lg" /> : <CIcon icon={cilSearch} size="lg" />}
                </CButton>
                {/* <button className="btn btn-link h6 pt-3" onClick={onClickSearchAndCleanIcon}>
                <div className="btn-custom btn-link">{searchValue.length > 0 ? <CloseIcon /> : <SearchIcon />}</div>
            </button> */}

                {searchValue.length > 0 && isError && (
                    <React.Fragment>
                        <CTooltip trigger="hover" placement="bottom" content={errorMessage}>
                            <div className="cursor-pointer me-2 mt-2">
                                <CImage
                                    src={require('assets/images/exclamation_circle.svg')}
                                    style={{
                                        filter: 'invert(26%) sepia(45%) saturate(4911%) hue-rotate(357deg) brightness(77%) contrast(87%)',
                                    }}
                                />
                            </div>
                        </CTooltip>
                    </React.Fragment>
                )}
            </div>
        </CInputGroup>
    );
};

export default SearchInput;

SearchInput.defaultProps = {
    minLength: MIN_SEARCH_LENGTH,
    customClass: 'w-60',
};
