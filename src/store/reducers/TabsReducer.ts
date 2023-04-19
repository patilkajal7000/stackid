import { SetTabScreenAction } from 'shared/models/ReduxModels/ActionModels';
import { TabsState } from '../../shared/models/ReduxModels/ReducerModels';
import { SET_SCREEN_NAME } from '../actions/ActionConstants';

const initialState: TabsState = {
    activeTab: '',
    screenName: '',
    parentTab: '',
};

export const tabsStateReducer = (state = initialState, action: SetTabScreenAction): TabsState => {
    switch (action.type) {
        case SET_SCREEN_NAME:
            return {
                ...state,
                activeTab: action.activeTab,
                screenName: action.screenName,
                parentTab: action.parentTab,
            };
        default:
            return state;
    }
};
