import { SetBPIDetailsAction } from 'shared/models/ReduxModels/ActionModels';
import { BPIState } from 'shared/models/ReduxModels/ReducerModels';
import { SET_BPI_DETAILS } from 'store/actions/ActionConstants';

const initialState: BPIState | undefined = {
    bpiDetails: {
        bpi: 0,
        last_checked_on: undefined,
    },
};

export const bpiStateReducer = (state = initialState, action: SetBPIDetailsAction): BPIState => {
    switch (action.type) {
        case SET_BPI_DETAILS:
            return {
                ...state,
                bpiDetails: action.bpiDetails,
            };
        default:
            return state;
    }
};
