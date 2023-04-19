import { SetToastMessageAction } from 'shared/models/ReduxModels/ActionModels';
import { ToastState } from '../../shared/models/ReduxModels/ReducerModels';
import { SET_TOAST_MESSAGE } from '../actions/ActionConstants';

const initialState: ToastState | undefined = {
    message: '',
    variant: undefined,
};

export const toastStateReducer = (state = initialState, action: SetToastMessageAction): ToastState => {
    switch (action.type) {
        case SET_TOAST_MESSAGE:
            return {
                ...state,
                message: action.message,
                variant: action.variant,
            };
        default:
            return state;
    }
};
