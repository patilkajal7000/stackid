import { SetToastMessage } from 'shared/models/ReduxModels/ActionModels';
import { ToastVariant } from 'shared/utils/Constants';
import { SET_TOAST_MESSAGE } from './ActionConstants';

export const setToastMessageAction = (variant: ToastVariant, message: string): SetToastMessage => {
    return {
        type: SET_TOAST_MESSAGE,
        variant,
        message,
    };
};
