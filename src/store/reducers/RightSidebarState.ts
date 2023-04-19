import { SidebarActions } from '../../shared/models/ReduxModels/ActionModels';
import { RHSPanelState } from '../../shared/models/ReduxModels/ReducerModels';
import {
    SET_RIGHT_SIDEBAR,
    SET_RHS_JSON_DATA,
    SET_SELECTED_RHS_DATA,
    REMOVE_SELECTED_RHS_DATA,
    SHOW_HIDE_RHSPANEL,
    SET_SELECTED_BUCKET,
} from '../actions/ActionConstants';

const initialState: RHSPanelState = {
    sidebarShow: false,
    sidebarJSON: {},
    selectedCard: [],
    showPanelToggler: false,
    selectedBucket: undefined,
};

export const rightSidebarState = (state: RHSPanelState = initialState, action: SidebarActions): RHSPanelState => {
    switch (action.type) {
        case SET_RIGHT_SIDEBAR:
            return { ...state, sidebarShow: action.sidebarShow };
        case SET_RHS_JSON_DATA:
            return { ...state, sidebarJSON: action.sidebarJSON };
        case SET_SELECTED_RHS_DATA:
            return { ...state, selectedCard: action.selectedCard };
        case REMOVE_SELECTED_RHS_DATA:
            return { ...state, selectedCard: [] };
        case SHOW_HIDE_RHSPANEL:
            return { ...state, showPanelToggler: action.showPanelToggler };
        case SET_SELECTED_BUCKET:
            return { ...state, selectedBucket: action.selectedBucket };
        default:
            return state;
    }
};
