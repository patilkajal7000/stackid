import { SetSelectedRiskAction } from 'shared/models/ReduxModels/ActionModels';
import { RiskCardModel } from 'shared/models/RiskModel';
import { SET_SELECTED_RISK } from './ActionConstants';

export const setSelectedRiskAction = (selectedRisk: RiskCardModel | null): SetSelectedRiskAction => {
    return {
        type: SET_SELECTED_RISK,
        selectedRisk,
    };
};
