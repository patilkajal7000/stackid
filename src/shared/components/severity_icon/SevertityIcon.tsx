import React from 'react';
import { SeverityType } from '../../models/RHSModel';
import { getSeverityColor } from '../../service/Severity.service';
type Props = {
    severity: SeverityType;
};
const SevertityIcons = (props: Props) => {
    return (
        <div className="float-start">
            <span
                className={`mx-1 px-2 rounded-circle ${getSeverityColor(props.severity)}`}
                title={props.severity}
            ></span>
        </div>
    );
};

export default SevertityIcons;
