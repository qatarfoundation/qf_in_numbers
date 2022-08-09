// React
import React from 'react';

// Vendor
import { INLINES, HYPERLINK } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

// CSS
import './style.scoped.scss';

function RichText(props, ref) {
    const options = {
        renderNode: {
            [INLINES.HYPERLINK]: (node, next) => {
                let el = '';
                if (node.data.uri.includes('@')) {
                    el = `<a href="mailto:${ node.data.uri }">${ next(node.content) }</a>`;
                } else {
                    el = `<a href="${ node.data.uri }" target="_blank" rel="noopener">${ next(node.content) }</a>`;
                }
                return el;
            },
        },
    };

    return (
        <div className="rich-text" dangerouslySetInnerHTML={ { __html: documentToHtmlString(JSON.parse(props.data.raw), options) } }>
        </div>
    );
}

export default RichText;
