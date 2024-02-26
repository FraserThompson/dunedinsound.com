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
  return (
    <SiteHead
      title={params.data.thisPost.title}
      description={`Discover photos, videos and audio recordings of live gigs featuring ${params.data.thisPost.title} and heaps of other local artists.`}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query Artist($slug: String!, $fileName: String!, $title: String!) {
    thisPost: artistYaml(fields: { slug: { eq: $slug } }) {
      ...ArtistFrontmatter
    }
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "media" }
        extension: { in: ["jpg", "JPG"] }
        name: { ne: "cover.jpg" }
        fields: { mediaDir: { eq: "gig" }, parentDir: { eq: $fileName } }
      }
    ) {
      nodes {
        ...LargeImage
        fields {
          gigDir
        }
      }
    }
    gigs: allGigYaml(sort: { date: DESC }, filter: { artists: { elemMatch: { name: { eq: $title } } } }) {
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
    vaultsessions: allVaultsessionYaml(sort: { date: DESC }, filter: { artist: { eq: $fileName } }) {
      nodes {
        ...VaultsessionFrontmatter
      }
    }
  }
`

export default Page
