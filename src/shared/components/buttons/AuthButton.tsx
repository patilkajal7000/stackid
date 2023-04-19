import React from 'react';
import RippleEffect from '../ripple_effect/RippleEffect';
import SpinnerLoader from '../loaders/SpinnerLoader';

type AuthButtonsProps = {
    onClick: (e: any) => void;
    title: string;
    isLoading: boolean;
    className: string;
    enable: boolean;
    buttonType: 'giant' | 'lg' | 'md' | 'sm';
    type: 'primary' | 'secondary';
};

const AuthButton = (props: AuthButtonsProps) => {
    return (
        <RippleEffect
            onClickHandler={props.onClick}
            classes={`justify-content-center ${props.className} 
        ${props.isLoading || !props.enable ? 'disabled-ripple-effect' : ''}`}
        >
            <button
                type="submit"
                className={`px-4 h3 btn btn-custom btn-${props.type} btn-${props.buttonType} w-100`}
                disabled={props.isLoading || !props.enable}
                title={props.title}
            >
                {props.isLoading ? <SpinnerLoader /> : props.title}
            </button>
        </RippleEffect>
    );
};

export default AuthButton;

AuthButton.defaultProps = {
    isLoading: false,
    className: 'w-75',
    enable: true,
    buttonType: 'md',
    type: 'primary',
};
