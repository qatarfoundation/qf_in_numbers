// React
import { useEffect, useState } from 'react';

// API
import getPagesData from '@/utils/api/getPagesData';

function useTemplateData(props) {
    const [data, setData] = useState(props);

    useEffect(() => {
        if (process.env.GATSBY_CTF_PREVIEW) {
            getPagesData().then((pages) => {
                // Find matching data
                const { originalPath } = props.i18n;

                let page = null;

                for (let i = 0; i < pages.length; i++) {
                    if (originalPath === `/${pages[i].path}`) {
                        page = pages[i];
                    }
                }

                if (page) {
                    const clonedProps = { ...props };
                    Object.assign(clonedProps, page.context);
                    setData(clonedProps);
                }
            });
        }
    }, []);

    return data;
}

export default useTemplateData;