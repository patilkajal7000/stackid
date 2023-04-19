import React, { memo, useCallback, useRef, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilCopy } from '@coreui/icons';

type JsonViewerProps = {
    data: any;
    dispalyViewMoreLink?: boolean;
};

const JsonViewer = memo(({ data, dispalyViewMoreLink = false }: JsonViewerProps) => {
    const txtarea = useRef<any>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const toggledClass = isExpanded ? 'expanded' : 'collapsed';

    const copyToClipboard = useCallback(() => {
        if (txtarea && txtarea.current) {
            navigator.clipboard.writeText(txtarea.current.innerText);
        }
    }, [txtarea]);

    return (
        <>
            <div className="custom-json-viewer">
                <div className="w-100">
                    <pre ref={txtarea} className={`content ${toggledClass}`}>
                        {JSON.stringify(data ? data : {}, null, 4)}
                    </pre>
                </div>
                <div title="Copy">
                    {' '}
                    <CIcon icon={cilCopy} className="copy-btn" onClick={copyToClipboard} />
                </div>
            </div>
            {dispalyViewMoreLink && (
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-custom btn-link flex flex-right"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                    </button>
                </div>
            )}
        </>
    );
});

export default JsonViewer;
