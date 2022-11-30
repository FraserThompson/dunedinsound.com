import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import { rhythm } from '../../utils/typography'
import { theme } from '../../utils/theme'
import MetadataLinks from '../contentbyentity/MetadataLinks'

export const BlogSidebar = React.memo(({ data, hideDate = false }) => {
  const metadata = (node) => (
    <div key={node.fields.slug}>
      <h4>
        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
      </h4>
      <MetadataWrapper className="notBodyText">
        <MetadataLinks frontmatter={node.frontmatter} />
      </MetadataWrapper>
    </div>
  )
  return (
    <BlogSidebarWrapper>
      {!hideDate && (
        <Date>
          <small>{data.thisPost.frontmatter.date}</small>
        </Date>
      )}
      {!!data.artist_pages.nodes.length && (
        <FeaturedLinks>
          <h3>Artists featured in this article</h3>
          {data.artist_pages.nodes.map(metadata)}
        </FeaturedLinks>
      )}
      {!!data.venue_pages.nodes.length && (
        <FeaturedLinks>
          <h3>Venues featured in this article</h3>
          {data.venue_pages.nodes.map(metadata)}
        </FeaturedLinks>
      )}
    </BlogSidebarWrapper>
  )
})

const BlogSidebarWrapper = styled.div`
  padding: ${rhythm(0.5)};
  min-width: 320px;
  display: none;
  @media screen and (min-width: ${theme.default.breakpoints.xs}) {
    display: block;
  }
`

const MetadataWrapper = styled.ul``

const Date = styled.p`
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
`

const FeaturedLinks = styled.div`
  border: 1px solid black;
  margin: ${rhythm(0.5)};
  padding: ${rhythm(0.5)};

  h4 {
    margin-bottom: ${rhythm(0.5)};
  }
`
