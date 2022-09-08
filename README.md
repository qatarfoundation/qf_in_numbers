# QF In Numbers

## Environments

| Name               | URL                                                              |
| ------------------ | ---------------------------------------------------------------- |
| **Staging Dev**    | [qf-2022.dev.60fps.fr](https://qf-2022.dev.60fps.fr)             |
| **Staging Client** | [qf-in-numbers.netlify.app](https://qf-in-numbers.netlify.app/)  |
| **Production**     | Coming Soon                                                      |

## 🚀 Quick start

### Create a Gatsby site

Use the Gatsby CLI to create a new site, specifying the minimal starter.

```shell
# create a new Gatsby site using the minimal starter
npm init gatsby
```

### Start developing

You will need to create a .env file, you can check the .env.exemple and reach out to the team to get all the tokens.

Navigate into your new site’s directory and start it up.

```shell
cd my-gatsby-site/
npm run develop
```

### Open the code and start customizing

Your site is now running at http://localhost:8000

Edit `src/pages/index.js` to see your site update in real-time

### Learn more

[Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

[Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

[Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

[API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

[Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

[Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

## Backend

This project is using [Contentful](https://app.contentful.com/).

We currently have two spaces open for this project, one on Immersive Garden side and one on the client side. We use the IG contentful as a test environment.

### Preview

As the backend structure is quite complexe, we need a working preview feature.
You can see the preview settings in contentful under Settings > Content Preview.

For now we're using the Staging Dev environment as a preview but we will need to migrate to the client staging at the end of the project.
To do so just update the staging url in Settings > Content Preview.

Note that in frontend, the preview feature is only available with the **GATSBY_CTF_PREVIEW** environment variable set to **true**.

## Deploy Guide

All environment are using netlify
