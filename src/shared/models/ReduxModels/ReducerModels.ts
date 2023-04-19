import { ToastVariant } from 'shared/utils/Constants';
import { User } from '../AuthModel';
import { BPIModel } from '../BPIModel';
import { SIBreadcrumbItem } from '../BreadcrumModel';
import { CloudAccountModel } from '../CloudAccountModel';
import { BodyDetail, RHSModel } from '../RHSModel';
import { RiskCardModel } from '../RiskModel';

export interface SideBarState {
    sidebarShow: true | false | 'responsive';
}

export interface RHSPanelState {
    sidebarShow: true | false | 'responsive';
    sidebarJSON: RHSModel;
    selectedCard: BodyDetail[];
    showPanelToggler: boolean;
    selectedBucket: any;
}

export interface AuthState {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    user: User | undefined;
}

export interface CloudAccountState {
    cloudAccounts: CloudAccountModel[];
    selectedCloudAccount: CloudAccountModel | undefined;
    getDataCalled: boolean;
}
export interface TabsState {
    screenName: string;
    activeTab: string;
    parentTab: string;
}

export interface BreadcrumbState {
    breadcrumbData: SIBreadcrumbItem[] | [];
}

export interface ToastState {
    variant: ToastVariant | undefined;
    message: string;
}

export interface BPIState {
    bpiDetails: BPIModel;
}

// Risk Panel
export interface RiskState {
    selectedRisk: RiskCardModel | null;
}

export interface IdetitiesRolesState {
    data: any | null;
}
