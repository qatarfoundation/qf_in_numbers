// React
import { useEffect, useState } from 'react';

// API
import getPagesData from '@/utils/api/getPagesData';

function useTemplateData(props) {
    const [data, setData] = useState(props);

    useEffect(() => {
        const isPreview = process.env.GATSBY_CTF_PREVIEW === 'true';
        if (isPreview) {
            getPagesData().then((pages) => {
                // Find matching data
                const { originalPath } = props.i18n;

                let page = null;

                for (let i = 0; i < pages.length; i++) {
                    const path = `${ pages[i].path }`;
                    if (originalPath === path) {
                        page = pages[i];
                    }
                }

                if (page) {
                    setData(page.context);
                }
            });
        }
    }, []);

    return data;
}

export default useTemplateData;
