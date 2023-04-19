import { CFormInput, CImage, CInputGroup, CInputGroupText, CTooltip } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import 'translation/i18n';

type UploadCredentialsFileProps = {
    setValues: (file: any) => void;
    selectedOption: string;
};

const UploadCredentialsFile = (props: UploadCredentialsFileProps) => {
    const [file, setFile] = useState<any>();
    const [fileError, setFileError] = useState(true);
    const [errorMessage, setErrorMessage] = useState('File is required');

    useEffect(() => {
        setFile(undefined);
    }, [props.selectedOption]);

    useEffect(() => {
        if (checkIsFileValid()) {
            props.setValues(file);
        } else {
            props.setValues(null);
        }
    }, [file, setFile]);

    const checkIsFileValid = () => {
        if (!file?.name) {
            setErrorMessage('File is required.');
            setFileError(true);
            return false;
        }
        if (!('type' in file) || file.type !== 'application/json') {
            setErrorMessage('File should be a valid JSON.');
            setFileError(true);
            return false;
        }
        if (!('size' in file) || file.size > 10000) {
            setErrorMessage('File sise should be a less than 1 MB.');
            setFileError(true);
            return false;
        }
        setErrorMessage('');
        setFileError(false);
        return true;
    };

    // const renderTooltip = (propsSingle: any) => (
    //     <CTooltip
    //         id="button-tooltip"
    //         className="custom-tooltip error-text"
    //         style={{ backgroundColor: 'white' }}
    //         {...propsSingle}
    //     >
    //         {errorMessage}
    //     </CTooltip>
    // );

    return (
        <>
            <div className="col-md-8 mx-5">
                <CInputGroup className="mb-3">
                    <CInputGroupText
                        className={`form-control custom-input-box-label align-items-center h-auto ${
                            fileError ? 'invalid-input-label' : ''
                        }  `}
                    >
                        File Upload
                    </CInputGroupText>
                    <CFormInput
                        type="file"
                        id="inputGroupFile01"
                        className={`w-50 custom-input custom-input-box h-auto ${fileError ? 'invalid-input' : ''} `}
                        onChange={(e: any) => {
                            setFile(e?.target?.files?.[0]);
                        }}
                        accept=".json"
                    />
                    <CInputGroupText className="input-label-error clear-effect align-items-center h-auto mt-1">
                        {fileError && (
                            <React.Fragment>
                                <CTooltip trigger="hover" placement="bottom" content={errorMessage}>
                                    <div className="cursor-pointer me-2">
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
            </div>
        </>
    );
};

export default React.memo(UploadCredentialsFile);
