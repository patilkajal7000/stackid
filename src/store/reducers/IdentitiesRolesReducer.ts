import { IdetitiesRolesState } from '../../shared/models/ReduxModels/ReducerModels';
import { SET_IDENTITIES_ROLES } from '../actions/ActionConstants';
import { SetIdentitiesRolesData } from 'shared/models/ReduxModels/ActionModels';

const initialState: IdetitiesRolesState = {
    data: null,
};

export const identitiesRolesReducer = (state = initialState, action: SetIdentitiesRolesData): IdetitiesRolesState => {
    switch (action.type) {
        case SET_IDENTITIES_ROLES:
            return { ...state, data: action.data };
        default:
            return state;
    }
};
