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
import HorizontalNav from '../../components/HorizontalNav'
import { rhythm } from '../../utils/typography'
import styled from '@emotion/styled'
import ContentTabs from './ContentTabs'
import { scrollTo } from '../../utils/helper'
import BackButton from '../../components/BackButton'
import BackToTop from '../../components/BackToTop'
import ActiveIndicator from '../../components/ActiveIndicator'
import { getSrc } from 'gatsby-plugin-image'
import MetadataLinks from './MetadataLinks'
import GigTiles from './GigTiles'

export default React.memo(({ data, parent, background }) => {
  useEffect(() => {
    if (typeof window !== `undefined` && window.previousPath) {
      const previousGigSlug = new URL(window.previousPath).pathname
      setTimeout(() => scrollTo(null, previousGigSlug, 57 + 43 + 29), 50)
    }
  }, [])

  const cover = data.images && data.images.nodes.length !== 0 && data.images.nodes[0]

  const gigs = data.gigs && useMemo(() => data.gigs.group.slice().reverse()) // it expects them grouped by year in ascending order
  const blogs = data.blogs && data.blogs.nodes
  const vaultsessions = data.vaultsessions && data.vaultsessions.nodes

  const gigCount = useMemo(
    () =>
      gigs.reduce((acc, { nodes }) => {
        acc += nodes.length
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
        blogs.map((node) => {
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
      () => vaultsessions.map((node) => <Tile key={node.fields.slug} title={node.frontmatter.title} image={node.frontmatter.cover} href={node.fields.slug} />),
      []
    )

  const gigTiles = gigs && <GigTiles gigs={gigs} frontmatter={data.thisPost.frontmatter} />

  return (
    <Layout
      location={parent}
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
        {data.thisPost.frontmatter.description && <PageDescription dangerouslySetInnerHTML={{ __html: data.thisPost.frontmatter.description }} />}
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

const PageTitle = styled.span`
  margin-left: auto;
  max-width: 75vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  h1 {
    display: none;
    color: black;
    font-size: 100%;
    font-size: ${rhythm(1.8)};
    line-height: 0.9;
    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      display: block;
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

const ActiveWrapper = styled.div``
