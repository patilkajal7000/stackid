import React from 'react';
import { GCPRolePermissions, PermissionDetails } from 'shared/models/IdentityAccessModel';
import { CAccordion, CAccordionCollapse, CAccordionItem } from '@coreui/react';
import dayjs from 'dayjs';

type AccordianProps = {
    data: GCPRolePermissions | undefined;
    isLoading: boolean;
    translate: any;
    selectedPage?: number;
};

const RolePermissions = ({ data, isLoading, translate }: AccordianProps) => {
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
                                    {Object.keys(data[resArn] as unknown as string).map(
                                        (highLevelPermission: string, index: number) => (
                                            <CAccordion key={index} className="custom-accordion mt-2">
                                                <CAccordionItem
                                                    itemKey={'highLevelPermission' + index}
                                                    className="accordion-header"
                                                    onClick={(e) => {
                                                        console.log(e);
                                                    }}
                                                >
                                                    <div className="d-flex w-100 font-small-semibold ">
                                                        <div className="text-uppercase">
                                                            {highLevelPermission}:
                                                            {data[resArn][highLevelPermission].length}
                                                        </div>
                                                        {/* TODO: Check ContextAwareToggle */}
                                                        {/* <ContextAwareToggle
                                                            eventKey={'highLevelPermission' + index}
                                                        ></ContextAwareToggle> */}
                                                    </div>
                                                </CAccordionItem>
                                                {/* TODO: Check CAccordionCollapse eventKey={'highLevelPermission' + index} */}
                                                <CAccordionCollapse>
                                                    <div>
                                                        <table className="table table-borderless custom-table container mt-4">
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
                                                                    (action: PermissionDetails, index: number) => (
                                                                        <tr
                                                                            className="font-small"
                                                                            key={'action' + index}
                                                                        >
                                                                            <td>{action.permission_name}</td>
                                                                            <td>
                                                                                {' '}
                                                                                {action.last_used_on &&
                                                                                action.last_used_on > -1 ? (
                                                                                    <div>
                                                                                        <div>
                                                                                            {dayjs(
                                                                                                action?.last_used_on,
                                                                                            ).format('hh:mm A')}
                                                                                        </div>
                                                                                        <div>
                                                                                            {dayjs(
                                                                                                action?.last_used_on,
                                                                                            ).format('MMMM DD, YYYY')}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div> - </div>
                                                                                )}
                                                                            </td>
                                                                            <td>{action.last_used_by} </td>
                                                                        </tr>
                                                                    ),
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CAccordionCollapse>
                                            </CAccordion>
                                        ),
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default React.memo(RolePermissions);
