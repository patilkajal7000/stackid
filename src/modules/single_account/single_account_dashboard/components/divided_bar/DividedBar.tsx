import React from 'react';
import { CProgress, CProgressBar } from '@coreui/react';
import { Category } from '../../../../../shared/models/DataEndpointSummaryModel';

export type Props = {
    data: Array<Category>;
    showValue?: boolean;
    onClickBar?: (event: any) => void;
};

const DividedBar = (props: Props) => {
    const onClick = (category: Category) => {
        props?.onClickBar ? props?.onClickBar(category) : null;
    };

    return (
        <div>
            <CProgress className="mt-1" style={{ cursor: 'pointer' }}>
                {props.data && props.data.length > 0
                    ? props.data.map((category: Category, index: number) => (
                          <CProgressBar
                              key={index}
                              value={category.value}
                              className={category.severity}
                              title={category.severity + '(' + category.value + ')'}
                              onClick={() => onClick(category)}
                          >
                              {props.showValue ? category.value : ''}
                          </CProgressBar>
                      ))
                    : ''}
            </CProgress>
        </div>
    );
};

export default DividedBar;
