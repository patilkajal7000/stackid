import { CButton } from '@coreui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/store';
import { toggleRightSidebar } from '../../utils/Services';
import CIcon from '@coreui/icons-react';
import { cilChevronRight } from '@coreui/icons';
import { changeRightSidebarAction } from 'store/actions/SidebarAction';

type RightSidePanelTogglerProps = {
    customClass: string;
    customStyle?: React.CSSProperties;
    iconColor?: string;
};

const RightSidePanelToggler = ({ customClass, customStyle, iconColor }: RightSidePanelTogglerProps) => {
    const dispatch = useDispatch();
    const rightSidebarState = useSelector((state: AppState) => state.rightSidebarState);
    const panel_open_class_button = rightSidebarState.sidebarShow ? 'panel_open' : '';
    const panel_open_class_icon = rightSidebarState.sidebarShow ? 'panel_open__icon_rotated' : 'panel_open_icon';

    return (
        <CButton
            className={`btn-sidebar-toggle ms-3 d-md-down-none btn btn-success ${customClass} ${panel_open_class_button}`}
            onClick={() => {
                const value = toggleRightSidebar(rightSidebarState);
                dispatch(changeRightSidebarAction(value));
            }}
            style={customStyle}
        >
            <CIcon icon={cilChevronRight} color={iconColor} className={panel_open_class_icon} />
        </CButton>
    );
};

export default RightSidePanelToggler;
