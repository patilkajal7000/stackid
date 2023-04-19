import { SideBarState } from '../../shared/models/ReduxModels/ReducerModels';
import { SET_LEFT_SIDEBAR } from '../actions/ActionConstants';

const initialState: SideBarState = {
    sidebarShow: false,
};

export const leftSidebarState = (state = initialState, { type, ...rest }: any): SideBarState => {
    switch (type) {
        case SET_LEFT_SIDEBAR:
            return { ...state, ...rest };
        default:
            return state;
    }
};
