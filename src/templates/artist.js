import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'

import Layout from '../components/Layout'
import Banner from '../components/Banner';
import Tile from '../components/Tile';
import Divider from '../components/Divider';
import GridContainer from '../components/GridContainer';

class ArtistTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const gigs = this.props.data.gigs && this.props.data.gigs.edges
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext

    console.log(this.props.data.gigs);

    const gigTiles = gigs && gigs.map(({ node }) => {
      const title = node.frontmatter.title || node.fields.slug
      const coverImage = node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid

      return (
        <Tile
          key={node.fields.slug}
          title={title}
          image={coverImage}
          label={node.frontmatter.date}
          href={node.fields.slug}
          height={"40vh"}
        />
      )
    });

    return (
      <Layout location={this.props.location} description={siteDescription} title={`${post.frontmatter.title} | ${siteTitle}`}>
        <Banner title={post.frontmatter.title} height="40vh" backgroundImage={this.props.data.images && this.props.data.images.edges[0].node.childImageSharp.fluid}>
          {post.frontmatter.bandcamp && <a href={post.frontmatter.bandcamp}>Bandcamp</a>}
          {post.frontmatter.facebook && <a href={post.frontmatter.facebook}>Facebook</a>}
          {post.frontmatter.soundcloud && <a href={post.frontmatter.soundcloud}>Soundcloud</a>}
          {post.frontmatter.website && <a href={post.frontmatter.website}>Website</a>}
        </Banner>
        <Divider>
          <p>Gigs</p>
        </Divider>
        <GridContainer xs="6" sm="4" md="3" lg="2">
          {gigTiles}
        </GridContainer>
      </Layout>
    )
  }
}

export default ArtistTemplate

export const pageQuery = graphql`
  query ArtistsBySlug($slug: String!, $machine_name: String!, $title: String!) {
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
        soundcloud
        website
      }
    }
    images: allFile( filter: {extension: {in: ["jpg", "JPG"]}, fields: { artist: {eq: $machine_name}}}) {
      edges {
        node {
          fields {
            artist
          }
          childImageSharp {
            fluid(maxWidth: 1600) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    gigs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}, frontmatter: {artists: {elemMatch: {name: {eq: $title}}}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM YYYY")
            venue
            artists { name, vid {link, title} }
            title
            cover {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
