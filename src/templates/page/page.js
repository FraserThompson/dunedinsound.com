import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import TextContainer from '../../components/TextContainer'
import { SiteHead } from '../../components/SiteHead'

const Page = React.memo(({ data, children }) => {
  const post = data.thisPost

  return (
    <Layout location={typeof window !== `undefined` && window.location} overrideBackgroundColor="white">
      <TextContainer>{children}</TextContainer>
    </Layout>
  )
})

export const Head = (params) => {
  const description = params.data.thisPost.excerpt
  return <SiteHead title={params.data.thisPost.frontmatter.title} description={description} {...params} />
}

export const pageQuery = graphql`
  query PagePostBySlug($slug: String!) {
    thisPost: mdx(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
  }
`

export default Page
