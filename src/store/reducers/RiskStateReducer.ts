import { SetSelectedRiskAction } from 'shared/models/ReduxModels/ActionModels';
import { RiskState } from 'shared/models/ReduxModels/ReducerModels';
import { SET_SELECTED_RISK } from 'store/actions/ActionConstants';

const initialState: RiskState | null = {
    selectedRisk: null,
};

export const riskStateReducer = (state = initialState, action: SetSelectedRiskAction): RiskState => {
    switch (action.type) {
        case SET_SELECTED_RISK:
            return {
                ...state,
                selectedRisk: action.selectedRisk,
            };
        default:
            return state;
    }
};
