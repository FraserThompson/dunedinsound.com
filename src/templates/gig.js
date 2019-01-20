import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'

import Layout from '../components/Layout'

class GigTemplate extends React.Component {
  render() {

    const ImageGridContainer = styled.div`
      display: grid;
      grid-template-columns: repeat(12, 1fr);
    `
    const { previous, next } = this.props.pageContext

    const post = this.props.data.thisPost
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    
    // Turn the data returned from the artist query into a key-value object of frontmatter
    const artists = this.props.data.artists['group'].reduce((obj, item) => {
      const machineName = item.edges[0].node.fields.machine_name
      const frontmatter = item.edges[0].node.frontmatter
      obj[machineName] = frontmatter
      return obj;
    }, {})

    const imagesByArtist = this.props.data.images['group'].map((imageGroup, index) => {

      const artistMachineName = imageGroup.fieldValue.match(/([^\\]*)\\*$/)[1]
      const artistDetails = artists[artistMachineName]

      const images = imageGroup.edges.map((image, index) => <Img key={index} fluid={image.node.childImageSharp.fluid} />)

      return (
      <div key={index}>
        <h1>{artistDetails.title}</h1>
        <ImageGridContainer>
          {images}
        </ImageGridContainer>
      </div>)
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
        <header>
          <div className="container-fluid">
            <div className="post-header row">
              <Link to="/gigs">
                <div className="col-xs-12 divider link purple hidden-xs">
                  <h5>Back to gigs</h5>
                </div>
              </Link>
              <span className="label label-default">LATEST GIG</span>
              <div className="banner"></div>
              <div className="text" style={{marginTop: "-60px"}}>
                <ul>{playlist}</ul>
              </div>
              <div className="gig-nav hidden-xs"></div>
            </div>
          </div>
          <div className="container-fluid header sticky gig-header" style={{overflow: "visible"}} data-scroll-header>
            <div className="row">
              <div className="col-xs-12 col-sm-1 gig-title-wrapper">
                <h1>{post.frontmatter.title}</h1>
              </div>
              <div className="col-xs-12 col-sm-10 gig-player-wrapper"></div>
              <div className="gig dropdown"></div>
            </div>
          </div>
        </header>
        {imagesByArtist}
      </Layout>
    )
  }
}

export default GigTemplate

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $gigImagesRegex: String!, $artists: [String]! ) {
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
    images: allFile(filter: { relativePath: { regex: $gigImagesRegex } }) { 
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
    artists: allMarkdownRemark(filter: { fields: { machine_name: { in: $artists }, type: { eq: "artists" } } } ) {
      group(field: fields___machine_name) {
        edges {
          node {
            fields {
              machine_name
            }
            frontmatter {
              title
              bandcamp
              facebook
            }
          }
        }
      }
    }
  }
`
