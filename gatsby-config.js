require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: 'dunedinsound.com',
    author: 'Fraser Thompson',
    description: 'A permanent and non-commercial archive for gigs happening right now in Ōtepoti, Aotearoa.',
    siteUrl: 'https://dunedinsound.com',
  },
  pathPrefix: '/',
  plugins: [
    `gatsby-transformer-yaml`,
    'gatsby-plugin-image',
    'gatsby-plugin-no-sourcemaps',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content`,
        name: 'content',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/media`,
        name: 'media',
        fastHash: true,
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
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
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
        failOn: 'none',
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
      },
    },
  ],
}
