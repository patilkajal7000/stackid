import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { AppState } from 'store/store';
import { useSelector } from 'react-redux';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { checkForDiscoveryStatusValue } from 'shared/service/AppService';

export interface IStepperComponent {
    steps: Array<string>;
    activeStep: number;
}
type StepperComponentProps = {
    selectedCloudAccountid: string;
    t: any;
};
const StepperComponent = ({ selectedCloudAccountid, t }: StepperComponentProps) => {
    const [stepperData, setStepperData] = useState<IStepperComponent>();
    const cloudAccounts = useSelector((state: AppState) => state.cloudAccountState.cloudAccounts);
    const selectedCloudAccount = cloudAccounts.find((c: CloudAccountModel) => c.id === selectedCloudAccountid);
    useEffect(() => {
        setStepperData(undefined);
        if (selectedCloudAccount) {
            const stepperData: IStepperComponent = {
                steps: [
                    t('discovering') + ' ' + t('resources'),
                    t('discovering') + ' ' + t('applications'),
                    t('assessment_complete'),
                ],
                activeStep: selectedCloudAccount.discovery_status.isDiscoveryComplete
                    ? 2
                    : checkForDiscoveryStatusValue(selectedCloudAccount.discovery_status),
            };
            setStepperData(stepperData);
        }
    }, [selectedCloudAccountid, cloudAccounts]);

    return (
        <div>
            <div className="font-small-semibold">{selectedCloudAccount?.name}</div>
            <div className="custom-stepper">
                {stepperData && (
                    <Stepper activeStep={stepperData.activeStep} alternativeLabel>
                        {stepperData.steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}
            </div>
        </div>
    );
};

export default StepperComponent;
