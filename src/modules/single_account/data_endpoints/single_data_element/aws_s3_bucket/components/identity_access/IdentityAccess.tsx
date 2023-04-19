import React, { FC, useEffect, useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import {
    IdentityAccessModel,
    LevelOfAccess,
    LevelOfAccessView,
    LevelOfAccessSortOrder,
} from 'shared/models/IdentityAccessModel';
import { getMapOfUniqueKeysAndValues, sortObjectByGivenOrder } from 'shared/service/AppService';
import './IdentityAccess.scss';

type IdentityAccessProps = {
    identities: IdentityAccessModel[];
};

const IdentityAccess = (props: IdentityAccessProps) => {
    const [identityAccessMap, setIdentityAccessMap] = useState<
        Record<LevelOfAccess, IdentityAccessModel[]> | undefined
    >();
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [popupData, setPopupData] = useState<any>(null);
    const ref = useRef(null);
    useEffect(() => {
        const uniqueLevelOfAccess: Record<LevelOfAccess, IdentityAccessModel[]> = getMapOfUniqueKeysAndValues(
            props.identities,
            'level_of_access',
        );
        setIdentityAccessMap(sortObjectByGivenOrder(uniqueLevelOfAccess, LevelOfAccessSortOrder));
    }, []);
    return (
        <div className="card m-0 p-0 border-0">
            <div className="card-body p-1 align-items-center">
                <div className={'w-100 text-center'}>
                    <div className="text-truncate text-muted">IDENTITIES</div>
                </div>
            </div>
            <div className="card-body d-flex flex-column p-1">
                {identityAccessMap &&
                    Object.keys(identityAccessMap).map((element: any, index: number) => (
                        <div
                            role="presentation"
                            id={element}
                            key={index}
                            className="d-flex justify-content-between pb-2 pt-2"
                            onClick={(e: any) => {
                                setShow(true);
                                setTarget(e.target);
                                setPopupData(identityAccessMap);
                            }}
                        >
                            <span className="text-start font-weight-bold ">{LevelOfAccessView[element]}</span>
                            <span>{identityAccessMap[element as LevelOfAccess]?.length}</span>
                        </div>
                    ))}
            </div>
            <div ref={ref}>
                <LinkPopover
                    show={show}
                    target={target}
                    container={ref.current}
                    setShowRef={setShow}
                    data={popupData}
                />
            </div>
        </div>
    );
};

export default IdentityAccess;

type LinkPopupProps = {
    show: boolean;
    target: any;
    container: any;
    setShowRef: any;
    data: any;
};

const LinkPopover: FC<LinkPopupProps> = ({ show, target, container, setShowRef, data }: LinkPopupProps) => {
    return (
        <React.Fragment>
            <Overlay
                show={show}
                target={target}
                placement="left"
                container={container}
                rootClose
                onHide={(e) => {
                    if (e.target != target) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        setShowRef(false);
                    }
                }}
            >
                <Popover id="popover-container" className="custom-popup">
                    {data &&
                        Object.keys(data).map((a: any, index: number) => (
                            <div key={index} className="p-1">
                                <div className="card-header h4"> {LevelOfAccessView[a]}</div>
                                <ul className="mt-1">
                                    {data[a].map((b: any, index: number) => (
                                        <li key={index + b.who_details.identity_id} className="h6">
                                            {b.who_details.identity_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </Popover>
            </Overlay>
        </React.Fragment>
    );
};
