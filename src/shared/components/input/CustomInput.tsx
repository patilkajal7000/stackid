import React, { useState } from 'react';
import {
    CInputGroup,
    CFormInput,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CInputGroupText,
    CImage,
    CTooltip,
} from '@coreui/react';

type CustomInputProps = {
    value: string;
    onChange: (e: any) => void;
    onBlur: () => void;
    placeHolder: string;
    autoComplete: string;
    isPassword: boolean;
    hasError: boolean;
    errorMessage: string | undefined;
    showButton: boolean;
    isDropdown: boolean;
    dropdownValues: Array<string>;
};
const CustomInput = (props: CustomInputProps) => {
    const [isPasswodVisible, setIsPasswodVisible] = useState(false);

    const showPassword = () => {
        setIsPasswodVisible(!isPasswodVisible);
    };

    return (
        <CInputGroup className="mb-2 align-items-center">
            {!props.isDropdown ? (
                <CFormInput
                    className={`w-50 custom-input custom-input-auth font-medium-semibold ${
                        props.isPassword && props.showButton ? 'password' : ''
                    } ${props.hasError ? 'invalid-input' : ''} ${props.isDropdown ? 'dropdown' : ''}`}
                    type={props.isPassword && !isPasswodVisible ? 'password' : 'text'}
                    placeholder={props.placeHolder}
                    autoComplete={props.autoComplete}
                    value={props.value}
                    onChange={(e: any) => props.onChange(e.target.value)}
                    onBlur={props.onBlur}
                />
            ) : (
                <CDropdown
                    placement="bottom"
                    className={`form-control d-flex align-items-center justify-content-center custom-input custom-input-auth w-100 ${
                        props.hasError ? 'invalid-input' : ''
                    }`}
                >
                    <CDropdownToggle className="d-flex justify-content-between align-items-center w-100 dropdown-toggle shadow-none">
                        {props.value}
                    </CDropdownToggle>
                    <CDropdownMenu
                        // style={{ marginLeft: '-4px' }}
                        className="w-100 justify-content-between align-items-center "
                    >
                        {props.dropdownValues.map((val: any) => (
                            <CDropdownItem key={val} onClick={() => props.onChange(val)}>
                                {val}
                            </CDropdownItem>
                        ))}
                    </CDropdownMenu>
                </CDropdown>
            )}
            {props.isPassword && props.showButton && (
                <span className={`input-error-icon align-items-center`}>
                    <button
                        tabIndex={-1}
                        className="btn btn-link h6 pt-3"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onMouseDown={() => {
                            showPassword();
                        }}
                    >
                        <div className="btn-custom btn-link font-weight-normal " style={{ position: 'relative' }}>
                            {!isPasswodVisible ? 'Show' : 'Hide'}
                        </div>
                    </button>
                </span>
            )}
            {props.hasError && (
                <CInputGroupText className={`input-error-icon align-items-center clear-effect`}>
                    <CTooltip trigger="hover" placement="bottom" content={props.errorMessage}>
                        <div className="cursor-pointer mr-4" style={{ position: 'absolute' }}>
                            <CImage
                                src={require('assets/images/exclamation_circle.svg')}
                                style={{
                                    filter: 'invert(26%) sepia(45%) saturate(4911%) hue-rotate(357deg) brightness(77%) contrast(87%)',
                                }}
                            />
                        </div>
                    </CTooltip>
                </CInputGroupText>
            )}
        </CInputGroup>
    );
};

export default CustomInput;

CustomInput.defaultProps = {
    isPassword: false,
    hasError: false,
    showButton: true,
    onBlur: () => null,
    errorMessage: 'required.',
    isDropdown: false,
    dropdownValues: [''],
};
