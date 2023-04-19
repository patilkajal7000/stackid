import React, { useState, ReactNode } from 'react';
import './RippleEffect.scss';

type RippleEffectProps = {
    children: ReactNode;
    classes: string;
    onClickHandler: (e: any) => void;
};
const RippleEffect = (props: RippleEffectProps) => {
    const [count, setCount] = useState(0);
    const [spanStyles, setSpanStyles] = useState<any>({});

    const showRipple = (e: any) => {
        const rippleContainer = e.currentTarget;
        const size = rippleContainer.offsetWidth;
        const pos = rippleContainer.getBoundingClientRect();
        const x = e.pageX - pos.x - size / 2;
        const y = e.pageY - pos.y - size / 2;
        const spanStylesNew = { top: y + 'px', left: x + 'px', height: size + 'px', width: size + 'px' };
        setCount(count + 1);
        setSpanStyles({ ...spanStyles, [count]: spanStylesNew });
    };

    const renderRippleSpan = () => {
        const spanArray = Object.keys(spanStyles);
        if (spanArray && spanArray.length > 0) {
            return spanArray.map((key, index) => {
                return <span key={'spanCount_' + index} className="" style={{ ...spanStyles[key] }}></span>;
            });
        } else {
            return null;
        }
    };

    const cleanUp = () => {
        setCount(0);
        setSpanStyles({});
    };

    const callCleanUp = (cleanup: any, delay: any) => {
        return function () {
            let bounce: any = {};
            clearTimeout(bounce);
            bounce = setTimeout(() => {
                cleanup();
            }, delay);
        };
    };

    return (
        <div className={'ripple ' + props.classes} onClick={props.onClickHandler} role="presentation">
            {props.children}
            <div
                className="rippleContainer"
                onMouseDown={showRipple}
                onMouseUp={() => callCleanUp(cleanUp, 2000)}
                role="presentation"
            >
                {renderRippleSpan()}
            </div>
        </div>
    );
};

export default RippleEffect;
