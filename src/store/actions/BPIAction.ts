import { BPIModel } from 'shared/models/BPIModel';
import { SetBPIDetailsAction } from 'shared/models/ReduxModels/ActionModels';
import { SET_BPI_DETAILS } from './ActionConstants';

export const setBPIDetailsAction = (bpiDetails: BPIModel): SetBPIDetailsAction => {
    return {
        type: SET_BPI_DETAILS,
        bpiDetails,
    };
};
