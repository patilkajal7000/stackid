import { SetTabScreenName } from 'shared/models/ReduxModels/ActionModels';
import { SET_SCREEN_NAME } from './ActionConstants';

export const setTabsAction = (screenName: string, activeTab: string, parentTab = ''): SetTabScreenName => {
    return {
        type: SET_SCREEN_NAME,
        screenName,
        activeTab,
        parentTab,
    };
};
