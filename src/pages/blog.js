import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import styled from '@emotion/styled'
import TagCloud from '../components/TagCloud'
import Banner from '../components/Banner'
import { rhythm } from '../utils/typography'
import BlogContainer from '../components/BlogContainer'
import { invert } from 'polished'
import { SiteHead } from '../components/SiteHead'

const Page = ({ data, location }) => {
  const posts = data.allBlogs.nodes
  const blogTags = data.blogTags.group

  const postElements = posts.map((node) => (
    <Post key={node.fields.slug}>
      <h2>
        <Link to={node.fields.slug}>
          {node.frontmatter.tags.includes('interview') && 'INTERVIEW: '}
          {node.frontmatter.title}
        </Link>
      </h2>
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
    <Layout location={location} overrideBackgroundColor="white">
      <BlogPageContainer>
        <Sidebar>
          <h1>Tags</h1>
          <TagCloud blogTags={blogTags} />
        </Sidebar>
        <PostsContainer>
          <h1>Articles</h1>
          {postElements}
        </PostsContainer>
      </BlogPageContainer>
    </Layout>
  )
}

const BlogPageContainer = styled.div`
  display: flex;
  a {
    color: ${(props) => props.theme.contrastColor2};
  }
`

const Sidebar = styled.div`
  padding: ${rhythm(0.5)};
  color: #333333;
  max-width: 350px;
  display: none;
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
  }
`

const Post = styled.div`
  margin-top: ${rhythm(1)};
  .banner,
  hr {
    margin-left: 0px;
    margin-right: 0px;
  }

  .banner {
    margin-bottom: ${rhythm(1)};
  }

  hr {
    margin-top: ${rhythm(1)};
  }
`

const PostsContainer = styled(BlogContainer)`
  padding: ${rhythm(0.5)};
  max-width: ${(props) => props.theme.contentContainerWidth};
  margin: 0 auto;
`
export const Head = (params) => <SiteHead title={'Blog'} {...params} />

export const pageQuery = graphql`
  query {
    allBlogs: allMdx(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } } }) {
      nodes {
        ...BlogFrontmatter
      }
    }
    blogTags: allMdx(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } } }) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`

export default Page
