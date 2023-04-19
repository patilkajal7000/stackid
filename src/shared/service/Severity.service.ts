import { SeverityScore, SeverityType } from '../models/RHSModel';
const BPICOLORS = {
    Critical: '#ff647c',
    High: '#ff9251',
    Medium: '#f2be42',
    Low: '#089b71',
    Zero: '#089b71',
};

export const getSeverityColor = (severityName: SeverityType) => {
    switch (severityName) {
        case SeverityType.CRITICAL:
            return 'Critical';
        case SeverityType.HIGH:
            return 'High';
        case SeverityType.ZERO:
            return 'Zero';
        case SeverityType.MEDIUM:
            return 'Medium';
        case SeverityType.LOW:
            return 'Low';
        default:
            return 'Low';
    }
};

export const getActualSeverityColor = (severityName: any) => {
    switch (severityName) {
        case SeverityType.CRITICAL:
            return BPICOLORS['Critical'];
        case SeverityType.HIGH:
            return BPICOLORS['High'];
        case SeverityType.ZERO:
            return BPICOLORS['Zero'];
        case SeverityType.MEDIUM:
            return BPICOLORS['Medium'];
        case SeverityType.LOW:
            return BPICOLORS['Low'];
        default:
            return BPICOLORS['Low'];
    }
};
export const getSeverityScoreColor = (severityNumber: number) => {
    if (severityNumber >= SeverityScore.ZEROMIN && severityNumber <= SeverityScore.ZEROMAX) {
        return 'Low';
    }
    if (severityNumber >= SeverityScore.LOWMIN && severityNumber <= SeverityScore.LOWMAX) {
        return 'Low';
    }
    if (severityNumber === SeverityScore.ZEROMIN) {
        return 'Low';
    }
    if (severityNumber >= SeverityScore.MEDIUMMIN && severityNumber <= SeverityScore.MEDIUMMAX) {
        return 'Medium';
    }
    if (severityNumber >= SeverityScore.CRITICALMIN && severityNumber <= SeverityScore.CRITICALMAX) {
        return 'Critical';
    }
    if (severityNumber >= SeverityScore.HIGHMIN && severityNumber <= SeverityScore.HIGHMAX) {
        return 'High';
    }
    return 'Low';
};

export const getSeverityBpiScore = (severityName: SeverityType) => {
    switch (severityName) {
        case SeverityType.CRITICAL:
            return 'BPI (>=90%)';
        case SeverityType.HIGH:
            return 'BPI (>=75%)';
        case SeverityType.MEDIUM:
            return 'BPI (>=50%)';
        case SeverityType.ZERO:
            return '';
        case SeverityType.LOW:
            return 'BPI (<50%)';
        default:
            return 'Low';
    }
};
export const getSeverityBpiScoreNumber = (severityName: SeverityType) => {
    switch (severityName) {
        case SeverityType.CRITICAL:
            return 90;
        case SeverityType.HIGH:
            return 75;
        case SeverityType.MEDIUM:
            return 50;
        case SeverityType.ZERO:
            return 0;
        case SeverityType.LOW:
            return 20;
        default:
            return 0;
    }
};

export const getBpiScoreSeverity = (bpiScore: number) => {
    if (bpiScore > SeverityScore.HIGHMAX) {
        return SeverityType.CRITICAL;
    } else if (bpiScore >= SeverityScore.HIGHMIN && bpiScore <= SeverityScore.HIGHMAX) {
        return SeverityType.HIGH;
    } else if (bpiScore >= SeverityScore.MEDIUMMIN && bpiScore <= SeverityScore.MEDIUMMAX) {
        return SeverityType.MEDIUM;
    } else if (bpiScore < SeverityScore.MEDIUMMIN) {
        return SeverityType.LOW;
    } else {
        return SeverityType.LOW;
    }
};
