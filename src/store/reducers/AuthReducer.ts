import { Cookies } from 'react-cookie';
import { AuthActions } from 'shared/models/ReduxModels/ActionModels';
import { AuthState } from 'shared/models/ReduxModels/ReducerModels';
import { ORGANIZATION_NAME_COOKIE, USER_DETAILS_COOKIE } from 'shared/utils/Constants';
import { SET_TOKEN, REMOVE_TOKEN, UPDATE_TOKEN, UPDATE_USER } from '../actions/ActionConstants';

const initialState: AuthState = {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
};

export const authReducer = (state: AuthState = initialState, action: AuthActions): AuthState => {
    const cookie = new Cookies();
    switch (action.type) {
        case SET_TOKEN: {
            const updatedState = {
                ...state,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                user: action.user,
            };
            cookie.set(USER_DETAILS_COOKIE, updatedState, { path: '/' });
            cookie.set(ORGANIZATION_NAME_COOKIE, updatedState.user.org.name, { path: '/' });
            return updatedState;
        }
        case UPDATE_TOKEN:
            return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken };
        case REMOVE_TOKEN:
            cookie.remove(USER_DETAILS_COOKIE);
            return { ...initialState };
        case UPDATE_USER: {
            const updatedUserState = { ...state, user: action.user };
            cookie.set(USER_DETAILS_COOKIE, updatedUserState, { path: '/' });
            return updatedUserState;
        }
        default:
            return state;
    }
};
