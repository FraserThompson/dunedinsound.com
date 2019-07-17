import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import BlogContainer from '../../components/BlogContainer'

export default React.memo(({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const siteDescription = post.excerpt ? post.excerpt : data.site.siteMetadata.description

  return (
    <Layout location={location} description={siteDescription} title={`${post.frontmatter.title} | ${siteTitle}`} overrideBackgroundColor="white">
      <BlogContainer>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </BlogContainer>
    </Layout>
  )
})

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
