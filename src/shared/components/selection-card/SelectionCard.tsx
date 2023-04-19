import React from 'react';
import { CImage } from '@coreui/react';

type SelectionCardProps = {
    content: string;
    withImage?: boolean;
    isSelected: boolean;
    itemKey: string;
    onChangeSelection: (key: string) => void;
    type: string;
};
const SelectionCard = React.forwardRef(
    ({ content, withImage = false, isSelected = false, itemKey, onChangeSelection, type }: SelectionCardProps) => {
        const onKeyPressHandler = () => {
            return;
        };
        return (
            <div
                onKeyPress={onKeyPressHandler}
                role="presentation"
                className={`w-25 custom-card card selection-card mx-2 ${isSelected ? 'selected' : ''}`}
                onClick={() => onChangeSelection(itemKey)}
            >
                <div className="card-body">
                    {withImage && <CImage src={get_images(type)} className="mb-3" />}
                    <h6>{content}</h6>
                </div>
            </div>
        );
    },
);

export default SelectionCard;

const get_images = (type: string) => {
    switch (type) {
        case 'kubernetes':
            return require('assets/images/kubernetes_colored.png');
        case 'google_cloud':
            return require('assets/images/google_cloud_colored.png');
        case 'azure':
            return require('assets/images/azure_colored.png');
        case 'amazon':
            return require('assets/images/aws_colored.png');
        case 'snowflake':
            return require('assets/images/snowflake.svg');
        case 'git':
            return require('assets/images/github.svg');
        default:
            return require('assets/images/aws_colored.png');
    }
};
