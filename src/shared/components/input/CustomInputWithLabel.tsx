import {
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CTooltip,
    CImage,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import 'translation/i18n';
import { useTranslation } from 'react-i18next';

type CustomInputWithLabelProps = {
    value: string;
    onChange: (e: any) => void;
    onBlur: () => void;
    placeHolder: string;
    autoComplete: string;
    isPassword: boolean;
    hasError: boolean;
    errorMessage: string;
    showButton: boolean;
    label: string;
    ref?: any;
    isDropdown: boolean;
    customClass?: string;
    customLabelClass?: string;
    customDropdownClass?: string;
    dropdownValues: Array<string>;
    isMultiple: boolean;
    dropdownValuesDisplay: number;
};

const CustomInputWithLabel = (props: CustomInputWithLabelProps) => {
    const [dropdownValues, setDropdownValues] = useState<Array<string>>([]);
    const [isPasswodVisible, setIsPasswodVisible] = useState(false);
    const showPassword = () => {
        setIsPasswodVisible(!isPasswodVisible);
    };
    const { t } = useTranslation();

    useEffect(() => {
        if (props.isDropdown && props.value) {
            setDropdownValues(props.value.split(','));
        }
    }, [props.value]);

    // const renderTooltip = (propsSingle: any) => (
    //     <CTooltip
    //         id="button-tooltip"
    //         className="custom-tooltip error-text"
    //         style={{ backgroundColor: 'white' }}
    //         {...propsSingle}
    //     >
    //         {props.errorMessage}
    //     </CTooltip>
    // );

    const setDropdownValue = (val: any) => {
        if (!dropdownValues.includes(val)) {
            const items = [...dropdownValues, val];
            setDropdownValues(items);
            props.onChange(items.toString());
        } else {
            const index = dropdownValues.findIndex((dropdownValue: any) => dropdownValue === val);
            if (index > -1) {
                const updatedDropdownValues = dropdownValues;
                updatedDropdownValues.splice(index, 1);
                setDropdownValues(updatedDropdownValues);
                props.onChange(updatedDropdownValues.toString());
            }
        }
    };

    // const removeItem = (val: any) => {
    //     const items = dropdownValues.filter((item: any) => {
    //         return item !== val;
    //     });
    //     setDropdownValues([...items]);
    //     props.onChange(items.toString());
    // };

    const selectionText = () => {
        let str = '';
        if (dropdownValues.length > props.dropdownValuesDisplay) {
            for (let index = 0; index < props.dropdownValuesDisplay; index++) {
                str += dropdownValues[index] + ', ';
            }
            str += ' + ' + (dropdownValues.length - props.dropdownValuesDisplay);
        } else {
            str = props.value.replaceAll(',', ', ');
        }
        return str;
    };
    return (
        <CInputGroup className={`mb-3 ${props.customClass}`}>
            <CInputGroupText
                className={`form-control custom-input-box-label ${props.customLabelClass} align-items-center ${
                    props.hasError ? 'invalid-input-label' : ''
                }  ${props.isDropdown ? 'dropdown' : ''}`}
                onBlur={props.onBlur}
            >
                {props.label}
            </CInputGroupText>

            {props.isDropdown ? (
                <CDropdown
                    placement="bottom"
                    className={`custom-input custom-input-box w-65  ${props.customDropdownClass} ${
                        props.hasError ? 'invalid-input' : ''
                    } `}
                >
                    <CDropdownToggle className="d-flex justify-content-between align-items-center w-100 float-end">
                        <div style={{ minHeight: '20px' }}>
                            {props.isMultiple
                                ? props.value
                                    ? selectionText()
                                    : props.placeHolder
                                : props.value
                                ? t(props.value)
                                : props.dropdownValues[0]}
                        </div>
                    </CDropdownToggle>
                    <CDropdownMenu className="w-100">
                        {props.isMultiple
                            ? props.dropdownValues.map((val: any, index: number) => (
                                  <CDropdownItem
                                      key={index + val}
                                      className="border-bottom"
                                      onClick={(event: any) => {
                                          setDropdownValue(val);
                                          event.preventDefault();
                                      }}
                                  >
                                      <div key={index} className="d-flex ps-3" style={{ pointerEvents: 'none' }}>
                                          <input
                                              type="checkbox"
                                              className="form-check-input"
                                              value={val}
                                              checked={dropdownValues.includes(val)}
                                              onChange={() => null}
                                          />
                                          <div className="ps-3">{val}</div>
                                      </div>
                                  </CDropdownItem>
                              ))
                            : props.dropdownValues.map((val: any) => (
                                  <CDropdownItem key={val} onClick={() => props.onChange(val)}>
                                      {t(val)}
                                  </CDropdownItem>
                              ))}
                    </CDropdownMenu>
                </CDropdown>
            ) : (
                <CFormInput
                    type={props.isPassword && !isPasswodVisible ? 'password' : 'text'}
                    className={`w-50 custom-input custom-input-box ${props.hasError ? 'invalid-input' : ''}  ${
                        props.isPassword && props.showButton ? 'password' : ''
                    }`}
                    placeholder={props.placeHolder}
                    autoComplete={props.autoComplete}
                    value={props.value}
                    onChange={(e: any) => props.onChange(e.target.value)}
                    onBlur={props.onBlur}
                />
            )}
            <CInputGroupText className="input-label-error align-items-center clear-effect">
                {props.isPassword && props.showButton && (
                    <span className="cursor-pointer clear-effect me-2 mt-1" onClick={showPassword} role="presentation">
                        {!isPasswodVisible ? 'Show' : 'Hide'}
                    </span>
                )}
                {props.hasError && (
                    <React.Fragment>
                        <CTooltip trigger="hover" placement="bottom" content={props.errorMessage}>
                            <div className="cursor-pointer mt-1 me-2">
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
            </CInputGroupText>
        </CInputGroup>
    );
};

export default CustomInputWithLabel;

CustomInputWithLabel.defaultProps = {
    isPassword: false,
    hasError: false,
    showButton: true,
    onBlur: () => null,
    errorMessage: 'required.',
    isDropdown: false,
    dropdownValues: [''],
    isMultiple: false,
    dropdownValuesDisplay: 2,
};
