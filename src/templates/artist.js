import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'

import Layout from '../components/Layout'

class ArtistTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext

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
              <Link to="/artists">
                <div className="col-xs-12 divider link purple hidden-xs">
                  <h5>Back to artists</h5>
                </div>
              </Link>
              <div className="banner"></div>
              <div className="text" style={{marginTop: "-60px"}}>
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
      </Layout>
    )
  }
}

export default ArtistTemplate

export const pageQuery = graphql`
  query ArtistsBySlug($slug: String!) {
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
        bandcamp
        facebook
      }
    }
    # images: allFile(filter: { relativePath: { regex: $artistImagesRegex } }) {
    #   group(field: relativeDirectory) {
    #     fieldValue
    #     edges {
    #       node {
    #         name
    #         absolutePath
    #         relativeDirectory
    #         publicURL
    #         childImageSharp {
    #           fluid(maxWidth: 800) {
    #             ...GatsbyImageSharpFluid_withWebp
    #           }
    #         }
    #       }
    #     }
    #   }
    # }
  }
`
