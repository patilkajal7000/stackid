import { AuthModel, User } from 'shared/models/AuthModel';
import {
    AuthAction,
    AuthRemoveAction,
    AuthUpdateTokenAction,
    AuthUpdateUserAction,
} from 'shared/models/ReduxModels/ActionModels';
import { REMOVE_TOKEN, SET_TOKEN, UPDATE_TOKEN, UPDATE_USER } from './ActionConstants';

export const setAuthTokens = (tokenData: AuthModel): AuthAction => {
    return {
        type: SET_TOKEN,
        ...tokenData,
    };
};

export const removeAuthTokens = (): AuthRemoveAction => {
    return {
        type: REMOVE_TOKEN,
    };
};

export const updateAuthToken = (accessToken: string, refreshToken: string): AuthUpdateTokenAction => {
    return {
        type: UPDATE_TOKEN,
        accessToken,
        refreshToken,
    };
};

export const updateUser = (user: User): AuthUpdateUserAction => {
    return {
        type: UPDATE_USER,
        user,
    };
};
