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

import React, { useCallback, useEffect, useMemo } from 'react'
import Layout from '../../components/Layout'
import Banner from '../../components/Banner'
import Tile from '../../components/Tile'
import HorizontalNav from '../../components/HorizontalNav'
import { rhythm, scale } from '../../utils/typography'
import styled from '@emotion/styled'
import ContentTabs from './ContentTabs'
import { scrollTo } from '../../utils/helper'
import BackButton from '../../components/BackButton'
import BackToTop from '../../components/BackToTop'
import ActiveIndicator from '../../components/ActiveIndicator'
import MetadataLinks from './MetadataLinks'
import GigTiles from './GigTiles'
import { shuffler } from '../../utils/shuffling'
import { Link } from 'gatsby'
import FlexGridContainer from '../../components/FlexGridContainer'

export default React.memo(({ data, parent, background }) => {
  useEffect(() => {
    if (typeof window !== `undefined` && window.previousPath) {
      const previousGigSlug = new URL(window.previousPath).pathname
      setTimeout(() => scrollTo(null, previousGigSlug, 57 + 43 + 29), 50)
    }
  }, [])

  const cover = !background && data.images?.nodes.length !== 0 && data.images.nodes[0]

  const gigs = useMemo(() => data.gigs?.group.slice().reverse(), [data]) // it expects them grouped by year in ascending order
  const blogs = data.blogs?.nodes
  const vaultsessions = data.vaultsessions?.nodes

  // This is used to get a gig node from a gig image to display a caption
  const getGigByfileName = useCallback(
    (fileName) =>
      gigs.reduce((acc, yearGroup) => {
        const gig = yearGroup.nodes.find((gig) => gig.fields.fileName == fileName)
        if (gig) acc = gig
        return acc
      }, null),
    [gigs]
  )

  const images = useMemo(
    () =>
      data.images && (data.images.nodes.length > 1 || (background && data.images.nodes.length > 0)) ? shuffler(data.images.nodes, data.thisPost.title) : null,
    [data]
  )
  const imageCaptions = images?.map((image, index) => {
    const gig = image.fields?.gigDir && getGigByfileName(image.fields.gigDir)
    return (
      <p key={gig ? gig.fields.slug : index}>
        {gig && (
          <>
            Taken at{' '}
            <Link to={gig.fields.slug} title={gig.title}>
              {gig.title}
            </Link>{' '}
            on {gig.date}
          </>
        )}
      </p>
    )
  })

  const gigCount = useMemo(
    () =>
      gigs.reduce((acc, { nodes }) => {
        acc += nodes.length
        return acc
      }, 0),
    [gigs]
  )

  const blogCount = blogs ? blogs.length : 0
  const vaultsessionCount = vaultsessions ? vaultsessions.length : 0

  const blogTiles = useMemo(
    () =>
      blogs?.map((node) => {
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
    [blogs]
  )

  const vaultsessionTiles = useMemo(
    () => vaultsessions?.map((node) => <Tile key={node.fields.slug} title={node.title} coverDir={node.fields.fileName} href={node.fields.slug} />),
    [vaultsessions]
  )

  const gigTiles = gigs && <GigTiles gigs={gigs} frontmatter={data.thisPost} />

  return (
    <Layout
      location={parent}
      scrollHeaderOverlay={
        <PageTitle>
          <h1 className="big">{data.thisPost.title}</h1>
        </PageTitle>
      }
    >
      <Banner
        title={(data.thisPost.title || data.thisPost.fields.slug) + (data.thisPost.origin ? ` (${data.thisPost.origin})` : '')}
        subtitle={
          data.thisPost.died !== undefined && (
            <ActiveWrapper>
              <ActiveIndicator
                born={data.thisPost.date}
                died={data.thisPost.died}
                inactiveText={data.thisPost.fields.type === 'artist' ? 'Inactive' : 'Defunct'}
              />
            </ActiveWrapper>
          )
        }
        backgroundImage={cover}
        background={background}
        customContent={<BackButton title={parent.title} to={parent.href} type="up" />}
      >
        <HorizontalNav style={{ paddingTop: rhythm(1) }}>
          <MetadataLinks frontmatter={data.thisPost} liClassname="button" />
        </HorizontalNav>
        {data.thisPost.description && <PageDescription dangerouslySetInnerHTML={{ __html: data.thisPost.description }} />}
        {data.thisPost.audioculture && (
          <QuoteWrapper href={data.thisPost.audioculture.link}>
            <Quote>
              "{data.thisPost.audioculture.snippet}" - <span>Audioculture</span>
            </Quote>
          </QuoteWrapper>
        )}
      </Banner>
      <ContentTabs
        gigTiles={gigTiles}
        blogTiles={blogTiles}
        vaultsessionTiles={vaultsessionTiles}
        gigCount={gigCount}
        blogCount={blogCount}
        vaultsessionCount={vaultsessionCount}
        images={images}
        imageCaptions={imageCaptions}
      />
      <BackToTop />
    </Layout>
  )
})

const PageTitle = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: ${(props) => props.theme.headerHeightMobile};
  display: flex;
  align-items: center;
  text-align: right;
  background-color: transparent;
  h1 {
    display: none;
    color: black;
    font-size: 100%;
    font-size: ${rhythm(1)};
    @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
      display: block;
      font-size: 100%;
      font-size: ${rhythm(1.8)};
      text-align: center;
    }
  }
`

const PageDescription = styled.p`
  filter: drop-shadow(1px 1px 5px black);
  background: ${(props) => 'linear-gradient(90deg, black,' + props.theme.backgroundColor + ')'};
  border: 2px inset;
  padding: 5px;
  margin-top: auto;
`

const QuoteWrapper = styled.a`
  padding-top: ${rhythm(1)};
`

const Quote = styled.p`
  ${scale(0.8)};
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
  @media screen and (min-width: ${(props) => props.theme.breakpoints.sm}) {
    ${scale(1)};
  }
`

const ActiveWrapper = styled.div``
