import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../../components/Layout'
import styled from '@emotion/styled'
import BlogContainer from '../../components/BlogContainer'
import TagCloud from '../../components/TagCloud'
import Banner from '../../components/Banner'
import { rhythm } from '../../utils/typography'

export default React.memo(({ data, pageContext }) => {
  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description
  const posts = data.allBlogs.edges
  const blogTags = data.blogTags.group

  const postElements = posts.map(({ node }) => (
    <Post key={node.fields.slug}>
      <h1>
        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
      </h1>
      <h4>{node.frontmatter.date}</h4>
      {node.frontmatter.cover && (
        <Link to={node.fields.slug}>
          <Banner height="20vh" backgroundImage={node.frontmatter.cover}></Banner>
        </Link>
      )}
      <p>
        {node.excerpt}{' '}
        <small>
          <Link to={node.fields.slug}>More</Link>
        </small>
      </p>
      <hr />
    </Post>
  ))

  return (
    <Layout
      location={typeof window !== `undefined` && window.location}
      description={siteDescription}
      title={`Blog | ${siteTitle}`}
      overrideBackgroundColor="white"
    >
      <BlogContainer>
        <TagCloud blogTags={blogTags} selected={pageContext.tag} />
        {postElements}
      </BlogContainer>
    </Layout>
  )
})

const Post = styled.div`
  margin-top: ${rhythm(1)};

  .banner,
  hr {
    margin-left: 0px;
    margin-right: 0px;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    .banner,
    hr {
      margin-left: -5vw;
      margin-right: -5vw;
    }
  }

  .banner {
    margin-bottom: ${rhythm(1)};
  }

  hr {
    margin-top: ${rhythm(1)};
  }
`

export const pageQuery = graphql`
  query($tag: [String]) {
    site {
      ...SiteInformation
    }
    allBlogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { in: $tag } } }
    ) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
    blogTags: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { eq: "blog" } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
