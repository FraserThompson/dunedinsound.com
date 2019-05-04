import React from 'react'
import styled from '@emotion/styled'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../components/Layout'
import { rhythm, scale } from '../utils/typography'
import BlogContainer from '../components/BlogContainer';
import Banner from '../components/Banner';
import GridContainer from '../components/GridContainer';

const BlogPostNav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
`

class BlogPostTemplate extends React.Component {
  render() {

    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt ? post.excerpt : this.props.data.site.siteMetadata.description
    const { previous, next } = this.props.pageContext

    const imageElements = this.props.data.images && this.props.data.images['edges'].map(({node}) => {
      return <a href={node.publicURL} style={{cursor: "pointer"}} key={node.name}>
        <Img className="backgroundImage" fluid={node.childImageSharp.fluid} />
      </a>
    })

    return (
      <Layout location={this.props.location} description={siteDescription} title={`${post.frontmatter.title} | ${siteTitle}`} overrideBackgroundColor="white">
        {post.frontmatter.cover && <Banner backgroundImage={post.frontmatter.cover}></Banner>}
        <BlogContainer>
          <h1>{post.frontmatter.title}</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
            }}
          >
            {post.frontmatter.date}
          </p>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </BlogContainer>
        {post.frontmatter.gallery &&
          <GridContainer>
            {imageElements}
          </GridContainer>
        }
        <BlogContainer>
          <hr style={{marginBottom: rhythm(1)}}/>
          <BlogPostNav>
            <li>
              {
                previous &&
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              }
            </li>
            <li>
              {
                next &&
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              }
            </li>
          </BlogPostNav>
        </BlogContainer>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $parentDir: String!) {
    site {
      ...SiteInformation
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
    images: allFile( filter: { extension: { in: ["jpg", "JPG"]}, fields: { parentDir: {eq: $parentDir}}}) {
      edges {
        node {
          name
          publicURL
          ...LargeImage
        }
      }
    }
  }
`
