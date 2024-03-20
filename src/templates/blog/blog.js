import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import { rhythm } from '../../utils/typography'
import BlogContainer from '../../components/BlogContainer'
import Banner from '../../components/Banner'
import ImageGallery from '../../components/ImageGallery'
import baguetteBox from 'baguettebox.js'
import 'baguettebox.js/dist/baguetteBox.min.css'
import GigTile from '../../components/GigTile'
import FlexGridContainer from '../../components/FlexGridContainer'
import { BlogSidebar } from './sidebar'
import { theme } from '../../utils/theme'
import TextContainer from '../../components/TextContainer'
import { SiteHead } from '../../components/SiteHead'

const Page = React.memo(({ data, pageContext, children }) => {
  const post = data.thisPost

  const { previous, next } = pageContext

  useEffect(() => {
    // If we don't have a proper image gallery we still want lightboxes for images
    if (!post.frontmatter.gallery) baguetteBox.run('.gatsby-resp-image-link')
  }, [])

  return (
    <Layout location={typeof window !== `undefined` && window.location} overrideBackgroundColor="white">
      <BlogContainer>
        {post.frontmatter.cover && (
          <Banner backgroundImage={post.frontmatter.cover} backgroundImageVertical={post.frontmatter.cover_vertical}>
            <BlogTitle>{post.frontmatter.title}</BlogTitle>
          </Banner>
        )}
        <BlogWrapper featureMode={post.frontmatter.featureMode}>
          {!post.frontmatter.featureMode && <BlogSidebar data={data} />}
          <TextContainer
            leftAlign={!post.frontmatter.featureMode ? true : false}
            featureMode={post.frontmatter.featureMode}
            hideCaptions={post.frontmatter.hideCaptions}
          >
            {children}
            {post.frontmatter.featureMode && (
              <p className="notBodyText">
                <BlogSidebar hideDate={true} data={data} />
              </p>
            )}
          </TextContainer>
        </BlogWrapper>
        {post.frontmatter.gallery && data.images && <ImageGallery images={data.images['nodes']} title={post.frontmatter.title} />}
        {(!!data.artist_gigs.nodes.length || !!data.specific_gigs.nodes.length) && <h2 style={{ marginBottom: '0' }}>Related Gigs</h2>}
        <FlexGridContainer>
          {[
            ...data.artist_gigs.nodes,
            // Make sure we don't have duplicates
            ...data.specific_gigs.nodes.filter((node) => !data.artist_gigs.nodes.find((node2) => node.fields.slug == node2.fields.slug)),
          ].map((node) => (
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

export const Head = (params) => {
  const cover = params.data.thisPost.frontmatter.cover
  const description = params.data.thisPost.excerpt

  return (
    <SiteHead title={params.data.thisPost.frontmatter.title} description={description} date={params.data.thisPost.frontmatter.date} cover={cover} {...params} />
  )
}

const BlogPostNav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
`

const BlogWrapper = styled(BlogContainer)`
  max-width: ${(props) => (props.featureMode ? 'auto' : '1680px')};
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
  filter: drop-shadow(1px 2px 10px black);

  @media screen and (min-width: ${theme.default.breakpoints.md}) {
    font-size: 3.5em;
  }

  @media screen and (min-width: ${theme.default.breakpoints.lg}) {
    font-size: 4em;
  }
`

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $parentDir: String!, $tags: [String], $related_gigs: [String], $isGallery: Boolean!) {
    thisPost: mdx(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
    specific_gigs: allGigYaml(sort: { date: DESC }, filter: { title: { in: $related_gigs } }) {
      nodes {
        ...GigTileFrontmatter
      }
    }
    artist_gigs: allGigYaml(limit: 3, sort: { date: DESC }, filter: { artists: { elemMatch: { name: { in: $tags } } } }) {
      nodes {
        ...GigTileFrontmatter
      }
    }
    artist_pages: allArtistYaml(filter: { title: { in: $tags } }) {
      nodes {
        ...ArtistFrontmatter
      }
    }
    venue_pages: allVenueYaml(filter: { title: { in: $tags } }) {
      nodes {
        ...VenueFrontmatter
      }
    }
    images: allFile(
      filter: { sourceInstanceName: { eq: "media" }, extension: { in: ["jpg", "JPG"] }, fields: { mediaDir: { eq: "blog" }, parentDir: { eq: $parentDir } } }
    ) @include(if: $isGallery) {
      nodes {
        name
        publicURL
        ...MediumImage
      }
    }
  }
`

export default Page
