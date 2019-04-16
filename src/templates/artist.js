import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Banner from '../components/Banner';
import Tile from '../components/Tile';
import Divider from '../components/Divider';
import HorizontalNav from '../components/HorizontalNav';
import { theme } from '../utils/theme';
import FlexGridContainer from '../components/FlexGridContainer';

class ArtistTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const gigs = this.props.data.gigs && this.props.data.gigs.edges
    const siteTitle = this.props.data.site.siteMetadata.title

    const artistDescription = "See gigs from " + post.frontmatter.title;

    // sort our filtered posts by year and month
    const postsByDate = gigs.reduce((object, {node}) => {
      const splitDate = node.frontmatter.date.split("-");
      const date = new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0]);
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-GB', { month: 'long' });
      object[year] || (object[year] = {})
      object[year][month] || (object[year][month] = [])
      object[year][month].push(node)
      return object
    }, {})

    const gigTiles = gigs && Object.keys(postsByDate).sort((a, b) => b - a).map(year => {
      return <React.Fragment key={year}>
        <Divider backgroundColor={theme.default.highlightColor2} color="white" sticky>{year}</Divider>
        <FlexGridContainer>
          {Object.keys(postsByDate[year]).sort((a, b) => b - a).map(month => {
            return <React.Fragment key={month}>
                {postsByDate[year][month].map((node) => {
                  const title = node.frontmatter.title || node.fields.slug
                  const coverImage = node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid

                  return (
                    <Tile
                      key={node.fields.slug}
                      title={title}
                      image={coverImage}
                      label={node.frontmatter.date}
                      href={node.fields.slug}
                    />
                  )
                })}
            </React.Fragment>
          })}
        </FlexGridContainer>
      </React.Fragment>
    })

    return (
      <Layout location={this.props.location} description={artistDescription} title={`${post.frontmatter.title} | ${siteTitle}`}>
        <Banner title={post.frontmatter.title} backgroundImage={this.props.data.images && this.props.data.images.edges[0].node.childImageSharp.fluid}>
          <HorizontalNav>
            {post.frontmatter.facebook && <li><a className="button" href={post.frontmatter.facebook}>Facebook</a></li>}
            {post.frontmatter.bandcamp && <li><a className="button" href={post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {post.frontmatter.soundcloud && <li><a className="button" href={post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {post.frontmatter.Website && <li><a className="button" href={post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Divider><p>Gigs</p></Divider>
          {gigTiles}
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
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD-MM-YY")
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
