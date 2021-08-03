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
import { scale, rhythm } from '../../utils/typography'
import styled from '@emotion/styled'
import ContentTabs from './ContentTabs'
import { scrollTo } from '../../utils/helper'
import BackButton from '../../components/BackButton'
import BackToTop from '../../components/BackToTop'
import ActiveIndicator from '../../components/ActiveIndicator'
import { getSrc } from 'gatsby-plugin-image'
import MetadataLinks from './MetadataLinks'

export default React.memo(({ data, pageDescription, parent, background }) => {
  useEffect(() => {
    if (typeof window !== `undefined` && window.previousPath) {
      const previousGigSlug = new URL(window.previousPath).pathname
      setTimeout(() => scrollTo(null, previousGigSlug, 57 + 43 + 29), 50)
    }
  }, [])

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

  const gigTiles =
    gigs &&
    useMemo(() => {
      const thing = gigs.map(({ fieldValue, edges }) => {
        const yearSize = edges.length

        return (
          <div id={fieldValue} key={fieldValue}>
            <Divider backgroundColor={theme.default.foregroundColor} color={'black'} sticky={'headerMobile'}>
              <a style={{ width: '100%' }} onClick={(e) => scrollTo(e, fieldValue)} href={'#' + fieldValue}>
                <small>
                  {fieldValue} ({yearSize})
                </small>
              </a>
            </Divider>
            <FlexGridContainer>
              {edges.map(({ node }) => (
                <GigTile id={node.fields.slug} node={node} key={node.fields.slug} />
              ))}
            </FlexGridContainer>
          </div>
        )
      })

      if (data.thisPost.frontmatter.audioculture) {
        const audioculture = data.thisPost.frontmatter.audioculture
        thing.push(
          <FlexGridContainer key={'audioculture'}>
            <Tile href={audioculture.link}>
              <Quote>
                "{audioculture.snippet}" - <span>Audioculture</span>
              </Quote>
            </Tile>
          </FlexGridContainer>
        )
      }

      if (thing.length <= 3) {
        thing.push(
          <FlexGridContainer key={'contribution'}>
            <Tile backgroundColor="black" height="50px" to="/page/contribution_guidelines">
              <small>Can you add to this? 🤔</small>
            </Tile>
          </FlexGridContainer>
        )
      }

      return thing
    }, [])

  return (
    <Layout
      location={parent}
      description={pageDescription}
      image={cover && getSrc(cover)}
      title={`${data.thisPost.frontmatter.title} | ${data.site.siteMetadata.title}`}
      scrollHeaderOverlay={
        <PageTitle>
          <h1 className="big">{data.thisPost.frontmatter.title}</h1>
        </PageTitle>
      }
    >
      <Banner
        title={
          (data.thisPost.frontmatter.title || data.thisPost.fields.slug) + (data.thisPost.frontmatter.origin ? ` (${data.thisPost.frontmatter.origin})` : '')
        }
        subtitle={
          data.thisPost.frontmatter.died !== undefined && (
            <ActiveWrapper>
              <ActiveIndicator died={data.thisPost.frontmatter.died} inactiveText={data.thisPost.fields.type === 'artists' ? 'Inactive' : 'Defunct'} />
            </ActiveWrapper>
          )
        }
        backgroundImage={cover}
        background={background}
        customContent={<BackButton title={parent.title} to={parent.href} type="up" />}
      >
        <HorizontalNav style={{ paddingTop: rhythm(1) }}>
          <MetadataLinks frontmatter={data.thisPost.frontmatter} liClassname="button" />
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
      <BackToTop />
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
const PageTitle = styled.span`
  margin-left: auto;
  max-width: 75vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  h1 {
    color: black;
    font-size: 100%;
    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      font-size: ${rhythm(1.8)};
      line-height: 0.9;
    }
  }
`

const ActiveWrapper = styled.div``
