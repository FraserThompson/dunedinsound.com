import React from 'react'
import { graphql } from 'gatsby'
import ContentByEntityTemplate from './templatetemplates/contentByEntity'


class ArtistTemplate extends ContentByEntityTemplate {

  constructor(props) {
    super(props)

    this.parent = {
      title: "Artists",
      href: "/artists/"
    }

    this.pageDescription = `See photos, videos and audio recordings of live gigs featuring ${this.post.frontmatter.title} and heaps of other local artists.`
  }

}

export default ArtistTemplate

export const pageQuery = graphql`
  query ArtistsBySlug($slug: String!, $machine_name: String!, $title: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...ArtistFrontmatter
    }
    images: allFile(limit: 1, filter: {extension: {in: ["jpg", "JPG"]}, fields: { parentDir: {eq: $machine_name}}}) {
      edges {
        node {
          fields {
            parentDir
          }
          ...LargeImage
        }
      }
    }
    gigs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}, frontmatter: {artists: {elemMatch: {name: {eq: $title}}}}}) {
      group(field:fields___year) {
        fieldValue
        edges {
          node {
            ...GigFrontmatter
          }
        }
      }
    }
    blogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "blog"}}, frontmatter: {tags: {eq: $machine_name}}}) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
  }
`
