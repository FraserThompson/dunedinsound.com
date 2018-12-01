import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'

import Layout from '../components/Layout'

class GigTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext

    const imagesByArtist = this.props.data.images['group'].map((imageGroup, index) => {
      const artistName = imageGroup.fieldValue.match(/([^\\]*)\\*$/)[1]
      const images = imageGroup.edges.map((image, index) => <Img key={index} fluid={image.node.childImageSharp.fluid} />)
      return (<div key={index}><h1>{artistName}</h1>{images}</div>)
    })

    const playlist = post.frontmatter.media.map((artist, index) => {
      return (
        <li key={index}>
          <a>{artist.name}</a>
        </li>
      )
    })

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <Link to="/gigs">Back to gigs</Link>
        <h1>{post.frontmatter.title}</h1>
        <ul>{playlist}</ul>
        {imagesByArtist}
      </Layout>
    )
  }
}

export default GigTemplate

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $gigRegex: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        venue
        media { name, mp3 { title}, vid {link, title} }
      }
    }
    images: allFile(filter: { relativePath: { regex: $gigRegex } }) { 
      group(field: relativeDirectory) {
        fieldValue
        edges {
          node {
            name
            absolutePath
            relativeDirectory
            publicURL
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`
