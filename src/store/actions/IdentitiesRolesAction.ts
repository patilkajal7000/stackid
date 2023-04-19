import { SetIdentitiesRolesData } from 'shared/models/ReduxModels/ActionModels';
import { SET_IDENTITIES_ROLES } from './ActionConstants';

export const SetIdentitiesRolesAction = (data: any | null): SetIdentitiesRolesData => {
    return {
        type: SET_IDENTITIES_ROLES,
        data,
    };
};
