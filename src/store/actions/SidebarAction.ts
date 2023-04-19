import {
    LHSOpenCloseAction,
    RHSPanelOpenCloseAction,
    SidebarDataAction,
    SidebarSelectedDataAction,
    RemoveSidebarSelectedDataAction,
    ShowSidebarSelectedToggleAction,
    SelectedBucketDetailsAction,
} from '../../shared/models/ReduxModels/ActionModels';
import { BodyDetail, RHSModel } from '../../shared/models/RHSModel';
import {
    SET_LEFT_SIDEBAR,
    SET_RIGHT_SIDEBAR,
    SET_RHS_JSON_DATA,
    SET_SELECTED_RHS_DATA,
    REMOVE_SELECTED_RHS_DATA,
    SHOW_HIDE_RHSPANEL,
    SET_SELECTED_BUCKET,
} from './ActionConstants';

export const changeLeftSidebarAction = (sidebarShow: true | false | 'responsive'): LHSOpenCloseAction => {
    return {
        type: SET_LEFT_SIDEBAR,
        sidebarShow,
    };
};

export const changeRightSidebarAction = (sidebarShow: true | false | 'responsive'): RHSPanelOpenCloseAction => {
    return {
        type: SET_RIGHT_SIDEBAR,
        sidebarShow,
    };
};

export const setRightSidebarJSONAction = (sidebarJSON: RHSModel): SidebarDataAction => {
    return {
        type: SET_RHS_JSON_DATA,
        sidebarJSON,
    };
};

export const setRightSidebarSelectedDataAction = (selectedCard: BodyDetail[]): SidebarSelectedDataAction => {
    return {
        type: SET_SELECTED_RHS_DATA,
        selectedCard,
    };
};

export const removeSidebarSelectedDataAction = (): RemoveSidebarSelectedDataAction => {
    return {
        type: REMOVE_SELECTED_RHS_DATA,
    };
};

export const toggleRHSPanelAction = (showPanelToggler: boolean): ShowSidebarSelectedToggleAction => {
    return {
        type: SHOW_HIDE_RHSPANEL,
        showPanelToggler,
    };
};

export const setSelectedBucketDetailsAction = (selectedBucket: any): SelectedBucketDetailsAction => {
    return {
        type: SET_SELECTED_BUCKET,
        selectedBucket,
    };
};
