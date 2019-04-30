module.exports = {
  siteMetadata: {
    title: 'dunedinsound.com',
    author: 'Fraser Thompson',
    description: 'Documenting and archiving the Dunedin music scene since 2014.',
    siteUrl: 'https://dunedinsound.com',
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content/gigs`,
        name: 'gigs',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content/blog`,
        name: 'blog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content/artists`,
        name: 'artists',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content/venues`,
        name: 'venues',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content/page`,
        name: 'page',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets`,
        name: 'assets',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 740,
              showCaptions: true
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-plugin-styled-components`,
    'gatsby-plugin-react-leaflet',
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: false,
        concurrency: 4
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-75343662-1`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `dunedinsound.com`,
        short_name: `dunedinsound.com`,
        start_url: `/`,
        background_color: `#0C1214`,
        theme_color: `#0C1821`,
        display: `minimal-ui`,
        icon: `src/assets/site-icon.jpg`,
      },
    },
    'gatsby-plugin-remove-serviceworker',
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
        omitGoogleFont: true
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
          bucketName: 'dunedinsound.com',
          protocol: "https",
          hostname: "dunedinsound.com",
      },
  },
  ],
}
