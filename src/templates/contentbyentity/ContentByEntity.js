/*
  contentByEntity.js

  This template will display all gigs and blogs from a particular entity.

  It takes these props:

    - data: The results of your graphql query.
    - pageDescription: The description metadata for this page.
    - parent: An object containing the title and href of the parent page.
    - background (optional): The element to place as the background of the banner (instead of an image).EDE

  data is a graphQL query which returns the following:

    - thisPost: Data from this post such as the title
    - gigs: List of gigs which match the entity.
    - blogs (optional): List of blogs which match the entity
    - images (optional): The first image will be used as the cover.
*/

import React, { useCallback } from 'react'
import Layout from '../../components/Layout'
import Banner from '../../components/Banner'
import Tile from '../../components/Tile'
import Divider from '../../components/Divider'
import HorizontalNav from '../../components/HorizontalNav'
import { theme } from '../../utils/theme'
import FlexGridContainer from '../../components/FlexGridContainer'
import ZoopUpWrapper from '../../components/ZoopUpWrapper'
import { MdKeyboardArrowUp } from 'react-icons/md'
import GigTile from '../../components/GigTile'
import { scale } from '../../utils/typography'
import styled from '@emotion/styled'
import ContentTabs from './ContentTabs'

export default React.memo(({ data, pageDescription, parent, background }) => {
  const siteTitle = data.site.siteMetadata.title

  const post = data.thisPost
  const cover = data.images && data.images.edges.length !== 0 && data.images.edges[0].node

  const gigs = data.gigs && data.gigs.group.slice().reverse() // it expects them grouped by year in ascending order
  const blogs = data.blogs && data.blogs.edges
  const vaultsessions = data.vaultsessions && data.vaultsessions.edges

  const gigCount = gigs.reduce((acc, { edges }) => {
    acc += edges.length
    return acc
  }, 0)
  const blogCount = blogs ? blogs.length : 0
  const vaultsessionCount = vaultsessions ? vaultsessions.length : 0

  const gigTiles =
    gigs &&
    gigs.map(({ fieldValue, edges }) => {
      const yearSize = edges.length
      const gridSize = yearSize > 1 ? { xs: 6, sm: 4, lg: 3 } : { xs: 12, sm: 12, lg: 12 }

      return (
        <div id={fieldValue} key={fieldValue}>
          <Divider backgroundColor={theme.default.foregroundColor} color="white" sticky={2}>
            <a style={{ width: '100%' }} onClick={e => scrollTo(e, fieldValue)} href={'#' + fieldValue}>
              {fieldValue} ({yearSize})
            </a>
          </Divider>
          <FlexGridContainer>
            {edges.map(({ node }) => (
              <GigTile node={node} key={node.fields.slug} imageSizes={gridSize} />
            ))}
          </FlexGridContainer>
        </div>
      )
    })

  if (post.frontmatter.audioculture) {
    const audioculture = post.frontmatter.audioculture
    gigTiles.push(
      <FlexGridContainer key={'audioculture'}>
        <Tile href={audioculture.link}>
          <Quote>
            "{audioculture.snippet}" - <span>Audioculture</span>
          </Quote>
        </Tile>
      </FlexGridContainer>
    )
  }

  if (gigTiles.length <= 3) {
    gigTiles.push(
      <FlexGridContainer key={'contribution'}>
        <Tile backgroundColor="black" height="50px" to="/page/contribution_guidelines">
          <small>Can you add to this? 🤔</small>
        </Tile>
      </FlexGridContainer>
    )
  }

  const blogTiles =
    blogs &&
    blogs.map(({ node }) => {
      return (
        <Tile
          key={node.fields.slug}
          title={node.frontmatter.title}
          subtitle={node.excerpt}
          image={node.frontmatter.cover}
          label={node.frontmatter.date}
          to={node.fields.slug}
        />
      )
    })

  const vaultsessionTiles =
    vaultsessions &&
    vaultsessions.map(({ node }) => <Tile key={node.fields.slug} title={node.frontmatter.title} image={node.frontmatter.cover} href={node.fields.slug} />)

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  const scrollTo = useCallback((e, anchor) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <Layout
      location={parent}
      description={pageDescription}
      image={cover && cover.src}
      title={`${post.frontmatter.title} | ${siteTitle}`}
      scrollHeaderContent={
        <a onClick={e => scrollTo(e, 'top')} href="#top" title="Scroll to top">
          <h1 className="big">{post.frontmatter.title}</h1>
        </a>
      }
    >
      <Banner
        title={(post.frontmatter.title || post.fields.slug) + (post.frontmatter.origin ? ` (${post.frontmatter.origin})` : '')}
        backgroundImage={cover}
        background={background}
        customContent={
          <>
            <ZoopUpWrapper title="Back" href={parent.href}>
              <p>☝ Back to {parent.title} ☝</p>
              <MdKeyboardArrowUp />
            </ZoopUpWrapper>
          </>
        }
      >
        <HorizontalNav>
          {post.frontmatter.facebook && (
            <li>
              <a className="button" rel="noopener" href={post.frontmatter.facebook}>
                Facebook
              </a>
            </li>
          )}
          {post.frontmatter.bandcamp && (
            <li>
              <a className="button" rel="noopener" href={post.frontmatter.bandcamp}>
                Bandcamp
              </a>
            </li>
          )}
          {post.frontmatter.soundcloud && (
            <li>
              <a className="button" rel="noopener" href={post.frontmatter.soundcloud}>
                Soundcloud
              </a>
            </li>
          )}
          {post.frontmatter.website && (
            <li>
              <a className="button" rel="noopener" href={post.frontmatter.website}>
                Website
              </a>
            </li>
          )}
          {post.frontmatter.audioculture && (
            <li>
              <a className="button" rel="noopener" href={post.frontmatter.audioculture.link}>
                Audioculture
              </a>
            </li>
          )}
        </HorizontalNav>
        {post.frontmatter.description && <p style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: post.frontmatter.description }} />}
      </Banner>
      <ContentTabs
        gigTiles={gigTiles}
        blogTiles={blogTiles}
        vaultsessionTiles={vaultsessionTiles}
        gigCount={gigCount}
        blogCount={blogCount}
        vaultsessionCount={vaultsessionCount}
      />
    </Layout>
  )
})

const Quote = styled.p`
  ${scale(1)};
  font-style: italic;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  text-shadow: 1px 1px #000;
  > span {
    transition: color 0.3s ease-in-out;
    color: white;
  }
  &:hover {
    > span {
      color: #b4dc7b;
    }
  }
`
