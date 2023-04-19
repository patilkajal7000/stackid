import React, { useEffect, useRef, useState } from 'react';

import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormInput,
    CImage,
    CInputGroup,
    CInputGroupText,
    CNavbar,
    CNavbarNav,
    CNavLink,
    CPopover,
} from '@coreui/react';
import useInput from 'shared/hooks/use-input';
import { emptyStringValidation } from 'shared/service/ValidationService';
import { useDispatch } from 'react-redux';
import { ToastVariant } from 'shared/utils/Constants';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { CChart } from '@coreui/react-chartjs';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import CIcon from '@coreui/icons-react';
import {
    cilArrowTop,
    cilChevronRight,
    cibDiscover,
    cilFolder,
    cilHamburgerMenu,
    cilSearch,
    cilSpeedometer,
    cilStorage,
    cilX,
    cilXCircle,
} from '@coreui/icons';

const StyleGuide = () => {
    const [isMenuCollapse, setIsMenuCollapse] = useState(false);
    const {
        value: input1,
        hasError: input1HasError,
        valueChangeHandler: input1Chagehandler,
        inputBlurHandler: input1BlurHandler,
    } = useInput(emptyStringValidation);
    const {
        value: input2,
        valueChangeHandler: input2Chagehandler,
        inputBlurHandler: input2BlurHandler,
    } = useInput(() => null);
    const {
        value: input3,
        valueChangeHandler: input3Chagehandler,
        inputBlurHandler: input3BlurHandler,
    } = useInput(() => null);
    const {
        value: input4,
        hasError: input4HasError,
        valueChangeHandler: input4Chagehandler,
        inputBlurHandler: input4BlurHandler,
    } = useInput(emptyStringValidation);
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        input2Chagehandler('Has Some Value');
        input1BlurHandler();
        input4BlurHandler();
    }, []);

    const toggleMenu = () => {
        setIsMenuCollapse(!isMenuCollapse);
    };
    const [show, setShow] = useState(false);
    const ref = useRef(null);

    const handleClick = () => {
        setShow(!show);
    };
    const dispatch = useDispatch();

    return (
        <>
            <div className="container-fluid main-container-m-t height-middle-panel custom-scroll ps" ref={ref}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                Global Theme colors
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-primary theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Primary</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-secondary theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Secondary</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-success theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Success</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-info theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Info</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-warning theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Warning</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="bg-danger theme-color w-75 rounded mb-2"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>Danger</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">Fonts</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-2 col-12 mb-4">
                                        <div className="font-base-family-poppins"> This text is with Poppins font </div>
                                    </div>
                                    <div className="col-xl-2 col-12 mb-4">
                                        <div className="font-base-family-open-sans">
                                            {' '}
                                            This text is with Open Sans font
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                Typography
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h1"> H1 Headline </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h2"> H2 Headline </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h3"> H3 Headline </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h4"> H4 Headline </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h5"> H5 Headline </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="h6"> H6 Headline </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-large"> Body L (Regular) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-medium-semibold"> Body M (Regular- poppins) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-medium"> Body M (Regular) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-small-semibold"> Body S (Semibold) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-small-semibold-open"> Body S (Semibold) Open Sans </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-small"> Body S (Regular) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-x-small-bold"> Body XS (Bold) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-x-small-medium"> Body XS (Medium) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-caption-bold"> Caption (Bold) </div>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="font-caption"> Caption (Regular) </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">Buttons </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Giant</p>
                                        <button type="button" className="btn btn-custom btn-primary btn-giant">
                                            Primary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Large</p>
                                        <button type="button" className="btn btn-custom btn-primary btn-lg">
                                            Primary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Medium</p>
                                        <button type="button" className="btn btn-custom btn-primary btn-md">
                                            Primary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Small</p>
                                        <button type="button" className="btn btn-custom btn-primary btn-sm">
                                            Primary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2"> Primary Disabled</p>
                                        <button type="button" className="btn btn-custom btn-primary btn-sm" disabled>
                                            Primary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Giant</p>
                                        <button type="button" className="btn btn-custom btn-secondary btn-giant">
                                            Secondary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Large</p>
                                        <button type="button" className="btn btn-custom btn-secondary btn-lg">
                                            Secondary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Medium</p>
                                        <button type="button" className="btn btn-custom btn-secondary btn-md">
                                            Secondary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Small</p>
                                        <button type="button" className="btn btn-custom btn-secondary btn-sm">
                                            Secondary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2"> Secondary Disabled</p>
                                        <button type="button" className="btn btn-custom btn-secondary btn-sm" disabled>
                                            Secondary
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-sm-4 col-md mb-3 mb-xl-0">
                                        <p className="mt-2">Button Link</p>
                                        <button type="button" className="btn btn-custom btn-link" onClick={handleClick}>
                                            View Details
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-6 mb-3 mb-xl-0">
                                        <p className="mt-2">Tab Button</p>
                                        <button
                                            type="button"
                                            className="w-40 btn btn-custom btn-tab justify-content-center align-items-center"
                                        >
                                            Tab Buttons
                                        </button>
                                        <button
                                            type="button"
                                            className="w-40 btn btn-custom btn-tab selected justify-content-center align-items-center"
                                        >
                                            Selected Tab Buttons
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                Box Shadow
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-1 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-1</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-2 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-2</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-3 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-3</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-4 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-4</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-5 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-5</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div className="w-75 mb-2 shadow-6 border" style={{ paddingTop: '75%' }}></div>
                                        <h6>Shadow-6</h6>
                                    </div>
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                                        <div
                                            className="w-75 mb-2 inner-shadow border"
                                            style={{ paddingTop: '75%' }}
                                        ></div>
                                        <h6>inner-shadow </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">Cards</div>
                            <div className="card-body">
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    {' '}
                                    Selection card{' '}
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
                                        <div className="custom-card card selection-card">
                                            <div className="card-body">Setup up your own cloud account</div>
                                        </div>
                                        <h6>Normal state</h6>
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
                                        <div className="custom-card card selection-card selected">
                                            <div className="card-body">
                                                Explore a pre-configured sandbox cloud account
                                            </div>
                                        </div>
                                        <h6>selected state</h6>
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
                                        <div className="custom-card card selection-card selected">
                                            <div className="card-body">
                                                <CImage
                                                    src={require('assets/aws_icons/aws.Logo.png')}
                                                    width="30%"
                                                    height="100%"
                                                />
                                                <h6>Amazon Web services</h6>
                                            </div>
                                        </div>
                                        <h6>Selected CloudAccount state</h6>
                                    </div>

                                    <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4">
                                        <div className="custom-card card selection-card">
                                            <div className="card-body">
                                                <CImage
                                                    src={require('assets/aws_icons/aws.Logo.png')}
                                                    width="30%"
                                                    height="100%"
                                                />
                                                <h6>Amazon Web services</h6>
                                            </div>
                                        </div>
                                        <h6>Not Selected CloudAccount state</h6>
                                    </div>
                                </div>
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    {' '}
                                    Severity card{' '}
                                </div>
                                <div className="d-flex">
                                    <CCard className="custom-card severity-card Critical">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div>
                                                <CIcon icon={cilStorage} className="mx-2" size="xl" />
                                            </div>
                                            <div>
                                                <p className="severity-text">Critical</p>
                                                <h4>2737</h4>
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card High">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div>
                                                <CIcon icon={cilStorage} className="mx-2" size="xl" />
                                            </div>
                                            <div>
                                                <p className="severity-text">High</p>
                                                <h4>2737</h4>
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card Medium">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div>
                                                <CIcon icon={cilStorage} className="mx-2" size="xl" />
                                            </div>
                                            <div>
                                                <p className="severity-text">Medium</p>
                                                <h4>2737</h4>
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card Low">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div>
                                                <CIcon icon={cilStorage} className="mx-2" size="xl" />
                                            </div>
                                            <div>
                                                <p className="severity-text">Low</p>
                                                <h4>2737</h4>
                                            </div>
                                        </div>
                                    </CCard>
                                </div>
                                <div className="d-flex">
                                    <CCard className="custom-card severity-card Critical bpi-card">
                                        <div className="card-side"></div>
                                        <div className="d-flex flex-column m-0 justify-content-start align-items-start">
                                            <div className="font-x-small-bold m-0 p-1 ps-3">BPI (90 - 100)</div>
                                            <div className="h2 m-0  ps-3">2737</div>
                                            <div className="d-flex m-0 card-bottom w-80 shadow-1">
                                                <div className="font-x-small-bold ps-3">Critical</div>
                                                <CIcon icon={cilSpeedometer} className="Critical-icon-color mx-2" />
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card High bpi-card">
                                        <div className="card-side"></div>
                                        <div className="d-flex flex-column m-0 justify-content-start align-items-start">
                                            <div className="font-x-small-bold m-0 p-1 ps-3">BPI (80 - 90)</div>
                                            <div className="h2 m-0  ps-3">2737</div>
                                            <div className="d-flex m-0 card-bottom w-80 shadow-1">
                                                <div className="font-x-small-bold ps-3">High</div>
                                                <CIcon icon={cilSpeedometer} className="High-icon-color mx-2" />
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card Medium bpi-card">
                                        <div className="card-side"></div>
                                        <div className="d-flex flex-column m-0 justify-content-start align-items-start">
                                            <div className="font-x-small-bold m-0 p-1 ps-3">BPI (70 - 80)</div>
                                            <div className="h2 m-0  ps-3">2737</div>
                                            <div className="d-flex m-0 card-bottom w-80 shadow-1">
                                                <div className="font-x-small-bold ps-3">Medium</div>
                                                <CIcon icon={cilSpeedometer} className="Medium-icon-color mx-2" />
                                            </div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card severity-card Low bpi-card">
                                        <div className="card-side"></div>
                                        <div className="d-flex flex-column m-0 justify-content-start align-items-start">
                                            <div className="font-x-small-bold m-0 p-1 ps-3">BPI ({'<'}70)</div>
                                            <div className="h2 m-0  ps-3">2737</div>
                                            <div className="d-flex m-0 card-bottom w-80 shadow-1">
                                                <div className="font-x-small-bold ps-3">Low</div>
                                                <CIcon icon={cilSpeedometer} className="Low-icon-color mx-2" />
                                            </div>
                                        </div>
                                    </CCard>
                                </div>
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    {' '}
                                    Status Indicator card{' '}
                                </div>
                                <div className="d-flex">
                                    <CCard className="custom-card status-indicator-card Critical">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div className="severity-text">Critical</div>
                                            <div>273</div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-card High">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div className="severity-text">High</div>
                                            <div>273</div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-card Medium">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div className="severity-text">Medium</div>
                                            <div>273</div>
                                        </div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-card Low">
                                        <div className="card-side"></div>
                                        <div className="d-flex">
                                            <div className="severity-text">Low</div>
                                            <div>273</div>
                                        </div>
                                    </CCard>
                                </div>
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    {' '}
                                    Status Indicator Chip{' '}
                                </div>
                                <div className="d-flex">
                                    <CCard className="custom-card status-indicator-chip Critical d-flex flex-row align-items-center justify-content-center">
                                        <div>
                                            <CIcon icon={cibDiscover} className="mx-2 severity-icon" />
                                        </div>
                                        <div className="severity-text">Critical</div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-chip High d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 severity-icon" />
                                        <div className="severity-text">High</div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-chip Medium d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 severity-icon" />
                                        <div className="severity-text">Medium</div>
                                    </CCard>
                                    <CCard className="custom-card status-indicator-chip Low d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 severity-icon" />
                                        <div className="severity-text">Low</div>
                                    </CCard>
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 Critical-icon-color" />
                                        <div className="body-small-semibold">Critical</div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 High-icon-color" />
                                        <div className="body-small-semibold">High</div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 Medium-icon-color" />
                                        <div className="body-small-semibold">Medium</div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <CIcon icon={cibDiscover} className="mx-2 Low-icon-color" />
                                        <div className="body-small-semibold">Low</div>
                                    </div>
                                </div>
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    Compliance card{' '}
                                </div>
                                <div className="d-flex mt-2">
                                    <CCard className="custom-card compliance-card d-flex flex-row align-items-center justify-content-center mx-2">
                                        <div className="compliance-text text-success mt-2 me-2">Compliant</div>
                                        <div>12</div>
                                    </CCard>
                                    <CCard className="custom-card compliance-card d-flex flex-row align-items-center justify-content-center mx-2">
                                        <div className="compliance-text text-danger mt-2 me-2">Non-Compliant</div>
                                        <div>12</div>
                                    </CCard>
                                </div>
                            </div>
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                Details card{' '}
                            </div>
                            <div className="d-flex mb-2">
                                <CCard className="custom-card short-details-card">
                                    <CCardBody className="card-body-details">
                                        <div className="card-icon">
                                            <CIcon icon={cilFolder} className="mx-2 fa-2x" size="xxl" />
                                        </div>
                                        <div>
                                            <div className="card-title font-medium text-nowrap text-truncate w-75">
                                                Account A
                                            </div>
                                            <div className="card-sub-text">
                                                BPI:
                                                <span className="percentage-text">
                                                    95% <CIcon icon={cilArrowTop} className="mx-2" />
                                                </span>
                                            </div>
                                        </div>
                                    </CCardBody>
                                    <CCardFooter>
                                        <button type="button" className="btn-custom btn btn-link">
                                            View Details
                                            <CIcon icon={cilChevronRight} className="mx-2" />
                                        </button>
                                    </CCardFooter>
                                </CCard>

                                <CCard className="custom-card long-details-card">
                                    <CCardBody className="card-body-details">
                                        <div className="card-icon">
                                            <CIcon icon={cilFolder} className="mx-2 fa-2x" size="xxl" />
                                        </div>
                                        <div>
                                            <div className="card-title"> aws-cloudtrail-logs-44050685 </div>
                                            <div className="card-sub-text">
                                                {' '}
                                                BPI:
                                                <span className="percentage-text">
                                                    95% <CIcon icon={cilArrowTop} className="mx-2" />
                                                </span>
                                            </div>
                                        </div>
                                    </CCardBody>
                                    <CCardFooter>
                                        <button type="button" className="btn-custom btn btn-link">
                                            View Tags
                                            <CIcon icon={cilChevronRight} className="mx-2" />
                                        </button>{' '}
                                        |
                                        <button type="button" className="btn-custom btn btn-link">
                                            View Details
                                            <CIcon icon={cilChevronRight} className="mx-2" />
                                        </button>
                                    </CCardFooter>
                                </CCard>

                                <CCard className="custom-card long-details-card">
                                    <CCardBody className="card-body-details flex-column">
                                        <div className="d-flex flex-row-reverse align-items-center font-caption-bold Critical-icon-color">
                                            <CIcon icon={cilXCircle} className="mx-2" />
                                            12 % failed
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="card-icon">
                                                <CIcon icon={cilStorage} className="mx-2 fa-2x" size="xxl" />
                                            </div>
                                            <div className="card-title font-medium text-nowrap text-truncate w-75">
                                                Amazon S3 security best practices
                                            </div>
                                        </div>
                                        <div className="d-flex flex-row-reverse">
                                            <button type="button" className="btn-custom btn btn-link">
                                                View Details
                                                <CIcon icon={cilChevronRight} className="mx-2" />
                                            </button>
                                        </div>
                                    </CCardBody>
                                </CCard>

                                <CCard className="custom-card risk-card">
                                    <span className="badge font-x-small ms-auto">Application Vulnerabilities</span>
                                    <CCardBody className="card-body-details pt-1 pb-2">
                                        <div className="card-side"></div>
                                        <div className="h5 mb-0">Unencrypted PII Data</div>
                                        <div className="font-small-semibold"> Attribution to BPI: 30% </div>
                                        <div className="font-small mt-1"> Risk found on June 12 | 10:43 pm </div>
                                    </CCardBody>
                                    <CCardFooter>
                                        <button type="button" className="btn-custom btn btn-link">
                                            View Details
                                            <CIcon icon={cilChevronRight} className="mx-2" />
                                        </button>
                                    </CCardFooter>
                                </CCard>
                            </div>
                        </div>

                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                {' '}
                                Breadcrums
                            </div>
                            <div className="card-body">
                                <div className="breadcrumb-custom">
                                    <ol className="breadcrumb border-0">
                                        <li className="breadcrumb-item">
                                            <a href="#section"> All cloud accounts</a>
                                        </li>
                                        <li className="breadcrumb-item" role="presentation">
                                            <a href="#section"> Account A</a>
                                        </li>
                                        <li className="breadcrumb-item active">aws-cloudtrail-logs-44057520685</li>
                                    </ol>
                                </div>

                                <div className="d-flex flex-row align-items-center">
                                    <div className="toggle-icon pt-1 text-center">
                                        <CIcon
                                            icon={cilHamburgerMenu}
                                            size="xxl"
                                            className="mx-1 cursor-pointer "
                                            onClick={toggleMenu}
                                        ></CIcon>
                                    </div>
                                    <CNavbar
                                        className={`navbar-custom custom-menu p-0 ${
                                            isMenuCollapse ? 'menu-collapse' : 'menu-open'
                                        }`}
                                    >
                                        <div className="d-flex flex-row align-items-center w-250 ms-4">
                                            <CNavbarNav className="d-flex flex-row">
                                                <CNavLink href="#" active>
                                                    Home
                                                </CNavLink>
                                                <CNavLink href="#">Features</CNavLink>
                                                <CNavLink href="#">Pricing</CNavLink>
                                                <CNavLink href="#" disabled>
                                                    Disabled
                                                </CNavLink>
                                            </CNavbarNav>
                                            <CIcon
                                                icon={cilX}
                                                className="mx-2 ms-4 cursor-pointer close-icon"
                                                onClick={toggleMenu}
                                            ></CIcon>
                                        </div>
                                    </CNavbar>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-transparent border-0 mb-0">
                            <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                Input Fields
                            </div>
                            <div className="card-body">
                                <CInputGroup className={`mb-3`}>
                                    <CInputGroupText
                                        className={`form-control custom-input-box-label ${
                                            input1HasError ? 'invalid-input-label' : ''
                                        }`}
                                    >
                                        Label
                                    </CInputGroupText>
                                    <CFormInput
                                        className={`w-50 custom-input custom-input-box  ${
                                            input1HasError ? 'invalid-input' : ''
                                        }`}
                                        placeholder={'input1'}
                                        autoComplete={'input1'}
                                        value={input1}
                                        onChange={(e: any) => input1Chagehandler(e.target.value)}
                                        onBlur={input1BlurHandler}
                                    />
                                    <div className="input-label-error">
                                        {input1HasError && (
                                            <React.Fragment>
                                                {/* <OverlayTrigger
                                                    placement="bottom"
                                                    overlay={(props: any) => renderTooltip(props, 'Invalid')}
                                                    show
                                                >
                                                    <CButton>
                                                        <FontAwesomeIcon icon={faInfoCircle} className="invalid" />
                                                    </CButton>
                                                </OverlayTrigger> */}
                                            </React.Fragment>
                                        )}
                                    </div>
                                </CInputGroup>
                                <CInputGroup className={`mb-3`}>
                                    <div className={`form-control custom-input-box-label`}>Label</div>
                                    <CFormInput
                                        className={`w-50 custom-input custom-input-box `}
                                        placeholder={'input12'}
                                        autoComplete={'input2'}
                                        value={input2}
                                        onChange={(e: any) => input2Chagehandler(e.target.value)}
                                        onBlur={input2BlurHandler}
                                    />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CFormInput
                                        className={'w-50 custom-input custom-input-auth '}
                                        type="text"
                                        placeholder={'Input 1 without label'}
                                        autoComplete="input3"
                                        value={input3}
                                        onChange={(e: any) => input3Chagehandler(e.target.value)}
                                        onBlur={input3BlurHandler}
                                    />
                                </CInputGroup>

                                <CInputGroup className="mb-3 align-items-center">
                                    <CFormInput
                                        className={`w-50 custom-input custom-input-auth  ${
                                            input4HasError ? 'invalid-input' : ''
                                        }`}
                                        type="text"
                                        placeholder={'Input 1 without label'}
                                        autoComplete="input4"
                                        value={input4}
                                        onChange={(e: any) => input4Chagehandler(e.target.value)}
                                        onBlur={input4BlurHandler}
                                    />
                                    <CInputGroupText style={{ position: 'absolute', right: 0, zIndex: 1 }}>
                                        {input4HasError && (
                                            <React.Fragment>
                                                {/* <OverlayTrigger
                                                    placement="bottom-start"
                                                    overlay={(props: any) => renderTooltip(props, 'Invalid')}
                                                    show
                                                >
                                                    <CButton className="btn">
                                                        <FontAwesomeIcon icon={faInfoCircle} className="invalid" />
                                                    </CButton>
                                                </OverlayTrigger> */}
                                            </React.Fragment>
                                        )}
                                    </CInputGroupText>
                                </CInputGroup>
                            </div>
                            <div className="card bg-transparent border-0 mb-0">
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    Search Box
                                </div>
                                <div className="card-body">
                                    <div className="d-flex shadow-6 border-neutral-700">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                            value={searchValue}
                                            onChange={(e: any) => setSearchValue(e.target.value)}
                                        />
                                        <span className="input-group-addon">
                                            <button
                                                className="btn btn-secondary"
                                                type="button"
                                                onClick={() => setSearchValue('')}
                                            >
                                                {searchValue.length > 0 ? (
                                                    <CIcon icon={cilX} size="sm" title="Clear" />
                                                ) : (
                                                    <CIcon icon={cilSearch} size="lg" />
                                                )}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-transparent border-0 mb-0">
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    Dropdown with label
                                </div>
                                <div className="card-body">
                                    <div className="d-flex">
                                        <div className="d-flex align-items-center px-2 shadow-6 border-neutral-700">
                                            <div className="font-x-small-medium">Filter</div>
                                            <div>
                                                <CDropdown placement="bottom" className="m-1 d-inline-block">
                                                    <CDropdownToggle className="btn-secondary">
                                                        Dropdown button
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem>First item</CDropdownItem>
                                                        <CDropdownItem>Second item</CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center px-2 shadow-6 border-neutral-700">
                                            <div className="font-x-small-medium">Filter</div>
                                            <div>
                                                <CDropdown placement="bottom" className="m-1 d-inline-block">
                                                    <CDropdownToggle className="btn-secondary">
                                                        Dropdown button
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem>First item</CDropdownItem>
                                                        <CDropdownItem>Second item</CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-transparent border-0 mb-0">
                                <div className="card-header bg-transparent border-color-600 font-weight-bold">
                                    Toaster
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-custom btn-success btn-lg"
                                            onClick={() =>
                                                dispatch(
                                                    setToastMessageAction(
                                                        ToastVariant.SUCCESS,
                                                        'This is a success toast',
                                                    ),
                                                )
                                            }
                                        >
                                            Success
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-custom btn-warning btn-lg"
                                            onClick={() =>
                                                dispatch(
                                                    setToastMessageAction(
                                                        ToastVariant.WARNING,
                                                        'This is a warning toast',
                                                    ),
                                                )
                                            }
                                        >
                                            WARNING
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-custom btn-danger btn-lg"
                                            onClick={() =>
                                                dispatch(
                                                    setToastMessageAction(
                                                        ToastVariant.DANGER,
                                                        'This is a danger toast',
                                                    ),
                                                )
                                            }
                                        >
                                            DANGER
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <CCard className="custom-card short-details-card w-50">
                                    <CCardHeader className="card-header">Heading</CCardHeader>
                                    <CCardBody className="card-body-details">
                                        <CChart
                                            type="pie"
                                            data={{
                                                labels: [
                                                    'Used Access' + '             5',
                                                    'Unused Access' + '         5',
                                                ],
                                                datasets: [
                                                    {
                                                        data: [12, 2],
                                                        backgroundColor: ['#F8D9AE', '#DF8996'],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        align: 'center',
                                                        position: 'right',
                                                        fullSize: false,
                                                        labels: {
                                                            padding: 20,
                                                            boxWidth: 20,
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </CCardBody>
                                    <CCardFooter>
                                        <button type="button" className="btn-custom btn btn-link">
                                            View Details
                                            <CIcon icon={cilChevronRight} className="mx-2" />
                                        </button>
                                    </CCardFooter>
                                </CCard>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Overlay show={show} target={target} placement="right" container={ref} containerPadding={20}>
                    <Popover id="popover-contained">
                        <Popover.Title as="h3" style={{ alignContent: 'center' }} onClick={() => alert('hi')}>
                            Risk{' '}
                        </Popover.Title>
                        <Popover.Title as="h3">Information</Popover.Title>
                        
                    </Popover>
                </Overlay>  */}
                <CPopover
                    title={'Risk'}
                    placement="top"
                    content={
                        <CButton
                            onClick={() =>
                                dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'This is a success toast'))
                            }
                        >
                            Test
                        </CButton>
                    }
                >
                    <CButton color="secondary">Popover on top</CButton>
                </CPopover>
                <CustomModal
                    show={show}
                    onHide={() => setShow(false)}
                    fullScreen={true}
                    size={'xl'}
                    dialogClassName="modal-190w"
                    className="square-corner width:100"
                >
                    <b>Risk Name</b>
                    <p>
                        Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde commodi aspernatur enim,
                        consectetur. Cumque deleniti temporibus ipsam atque a dolores quisquam quisquam adipisci
                        possimus laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod accusamus eos quod. Ab
                        quos consequuntur eaque quo rem! Mollitia reiciendis porro quo magni incidunt dolore amet atque
                        facilis ipsum deleniti rem!
                    </p>
                    <b>Risk Resson</b>
                    <p>
                        Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde commodi aspernatur enim,
                        consectetur. Cumque deleniti temporibus ipsam atque a dolores quisquam quisquam adipisci
                        possimus laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod accusamus eos quod. Ab
                        quos consequuntur eaque quo rem! Mollitia reiciendis porro quo magni incidunt dolore amet atque
                        facilis ipsum deleniti rem!
                    </p>
                </CustomModal>
            </div>
        </>
    );
};

export default StyleGuide;
