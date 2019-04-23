import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import BlogContainer from '../components/BlogContainer';

class PageTemplate extends React.Component {
  render() {

    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt ? post.excerpt : this.props.data.site.siteMetadata.description

    return (
      <Layout location={this.props.location} description={siteDescription} title={`${post.frontmatter.title} | ${siteTitle}`} overrideBackgroundColor="white">
        <BlogContainer>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </BlogContainer>
      </Layout>
    )
  }
}

export default PageTemplate

export const pageQuery = graphql`
  query PagePostBySlug($slug: String!) {
    site {
      ...SiteInformation
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
  }
`
