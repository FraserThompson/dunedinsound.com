require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: 'dunedinsound.com',
    author: 'Fraser Thompson',
    description:
      "Documenting and archiving the Dunedin music scene since 2014. See and hear photos, video, and full set audio from gigs happening right now in Ōtepoti. Relive memories or discover what you've been missing.",
    siteUrl: 'https://dunedinsound.com',
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-plugin-image',
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
        path: `${__dirname}/src/content/vaultsessions`,
        name: 'vaultsessions',
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
              maxWidth: 1920,
              showCaptions: true,
              quality: 80,
              withWebp: true,
              srcSetBreakpoints: [960, 1920, 2880, 3840], // I don't know why it needs this, but it does
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-plugin-emotion`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: true, // leaving the metadata increases filesize by about 40kb
        failOnError: false,
        defaultQuality: 80,
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
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
        omitGoogleFont: true,
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'dunedinsound.com',
        protocol: 'https',
        hostname: 'dunedinsound.com',
        partSize: '500',
        parallelLimit: '3',
      },
    },
  ],
}
