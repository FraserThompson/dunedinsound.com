import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { postFilter, dateStrToDateObj } from  '../utils/helper'
import GigTile from '../components/GigTile'
import 'gumshoejs/src/js/gumshoe/_closest.polyfill'
import 'gumshoejs/src/js/gumshoe/_customEvent.polyfill'
import Gumshoe from 'gumshoejs/src/js/gumshoe/gumshoe'

const PageContent = styled.div`
  padding-left: 0px;

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 250px;
  }
`

class Gigs extends React.Component {

  constructor(props) {
    super(props)

    const { data } = this.props
    this.siteTitle = data.site.siteMetadata.title
    this.siteDescription = data.site.siteMetadata.description
    this.allPosts = data.allMarkdownRemark.group.slice().reverse() //because for some reason it returns it ascending order

    this.state = {
      searchQuery: "",
      filteredPosts: this.allPosts
    }
  }

  initGumshoe() {
    this.gumshoe = new Gumshoe('#sidebarNav a',
      {
        offset: 90,
        nested: true,
        nestedClass: 'active-parent'
      }
    )
  }

  componentDidMount() {
    this.initGumshoe()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.filteredPosts !== prevState.filteredPosts) {
      this.state.filteredPosts.length !== 0 && this.initGumshoe()
    }
  }

  componentWillUnmount() {
    this.gumshoe.destroy()
  }

  filter = (searchInput) => {
    // We destroy and remake it on each time because setup doesnt seem to work right
    this.gumshoe && this.gumshoe.destroy()
    this.gumshoe = null

    if (!searchInput || searchInput.length == 0) {
      var filteredPosts = this.allPosts
    } else {
      var filteredPosts = postFilter(searchInput, this.allPosts)
    }

    this.setState({filteredPosts})
  }

  // Turn the posts sorted by years into two things:
  //    - A list of years and unique months for each year
  //    - A list of gig tiles wrapped by year and month
  // Do this in one reduce for performance (albeit slightly worse readability)
  constructElementsFromPosts = (posts) => {
    return posts.reduce((obj, group) => {

      const year = group.fieldValue

      const monthsListElements = new Map()
      const monthsPostElements = new Map()

      for (const {node} of group.edges) {

        const dateObj = dateStrToDateObj(node.frontmatter.date)
        const month = dateObj.toLocaleString('en-GB', { month: 'long' })

        // Add the month to the list
        if(!monthsListElements.has(month)){
          const className = `${year}-${month}`
          monthsListElements.set(month, <li key={month}><a onClick={(e) => this.scrollTo(e, year)} href={`#${className}`}>{month}</a></li>)
        }

        // Add the post to the list
        if(!monthsPostElements.has(month)) {
          monthsPostElements.set(month, [])
        }
        monthsPostElements.get(month).push(node)

      }

      const sidebarList = (
        <li key={year}>
          <a onClick={(e) => this.scrollTo(e, year)} href={`#${year}`}><strong>{year}</strong></a>
          <ul>
            {Array.from(monthsListElements, ([key, value]) => value)}
          </ul>
        </li>
      )

      const yearSection = <section key={year} id={year}>
        {
          Array.from(monthsPostElements, ([month, posts]) => {
            const id = `${year}-${month}`
            return <section key={id} id={id}>
              {posts.map((node, index) => <GigTile key={index} height="30vh" node={node}/>)}
            </section>
          })
        }
      </section>

      obj.menuItems.push(sidebarList)
      obj.posts.push(yearSection)

      return obj

    }, { menuItems: [], posts: [] } )
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  scrollTo = (e, anchor) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById(anchor).scrollIntoView({behavior: "smooth"})
  }

  render() {
    const elements = this.constructElementsFromPosts(this.state.filteredPosts)

    return (
      <Layout
        location={this.props.location} description={this.siteDescription}
        title={`Gigs | ${this.siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<>
            <SidebarNav left>
              <ul id="sidebarNav">
                {elements.menuItems.map(item => item)}
              </ul>
            </SidebarNav>
            <Search placeholder="Search gigs" toggleSidebar={this.toggleSidebar} filter={this.filter}/>
          </>
        }
      >
        <PageContent>
          {elements.posts.map(item => item)}
        </PageContent>
      </Layout>
    )
  }
}

export default Gigs

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}}) {
      group(field:fields___year) {
        fieldValue
        edges {
          node {
            ...GigTileFrontmatter
          }
        }
      }
    }
  }
`
