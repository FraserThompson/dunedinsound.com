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

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Banner from '../../components/Banner'
import Tile from '../../components/Tile'
import Divider from '../../components/Divider'
import HorizontalNav from '../../components/HorizontalNav'
import { theme } from '../../utils/theme'
import { calculateScrollHeaderOffset } from '../../utils/helper'
import FlexGridContainer from '../../components/FlexGridContainer'
import ZoopUpWrapper from '../../components/ZoopUpWrapper';
import { MdKeyboardArrowUp } from 'react-icons/md';
import GigTile from '../../components/GigTile';
import Tabs from '../../components/Tabs';

export default ({data, pageDescription, parent, background}) => {

  const [scrolled, setScrolled] = useState(false);
  const [openTab, setOpenTab] = useState("gigs");

  const scrollHeaderOffset = typeof window !== `undefined` && calculateScrollHeaderOffset(window)

  const onScroll = () => {
    if (window.pageYOffset > scrollHeaderOffset) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  // window scroll listener on mount, remove on unmount
  useEffect(() => {
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [])

  const siteTitle = data.site.siteMetadata.title

  const post = data.thisPost
  const cover = data.images && data.images.edges.length !== 0 && data.images.edges[0].node

  const gigs = data.gigs && data.gigs.group.slice().reverse() // it expects them grouped by year in ascending order
  const blogs = data.blogs && data.blogs.edges
  const vaultsessions = data.vaultsessions && data.vaultsessions.edges

  const gigCount = gigs.reduce((acc, {edges}) => {
    acc += edges.length
    return acc;
  }, 0)

  const gigTiles = gigs && gigs.map(({fieldValue, edges}) => {
    return <div id={fieldValue} key={fieldValue}>
      <Divider backgroundColor={theme.default.foregroundColor} color="white" sticky><a style={{width: "100%"}} onClick={(e) => scrollTo(e, fieldValue)} href={"#" + fieldValue}>{fieldValue}</a></Divider>
      <FlexGridContainer>
        {edges.map(({node}) => <GigTile node={node} key={node.fields.slug}/>)}
      </FlexGridContainer>
    </div>
  })

  const blogTiles = blogs && blogs.map(({node}) => {
    return (
      <Tile
        key={node.fields.slug}
        title={node.frontmatter.title}
        subtitle={node.excerpt}
        image={node.frontmatter.cover}
        label={node.frontmatter.date}
        href={node.fields.slug}
      />
    )
  })

  const vaultsessionTiles = vaultsessions && vaultsessions.map(({node}) =>
    <Tile
      key={node.fields.slug}
      title={node.frontmatter.title}
      image={node.frontmatter.cover}
      href={node.fields.slug}
    />
  )

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  const scrollTo = (e, anchor) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById(anchor).scrollIntoView({behavior: "smooth"})
  }

  return (
    <Layout
      location={parent}
      description={pageDescription}
      image={cover && cover.src}
      title={`${post.frontmatter.title} | ${siteTitle}`}
      hideBrand={scrolled}
      hideNav={scrolled}
      headerContent={scrolled && <a onClick={(e) => scrollTo(e, "top")} href="#top" title="Scroll to top"><h1 className="big">{post.frontmatter.title}</h1></a>}
    >
      <Banner title={(post.frontmatter.title || post.fields.slug) + (post.frontmatter.origin ? ` (${post.frontmatter.origin})` : "")} backgroundImage={cover} background={background} customContent={(
          <><ZoopUpWrapper title="Back" href={parent.href}><p>☝ Back to {parent.title} ☝</p><MdKeyboardArrowUp/></ZoopUpWrapper></>
        )}>
        <HorizontalNav>
          {post.frontmatter.facebook && <li><a className="button" rel="noopener" href={post.frontmatter.facebook}>Facebook</a></li>}
          {post.frontmatter.bandcamp && <li><a className="button" rel="noopener" href={post.frontmatter.bandcamp}>Bandcamp</a></li>}
          {post.frontmatter.soundcloud && <li><a className="button" rel="noopener" href={post.frontmatter.soundcloud}>Soundcloud</a></li>}
          {post.frontmatter.website && <li><a className="button" rel="noopener" href={post.frontmatter.website}>Website</a></li>}
        </HorizontalNav>
        {post.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: post.frontmatter.description}}/>}
      </Banner>
      <Tabs>
        <button className={openTab === "gigs" ? "active" : ""} onClick={() => setOpenTab("gigs")}>
          Gigs ({gigCount})
        </button>
        {blogs && blogs.length > 0 &&
          <button className={openTab === "blogs" ? "active" : ""} onClick={() => setOpenTab("blogs")}>
            Blogs ({blogs.length})
          </button>
        }
        {vaultsessions && vaultsessions.length > 0 &&
          <button className={openTab === "vaultsessions" ? "active" : ""} onClick={() => setOpenTab("vaultsessions")}>
            <span className="rainbowBackground">VAULT SESSION</span>
          </button>
        }
      </Tabs>
        {openTab === "gigs" && gigTiles}
        {openTab === "blogs" && <FlexGridContainer>{blogTiles}</FlexGridContainer>}
        {openTab === "vaultsessions" && <FlexGridContainer>{vaultsessionTiles}</FlexGridContainer>}
    </Layout>
  )
}
