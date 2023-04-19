import { SEVERITY_NAME } from 'shared/utils/Constants';
import { ResourcesSeverity } from './DataEndpointSummaryModel';
import { RiskCardModel } from './RiskModel';

export interface RHSModel {
    risks?: RiskCardModel[];
}

export interface BodyDetail {
    title: string;
    severity?: SeverityType;
    count?: number;
    category?: string;
    body?: Record<typeof SEVERITY_NAME, ResourcesSeverity[]>;
    showCount: boolean;
}

export interface ProgresBar {
    severity: string;
    value: number;
}

export interface ViewDetail {
    id: number;
    name: string;
}

export enum SeverityType {
    CRITICAL = 'Critical',
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    ZERO = 'Zero',
}

export enum SeverityScore {
    ZEROMIN = 0,
    ZEROMAX = 0,
    LOWMIN = 1,
    LOWMAX = 49,
    MEDIUMMIN = 50,
    MEDIUMMAX = 74,
    HIGHMIN = 75,
    HIGHMAX = 89,
    CRITICALMIN = 90,
    CRITICALMAX = 100,
}
