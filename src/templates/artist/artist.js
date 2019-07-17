import React from 'react'
import { graphql } from 'gatsby'
import ContentByEntity from '../contentbyentity/ContentByEntity'

export default React.memo(({ data }) => {
  const parent = {
    title: 'Artists',
    href: '/artists/',
  }

  const pageDescription = `See photos, videos and audio recordings of live gigs featuring ${data.thisPost.frontmatter.title} and heaps of other local artists.`

  return <ContentByEntity pageDescription={pageDescription} parent={parent} data={data} />
})

export const pageQuery = graphql`
  query ArtistsBySlug($slug: String!, $machine_name: String!, $title: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...ArtistFrontmatter
    }
    images: allFile(limit: 1, filter: { extension: { in: ["jpg", "JPG"] }, name: { ne: "cover.jpg" }, fields: { parentDir: { eq: $machine_name } } }) {
      edges {
        node {
          fields {
            parentDir
          }
          ...LargeImage
        }
      }
    }
    gigs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { artists: { elemMatch: { name: { eq: $title } } } } }
    ) {
      group(field: fields___year) {
        fieldValue
        edges {
          node {
            ...GigTileFrontmatter
          }
        }
      }
    }
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { eq: $machine_name } } }
    ) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
    vaultsessions: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "vaultsessions" } }, frontmatter: { artist: { eq: $machine_name } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            cover {
              ...LargeImage
              publicURL
            }
          }
        }
      }
    }
  }
`
