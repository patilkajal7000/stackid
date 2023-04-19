import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import CIcon from '@coreui/icons-react';
import { cilChevronLeft, cilChevronRight } from '@coreui/icons';

const Pagination = (props: {
    onPageChange: any;
    totalCount: any;
    siblingCount: 1 | undefined;
    currentPage: any;
    pageSize: any;
    className: any;
}) => {
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });

    if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    const lastPage = Math.ceil(paginationRange ? totalCount / pageSize - 1 : 0);

    return (
        <ul className={classnames('pagination-container', { [className]: className })}>
            <li
                className={classnames('pagination-item', { disabled: currentPage === 1 })}
                onClick={onPrevious}
                role="presentation"
            >
                <div className="arrow left" />
                <CIcon icon={cilChevronLeft} />
            </li>
            {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return (
                        <li key={'pagination' + index} className="pagination-item dots">
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li
                        role="presentation"
                        key={'pagination' + index}
                        className={classnames('pagination-item', { selected: pageNumber === currentPage })}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={classnames('pagination-item', { disabled: currentPage - 1 === lastPage })}
                onClick={onNext}
                role="presentation"
            >
                <div className="arrow right" /> <CIcon icon={cilChevronRight} />
            </li>
        </ul>
    );
};

export default Pagination;
