import React from 'react';
import { ViewTypes } from 'shared/models/DataEndpointSummaryModel';
import { CButton } from '@coreui/react';

type DataEndpointViewChangeButtonProps = {
    title: ViewTypes;
    onChange: (view: ViewTypes) => void;
    isSelected: boolean;
    // iconName: IconDefinition;
};

const DataEndpointViewChangeButton = (props: DataEndpointViewChangeButtonProps) => {
    return (
        <CButton
            className={`btn ${props.isSelected ? 'btn-primary' : 'btn-secondary'} mx-1`}
            onClick={() => props.onChange(props.title)}
        >
            {/* <FontAwesomeIcon icon={props.iconName} />  */}
            <span className="mx-2">{props.title}</span>
        </CButton>
    );
};

export default DataEndpointViewChangeButton;
