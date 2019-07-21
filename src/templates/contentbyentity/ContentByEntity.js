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

import React, { useEffect, useMemo } from 'react'
import Layout from '../../components/Layout'
import Banner from '../../components/Banner'
import Tile from '../../components/Tile'
import Divider from '../../components/Divider'
import HorizontalNav from '../../components/HorizontalNav'
import { theme } from '../../utils/theme'
import FlexGridContainer from '../../components/FlexGridContainer'
import GigTile from '../../components/GigTile'
import { scale } from '../../utils/typography'
import styled from '@emotion/styled'
import ContentTabs from './ContentTabs'
import { scrollTo } from '../../utils/helper'
import BackButton from '../../components/BackButton'
import { lighten } from 'polished'

export default React.memo(({ location, data, pageDescription, parent, background }) => {
  useEffect(() => {
    location.state && location.state.gigFrom && scrollTo(null, location.state.gigFrom.slug, 57 + 43 + 29)
  }, [gigTiles])

  const cover = data.images && data.images.edges.length !== 0 && data.images.edges[0].node

  const gigs = data.gigs && useMemo(() => data.gigs.group.slice().reverse()) // it expects them grouped by year in ascending order
  const blogs = data.blogs && data.blogs.edges
  const vaultsessions = data.vaultsessions && data.vaultsessions.edges

  const gigCount = useMemo(
    () =>
      gigs.reduce((acc, { edges }) => {
        acc += edges.length
        return acc
      }, 0),
    []
  )

  const blogCount = blogs ? blogs.length : 0
  const vaultsessionCount = vaultsessions ? vaultsessions.length : 0

  const gigTiles =
    gigs &&
    useMemo(
      () =>
        gigs.map(({ fieldValue, edges }) => {
          const yearSize = edges.length
          const gridSize = yearSize > 1 ? { xs: 6, sm: 4, lg: 3 } : { xs: 12, sm: 12, lg: 12 }

          return (
            <div id={fieldValue} key={fieldValue}>
              <Divider backgroundColor={lighten(0.5, theme.default.primaryColor)} color={theme.default.textColor} sticky={2}>
                <a style={{ width: '100%' }} onClick={e => scrollTo(e, fieldValue)} href={'#' + fieldValue}>
                  <small>
                    {fieldValue} ({yearSize})
                  </small>
                </a>
              </Divider>
              <FlexGridContainer>
                {edges.map(({ node }) => (
                  <GigTile id={node.fields.slug} node={node} key={node.fields.slug} imageSizes={gridSize} />
                ))}
              </FlexGridContainer>
            </div>
          )
        }),
      []
    )

  if (data.thisPost.frontmatter.audioculture) {
    const audioculture = data.thisPost.frontmatter.audioculture
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
    useMemo(
      () =>
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
        }),
      []
    )

  const vaultsessionTiles =
    vaultsessions &&
    useMemo(
      () =>
        vaultsessions.map(({ node }) => <Tile key={node.fields.slug} title={node.frontmatter.title} image={node.frontmatter.cover} href={node.fields.slug} />),
      []
    )

  return (
    <Layout
      location={parent}
      description={pageDescription}
      image={cover && cover.src}
      title={`${data.thisPost.frontmatter.title} | ${data.site.siteMetadata.title}`}
      scrollHeaderContent={
        <a style={{ width: '100%' }} onClick={e => scrollTo(e, 'top')} href="#top" title="Scroll to top">
          <h1 className="big">{data.thisPost.frontmatter.title}</h1>
        </a>
      }
    >
      <Banner
        title={
          (data.thisPost.frontmatter.title || data.thisPost.fields.slug) + (data.thisPost.frontmatter.origin ? ` (${data.thisPost.frontmatter.origin})` : '')
        }
        backgroundImage={cover}
        background={background}
        customContent={<BackButton title={parent.title} to={parent.href} />}
      >
        <HorizontalNav>
          {data.thisPost.frontmatter.facebook && (
            <li>
              <a className="button" rel="noopener" href={data.thisPost.frontmatter.facebook}>
                Facebook
              </a>
            </li>
          )}
          {data.thisPost.frontmatter.bandcamp && (
            <li>
              <a className="button" rel="noopener" href={data.thisPost.frontmatter.bandcamp}>
                Bandcamp
              </a>
            </li>
          )}
          {data.thisPost.frontmatter.soundcloud && (
            <li>
              <a className="button" rel="noopener" href={data.thisPost.frontmatter.soundcloud}>
                Soundcloud
              </a>
            </li>
          )}
          {data.thisPost.frontmatter.website && (
            <li>
              <a className="button" rel="noopener" href={data.thisPost.frontmatter.website}>
                Website
              </a>
            </li>
          )}
          {data.thisPost.frontmatter.audioculture && (
            <li>
              <a className="button" rel="noopener" href={data.thisPost.frontmatter.audioculture.link}>
                Audioculture
              </a>
            </li>
          )}
        </HorizontalNav>
        {data.thisPost.frontmatter.description && (
          <p style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: data.thisPost.frontmatter.description }} />
        )}
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
