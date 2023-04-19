import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { SetBreadcrumbData } from 'shared/models/ReduxModels/ActionModels';
import { SET_BREADCRUMB_DATA } from './ActionConstants';

export const setBreadcrumbAction = (breadcrumbData: SIBreadcrumbItem[] | []): SetBreadcrumbData => {
    return {
        type: SET_BREADCRUMB_DATA,
        breadcrumbData,
    };
};
