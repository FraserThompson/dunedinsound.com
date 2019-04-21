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
import styled from 'styled-components'
import Tile from '../../components/Tile'
import Divider from '../../components/Divider'
import HorizontalNav from '../../components/HorizontalNav'
import { theme } from '../../utils/theme'
import FlexGridContainer from '../../components/FlexGridContainer'
import { rhythm } from '../../utils/typography';
import { invert } from 'polished';
import ZoopUpWrapper from '../../components/ZoopUpWrapper';
import { MdKeyboardArrowUp } from 'react-icons/md';
import GigTile from '../../components/GigTile';

const Tabs = styled(Divider)`
  padding: 0;
  height: ${rhythm(1.5)};
  > button {
    padding: 0;
    border-radius: 4px 4px 0 0;
    color: ${props => invert(props.theme.textColor)};
    border-left: 1px solid ${props => props.theme.contrastColor};
    border-right: 1px solid ${props => props.theme.contrastColor};
    border-bottom: 1px solid ${props => props.theme.contrastColor};
    border-bottom-color: transparent;
    border-top: none;
    height: 100%;
    line-height: ${rhythm(1.5)};
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
    &:active, &.active {
      color: white;
      outline: 0;
    }
  }
`

class ContentByEntityTemplate extends React.Component {

  constructor(props) {
    super(props)

    this.post = this.props.data.thisPost
    this.cover = this.props.data.images && this.props.data.images.edges[0].node.childImageSharp.fluid

    this.gigs = this.props.data.gigs && this.props.data.gigs.edges
    this.blogs = this.props.data.blogs && this.props.data.blogs.edges
    this.siteTitle = this.props.data.site.siteMetadata.title

    // sort our filtered posts by year and month
    this.postsByDate = this.gigs.reduce((object, {node}) => {
      const splitDate = node.frontmatter.date.split("-");
      const date = new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0]);
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-GB', { month: 'long' });
      object[year] || (object[year] = {})
      object[year][month] || (object[year][month] = [])
      object[year][month].push(node)
      return object
    }, {})

    this.state = {
      scrolled: false,
      openTab: "gigs"
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.onScroll, {passive: true});
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (window.pageYOffset > window.innerHeight * 0.7) {
      !this.state.scrolled && this.setState({scrolled: true})
    } else {
      this.state.scrolled && this.setState({scrolled: false})
    }
  }

  render() {

    const gigTiles = this.gigs && Object.keys(this.postsByDate).sort((a, b) => b - a).map(year => {
      return <React.Fragment key={year}>
        <Divider backgroundColor={theme.default.highlightColor} color="white" sticky>{year}</Divider>
        <FlexGridContainer>
          {Object.keys(this.postsByDate[year]).sort((a, b) => b - a).map(month => {
            return <React.Fragment key={month}>
                {this.postsByDate[year][month].map((node) => <GigTile node={node} key={node.fields.slug}/>)}
            </React.Fragment>
          })}
        </FlexGridContainer>
      </React.Fragment>
    })

    const blogTiles = this.blogs && this.blogs.map(({node}) => {
      const coverImage = node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid
      return (
        <Tile
          key={node.fields.slug}
          title={node.frontmatter.title}
          subtitle={node.excerpt}
          image={coverImage}
          label={node.frontmatter.date}
          href={node.fields.slug}
        />
      )
    })

    return (
      <Layout
        location={this.props.location}
        description={this.pageDescription}
        image={this.cover && this.cover.src}
        title={`${this.post.frontmatter.title} | ${this.siteTitle}`}
        hideBrand={this.state.scrolled}
        hideNav={this.state.scrolled}
        headerContent={this.state.scrolled && <a href="#top" title="Scroll to top"><h1 className="semi-big">{this.post.frontmatter.title}</h1></a>}
      >
        <Banner title={this.post.frontmatter.title} backgroundImage={this.cover} background={this.background} customContent={(
            <><ZoopUpWrapper title="BACK TO ARTISTS ☝" href={this.parent.href}><p>☝ Back to {this.parent.title} ☝</p><MdKeyboardArrowUp/></ZoopUpWrapper></>
          )}>
          <HorizontalNav>
            {this.post.frontmatter.facebook && <li><a className="button" href={this.post.frontmatter.facebook}>Facebook</a></li>}
            {this.post.frontmatter.bandcamp && <li><a className="button" href={this.post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {this.post.frontmatter.soundcloud && <li><a className="button" href={this.post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {this.post.frontmatter.Website && <li><a className="button" href={this.post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Tabs>
          <button className={this.state.openTab === "gigs" && "active"} onClick={() => this.setState({openTab: "gigs"})}>Gigs ({this.gigs.length})</button>
          {this.blogs && this.blogs.length > 0 && <button className={this.state.openTab === "blogs" && "active"} onClick={() => this.setState({openTab: "blogs"})}>Blogs ({this.blogs.length})</button>}
        </Tabs>
          {this.state.openTab === "gigs" && gigTiles}
          {this.state.openTab === "blogs" && <FlexGridContainer>{blogTiles}</FlexGridContainer>}
      </Layout>
    )
  }
}

export default ContentByEntityTemplate