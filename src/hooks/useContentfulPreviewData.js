// Vendor
const contentfulDelivery = require('contentful');

// React
import { useEffect, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

const configDelivery = {
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN_DELIVERY_PREVIEW,
    host: 'preview.contentful.com',
};

const clientDelivery = contentfulDelivery.createClient(configDelivery);

function useContentfulPreviewData(content_type, targetYear) {
    const [data, setData] = useState(null);

    const { language } = useI18next();

    useEffect(() => {
        clientDelivery.getEntries({
            locale: language,
            content_type,
            include: 10,
        }).then((response) => {
            const years = response.items;

            const year = years.filter((item) => {
                return item.fields.year === targetYear;
            })[0];

            setData(year.fields);
        });
    }, []);

    return data;
}

export default useContentfulPreviewData;
