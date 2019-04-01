import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Tile from '../components/Tile';
import styled from 'styled-components';
import BlogContainer from '../components/BlogContainer';
import { theme } from '../utils/theme';

const Post = styled.div`

`

class Blog extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allBlogs.edges

    const postElements = posts.map(({node}) =>
      <Post>
        <h1><Link to={node.fields.slug}>{node.frontmatter.title}</Link></h1>
        <p>{node.frontmatter.date}</p>
        <p>{node.excerpt}</p>
      </Post>
    )

    return (
      <Layout location={this.props.location} title={siteTitle} overrideBackgroundColor="white">
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <BlogContainer>
          {postElements}
        </BlogContainer>
      </Layout>
    )
  }
}

export default Blog

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allBlogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "blog"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM YYYY")
            title
            cover {
              childImageSharp {
                fluid(maxWidth: 400) {
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
