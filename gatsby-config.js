require('dotenv').config({
    path: '.env',
});

module.exports = {
    siteMetadata: {
        title: 'new',
        siteUrl: 'https://www.yourdomain.tld',
    },
    plugins: [
        {
            resolve: 'gatsby-source-contentful',
            options: {
                spaceId: process.env.CTF_SPACE_ID,
                accessToken: process.env.CTF_CDA_ACCESS_TOKEN_DELIVERY,
            },
        },
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                additionalData: '@import "./src/assets/styles/resources";',
            },
        },
        // {
        //   resolve: 'gatsby-plugin-google-analytics',
        //   options: {
        //     "trackingId": ""
        //   }
        // },
        'gatsby-plugin-image',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                'icon': './src/assets/favicons/green-320x320.png',
            },
        },
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                'name': 'images',
                'path': './src/images/',
            },
            __key: 'images',
        },
        {
            resolve: 'gatsby-plugin-alias-imports',
            options: {
                alias: {
                    '@': 'src',
                },
                extensions: [],
            },
        },
        'gatsby-plugin-layout',
        {
            resolve: 'gatsby-plugin-compile-es6-packages',
            options: {
                modules: ['three'],
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/locales`,
                name: 'locale',
            },
        },
        {
            resolve: 'gatsby-plugin-react-i18next',
            options: {
                localeJsonSourceName: 'locale',
                languages: ['en-US', 'ar'],
                defaultLanguage: 'en-US',
                i18nextOptions: {
                    interpolation: {
                        escapeValue: false,
                    },
                    keySeparator: false,
                    nsSeparator: false,
                },
            },
        },
    ],
};
