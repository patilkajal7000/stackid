import React from 'react';

type Props = {
    isSelected: boolean;
    onClick: () => void;
    value: string;
    showCount?: boolean;
    count?: number;
};
const SelectedFilterButton = (props: Props) => {
    return (
        <button
            type="button"
            className={`btn btn-custom btn-filter ${
                props.isSelected ? 'selected' : ''
            } justify-content-center align-items-center me-2`}
            onClick={props.onClick}
        >
            {props.value} ({props.showCount && props.count})
        </button>
    );
};

export default SelectedFilterButton;
