import { SetBreadcrumbAction } from 'shared/models/ReduxModels/ActionModels';
import { BreadcrumbState } from '../../shared/models/ReduxModels/ReducerModels';
import { SET_BREADCRUMB_DATA } from '../actions/ActionConstants';

const initialState: BreadcrumbState = {
    breadcrumbData: [],
};

export const breadcrumStateReducer = (state = initialState, action: SetBreadcrumbAction): BreadcrumbState => {
    switch (action.type) {
        case SET_BREADCRUMB_DATA:
            return { ...state, breadcrumbData: action.breadcrumbData };
        default:
            return state;
    }
};
