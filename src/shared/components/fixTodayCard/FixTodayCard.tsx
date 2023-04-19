import { CCard, CCardBody, CCardFooter } from '@coreui/react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { FixTodayCard } from 'shared/models/GenericModel';
import CIcon from '@coreui/icons-react';
import { cilChevronRight } from '@coreui/icons';

type FixTodayCardProps = {
    data: FixTodayCard[];
    onClickView: (selectedCardId: string) => void;
    translate: any;
    isLoading: boolean;
};

const FixTodayCards = ({ data, onClickView, translate, isLoading }: FixTodayCardProps) => {
    return (
        <div className="container-fluid mx-0">
            {isLoading ? (
                <div className="d-flex justify-content-between container">
                    <Skeleton width={350} height={100} />
                    <Skeleton width={350} height={100} />
                    <Skeleton width={350} height={100} />
                </div>
            ) : (
                <div className="d-flex align-content-around  container">
                    {data.map((card: FixTodayCard) => (
                        <CCard className="custom-card long-details-card mx-1 p-2" key={card.id}>
                            <CCardBody className="card-body-details px-2 py-3">
                                <div className="justify-content-start text-danger-dark ">
                                    <em className="icon icon-alert-danger icon-danger font-16 me-1" />
                                </div>
                                <div className="overflow-hidden ms-2">
                                    <div title={card.title} className="card-title font-medium-semibold overflow-hidden">
                                        {card.title}
                                    </div>
                                </div>
                            </CCardBody>
                            <CCardFooter className="p-0">
                                <button
                                    title={translate('view_details')}
                                    type="button"
                                    className="btn-custom btn btn-link float-end"
                                    onClick={() => onClickView(card.id)}
                                >
                                    {translate('view_details')}
                                    <CIcon icon={cilChevronRight} className="mx-2" size="sm" />
                                </button>
                            </CCardFooter>
                        </CCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(FixTodayCards);
