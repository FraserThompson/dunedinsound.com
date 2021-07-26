import React from 'react'
import styled from '@emotion/styled'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import { rhythm } from '../../utils/typography'
import BlogContainer from '../../components/BlogContainer'
import Banner from '../../components/Banner'
import ImageGallery from '../../components/ImageGallery'
import GigTile from '../../components/GigTile'
import FlexGridContainer from '../../components/FlexGridContainer'
import { BlogSidebar } from './sidebar'
import { theme } from '../../utils/theme'
import TextContainer from '../../components/TextContainer'

const Page = React.memo(({ data, pageContext }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const siteDescription = post.excerpt ? post.excerpt : data.site.siteMetadata.description
  const { previous, next } = pageContext

  return (
    <Layout
      location={typeof window !== `undefined` && window.location}
      date={post.frontmatter.date}
      description={siteDescription}
      title={`${post.frontmatter.title} | ${siteTitle}`}
      overrideBackgroundColor="white"
    >
      <BlogContainer>
        {post.frontmatter.cover && (
          <Banner backgroundImage={post.frontmatter.cover}>
            <BlogTitle>{post.frontmatter.title}</BlogTitle>
          </Banner>
        )}
        <BlogWrapper>
          <BlogSidebar data={data} />
          <TextContainer leftAlign={true}>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </TextContainer>
        </BlogWrapper>
        {post.frontmatter.gallery && <ImageGallery images={data.images['edges']} title={post.frontmatter.title} />}
        {(data.artist_gigs.edges.length || data.specific_gigs.edges.length) && <h2 style={{ marginBottom: '0' }}>Related Gigs</h2>}
        <FlexGridContainer>
          {[...data.artist_gigs.edges, ...data.specific_gigs.edges].map(({ node }) => (
            <GigTile id={node.fields.slug} node={node} key={node.fields.slug} />
          ))}
        </FlexGridContainer>
        <hr style={{ marginBottom: rhythm(1) }} />
        <BlogPostNav>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </BlogPostNav>
      </BlogContainer>
    </Layout>
  )
})

const BlogPostNav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
`

const BlogWrapper = styled(BlogContainer)`
  max-width: 1680px;
  margin: 0 auto;
  display: flex;
`

const BlogTitle = styled.h1`
  font-size: 3em;
  text-align: center;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: uppercase;
  margin-bottom: 0;

  @media screen and (min-width: ${theme.default.breakpoints.md}) {
    font-size: 3.5em;
  }

  @media screen and (min-width: ${theme.default.breakpoints.lg}) {
    font-size: 4em;
  }
`

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $parentDir: String!, $tags: [String], $related_gigs: [String]) {
    site {
      ...SiteInformation
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
    specific_gigs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { title: { in: $related_gigs } } }
    ) {
      edges {
        node {
          ...GigTileFrontmatter
        }
      }
    }
    artist_gigs: allMarkdownRemark(
      limit: 3
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { artists: { elemMatch: { name: { in: $tags } } } } }
    ) {
      edges {
        node {
          ...GigTileFrontmatter
        }
      }
    }
    artist_pages: allMarkdownRemark(filter: { fields: { type: { eq: "artists" } }, frontmatter: { title: { in: $tags } } }) {
      edges {
        node {
          fields {
            machine_name
            slug
          }
          frontmatter {
            title
            bandcamp
            facebook
            soundcloud
            origin
            website
          }
        }
      }
    }
    venue_pages: allMarkdownRemark(filter: { fields: { type: { eq: "venues" } }, frontmatter: { title: { in: $tags } } }) {
      edges {
        node {
          fields {
            machine_name
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
    images: allFile(filter: { extension: { in: ["jpg", "JPG"] }, fields: { parentDir: { eq: $parentDir } } }) {
      edges {
        node {
          name
          publicURL
          ...MediumImage
        }
      }
    }
  }
`

export default Page
