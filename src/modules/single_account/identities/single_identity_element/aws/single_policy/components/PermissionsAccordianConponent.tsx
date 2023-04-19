import React from 'react';
import { Permissions } from 'shared/models/IdentityAccessModel';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem } from '@coreui/react';

type AccordianProps = {
    data: Permissions | undefined;
    isLoading: boolean;
    translate: any;
    selectedPage?: number;
};

const PermissionsAccordianConponent = ({ data, isLoading, translate }: AccordianProps) => {
    /*
    const ContextAwareToggle = (keyObj: { eventKey: string }, callback: (arg0: string) => string) => {
        const currentEventKey = useContext(AccordionContext);

        const eventKey = keyObj.eventKey;

        const isCurrentEventKey = currentEventKey === eventKey;

        return (
            <div className="ms-auto">
                {isCurrentEventKey ? <Remove className="toggle-icon" /> : <Add className="toggle-icon" />}
            </div>
        );
    };
    */
    return (
        <>
            {isLoading ? (
                <div> Loading ...</div>
            ) : (
                <>
                    {data && (
                        <>
                            {Object.keys(data).map((resArn: string, index: number) => (
                                <div className="mt-3" key={index}>
                                    <div className="font-small-semibold mb-2">
                                        {index + 1}. {resArn}
                                    </div>
                                    <CAccordion className="">
                                        {Object.keys(data[resArn] as unknown as string).map(
                                            (highLevelPermission: string, index: number) => (
                                                <CAccordionItem key={index} className="custom-accordion mt-2">
                                                    <CAccordionHeader
                                                        className="accordion-header p-0"
                                                        onClick={(e) => {
                                                            console.log(e);
                                                        }}
                                                    >
                                                        <div className="d-flex w-100 font-small-semibold ">
                                                            <div className="text-uppercase">
                                                                {' '}
                                                                {highLevelPermission}:{' '}
                                                                {data[resArn][highLevelPermission].length}{' '}
                                                            </div>
                                                        </div>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <div>
                                                            <table className="table table-borderless custom-table container mt-2">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="w-60">
                                                                            {' '}
                                                                            {translate('permission_name')}{' '}
                                                                        </th>
                                                                        <th> {translate('last_used_on')} </th>
                                                                        <th> {translate('last_used_by')} </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[resArn][highLevelPermission].map(
                                                                        (action: string, index: number) => (
                                                                            <tr
                                                                                className="font-small"
                                                                                key={'action' + index}
                                                                            >
                                                                                <td>
                                                                                    {action == '*' ? (
                                                                                        <b className="text-black">
                                                                                            {action}
                                                                                        </b>
                                                                                    ) : (
                                                                                        action
                                                                                    )}
                                                                                </td>
                                                                                <td> - </td>
                                                                                <td> - </td>
                                                                            </tr>
                                                                        ),
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </CAccordionBody>
                                                </CAccordionItem>
                                            ),
                                        )}
                                    </CAccordion>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default React.memo(PermissionsAccordianConponent);
