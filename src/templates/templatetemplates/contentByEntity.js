/*
  contentByEntity.js

  This template will display all gigs and blogs from a particular entity.

  To use it you should extend it in another template. The template will need a graphQL query which returns the following:

    - thisPost: Data from this post such as the title
    - gigs: List of gigs which match the entity.
    - blogs (optional): List of blogs which match the entity
    - images (optional): The first image will be used as the cover.

  Additionally in your constructor you should set the following.

    - pageDescription: The description metadata for this page.
    - parent: An object containing the title and href of the parent page.
    - background (optional): The element to place as the background of the banner (instead of an image).EDE

*/


import React from 'react'
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

class ContentByEntityTemplate extends React.Component {

  constructor(props) {
    super(props)

    this.scrollHeaderOffset = typeof window !== `undefined` && calculateScrollHeaderOffset(window)

    this.post = this.props.data.thisPost
    this.cover = this.props.data.images && this.props.data.images.edges.length !== 0 && this.props.data.images.edges[0].node

    this.gigs = this.props.data.gigs && this.props.data.gigs.group.reverse() // it expects them grouped by year in ascending order
    this.blogs = this.props.data.blogs && this.props.data.blogs.edges
    this.vaultsessions = this.props.data.vaultsessions && this.props.data.vaultsessions.edges
    this.siteTitle = this.props.data.site.siteMetadata.title

    this.state = {
      scrolled: false,
      openTab: "gigs"
    }
  }

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  scrollTo = (e, anchor) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById(anchor).scrollIntoView({behavior: "smooth"})
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.onScroll, {passive: true});
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (window.pageYOffset > this.scrollHeaderOffset) {
      !this.state.scrolled && this.setState({scrolled: true})
    } else {
      this.state.scrolled && this.setState({scrolled: false})
    }
  }

  render() {

    const gigTiles = this.gigs && this.gigs.map(({fieldValue, edges}) => {
      return <div id={fieldValue} key={fieldValue}>
        <Divider backgroundColor={theme.default.foregroundColor} color="white" sticky><a style={{width: "100%"}} onClick={(e) => this.scrollTo(e, fieldValue)} href={"#" + fieldValue}>{fieldValue}</a></Divider>
        <FlexGridContainer>
          {edges.map(({node}) => <GigTile node={node} key={node.fields.slug}/>)}
        </FlexGridContainer>
      </div>
    })

    const blogTiles = this.blogs && this.blogs.map(({node}) => {
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

    const vaultsessions = this.vaultsessions && this.vaultsessions.map(({node}) =>
      <Tile
        key={node.fields.slug}
        title={node.frontmatter.title}
        image={node.frontmatter.cover}
        href={node.fields.slug}
      />
    )

    console.log(vaultsessions);

    return (
      <Layout
        location={this.props.location}
        description={this.pageDescription}
        image={this.cover && this.cover.src}
        title={`${this.post.frontmatter.title} | ${this.siteTitle}`}
        hideBrand={this.state.scrolled}
        hideNav={this.state.scrolled}
        headerContent={this.state.scrolled && <a onClick={(e) => this.scrollTo(e, "top")} href="#top" title="Scroll to top"><h1 className="big">{this.post.frontmatter.title}</h1></a>}
      >
        <Banner title={(this.post.frontmatter.title || this.post.fields.slug) + (this.post.frontmatter.origin ? ` (${this.post.frontmatter.origin})` : "")} backgroundImage={this.cover} background={this.background} customContent={(
            <><ZoopUpWrapper title="BACK TO ARTISTS ☝" href={this.parent.href}><p>☝ Back to {this.parent.title} ☝</p><MdKeyboardArrowUp/></ZoopUpWrapper></>
          )}>
          <HorizontalNav>
            {this.post.frontmatter.facebook && <li><a className="button" rel="noopener" href={this.post.frontmatter.facebook}>Facebook</a></li>}
            {this.post.frontmatter.bandcamp && <li><a className="button" rel="noopener" href={this.post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {this.post.frontmatter.soundcloud && <li><a className="button" rel="noopener" href={this.post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {this.post.frontmatter.Website && <li><a className="button" rel="noopener" href={this.post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Tabs>
          <button className={this.state.openTab === "gigs" ? "active" : ""} onClick={() => this.setState({openTab: "gigs"})}>Gigs ({this.gigs.length})</button>
          {this.blogs && this.blogs.length > 0 && <button className={this.state.openTab === "blogs" ? "active" : ""} onClick={() => this.setState({openTab: "blogs"})}>Blogs ({this.blogs.length})</button>}
          {this.vaultsessions && this.vaultsessions.length > 0 && <button className={this.state.openTab === "vaultsessions" ? "active" : ""} onClick={() => this.setState({openTab: "vaultsessions"})}><span class="rainbowBackground">VAULT SESSION</span></button>}
        </Tabs>
          {this.state.openTab === "gigs" && gigTiles}
          {this.state.openTab === "blogs" && <FlexGridContainer>{blogTiles}</FlexGridContainer>}
          {this.state.openTab === "vaultsessions" && <FlexGridContainer>{vaultsessions}</FlexGridContainer>}
      </Layout>
    )
  }
}

export default ContentByEntityTemplate
