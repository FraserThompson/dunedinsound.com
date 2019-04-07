import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import styled from 'styled-components';
import BlogContainer from '../components/BlogContainer';
import Banner from '../components/Banner';
import { rhythm } from '../utils/typography';

const Post = styled.div`
  margin-top: ${rhythm(1)};

  .banner, hr {
    margin-left: -5vw;
    margin-right: -5vw;
  }

  .banner {
    margin-bottom: ${rhythm(1)};
  }

  hr {
    margin-top: ${rhythm(1)};
  }
`

class Blog extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allBlogs.edges

    const postElements = posts.map(({node}) =>
      <Post key={node.fields.slug}>
        <h1><Link to={node.fields.slug}>{node.frontmatter.title}</Link></h1>
        <h4>{node.frontmatter.date}</h4>
        {node.frontmatter.cover && <Link to={node.fields.slug}><Banner height="20vh" backgroundImage={node.frontmatter.cover.childImageSharp.fluid}></Banner></Link>}
        <p>{node.excerpt} <small><Link to={node.fields.slug}>More</Link></small></p>
        <hr/>
      </Post>
    )

    return (
      <Layout location={this.props.location} description={siteDescription} title={`Blog | ${siteTitle}`} overrideBackgroundColor="white">
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
