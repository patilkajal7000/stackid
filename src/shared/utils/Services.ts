import { SideBarState } from '../models/ReduxModels/ReducerModels';
import dayjs from 'dayjs';

export const toggleRightSidebar = (rightSidebarState: SideBarState) => {
    const val = [true, 'responsive'].includes(rightSidebarState.sidebarShow) ? false : 'responsive';
    return val;
    // dispatch(changeRightSidebarAction(val));
};

export const convertToDateFormat = (found_on: number): string => {
    if (found_on) {
        return dayjs(found_on).format('LL') + ' | ' + dayjs(found_on).format('LT');
    }
    return '';
};

export const converStringToDateFormat = (foundOn: string): string => {
    if (foundOn) {
        const foundOnDate = new Date(foundOn);
        return dayjs(foundOnDate).format('LL') + ' | ' + dayjs(foundOnDate).format('LT');
    }
    return '';
};
export const getInitials = function (string: any) {
    const names = string?.split(' ');
    let initials;
    initials = names[0]?.charAt(0)?.toUpperCase();

    if (names.length > 1) {
        initials += names[names?.length - 1].charAt(0)?.toUpperCase();
    }
    return initials;
};
