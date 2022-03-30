module.exports = {
    siteMetadata: {
        title: 'new',
        siteUrl: 'https://www.yourdomain.tld',
    },
    plugins: [
        // {
        //   resolve: 'gatsby-source-contentful',
        //   options: {
        //     "accessToken": "dv-84QhmtpDlI1CGNT18z5zo5bqbCwOR_cjfX7yTX6g",
        //     "spaceId": "y9dmurrpfk8p"
        //   }
        // },
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
                'icon': 'src/images/icon.png',
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
    ],
};
