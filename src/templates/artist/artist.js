import React from 'react'
import { graphql } from 'gatsby'
import ContentByEntity from '../contentbyentity/ContentByEntity'
import { SiteHead } from '../../components/SiteHead'

const Page = React.memo(({ data }) => {
  const parent = {
    title: 'Artists',
    href: '/artists/',
  }

  return <ContentByEntity parent={parent} data={data} />
})

export const Head = (params) => {
  const cover = params.data.images && params.data.images.nodes.length !== 0 && params.data.images.nodes[0]
  const title = `${params.data.thisPost.frontmatter.title} | ${params.data.site.siteMetadata.title}`

  return (
    <SiteHead
      title={title}
      description={`See photos, videos and audio recordings of live gigs featuring ${params.data.thisPost.frontmatter.title} and heaps of other local artists.`}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query ArtistsBySlug($slug: String!, $machine_name: String!, $title: String!) {
    site {
      ...SiteInformation
    }
    thisPost: mdx(fields: { slug: { eq: $slug } }) {
      ...ArtistFrontmatter
    }
    images: allFile(limit: 1, filter: { extension: { in: ["jpg", "JPG"] }, name: { ne: "cover.jpg" }, fields: { parentDir: { eq: $machine_name } } }) {
      nodes {
        fields {
          parentDir
        }
        ...LargeImage
      }
    }
    gigs: allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { artists: { elemMatch: { name: { eq: $title } } } } }
    ) {
      group(field: { fields: { year: SELECT } }) {
        fieldValue
        nodes {
          ...GigTileFrontmatter
        }
      }
    }
    blogs: allMdx(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { eq: $title } } }) {
      nodes {
        ...BlogFrontmatter
      }
    }
    vaultsessions: allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { type: { eq: "vaultsessions" } }, frontmatter: { artist: { eq: $machine_name } } }
    ) {
      nodes {
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
`

export default Page
