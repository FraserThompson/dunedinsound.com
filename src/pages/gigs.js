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
    this.allPosts = data.gigsByDate.group.slice().reverse() //because for some reason it returns it ascending order

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
  //    - A list of posts wrapped by year and month
  // Do this in one reduce for performance (albeit slightly worse readability)
  sortPosts = (posts) => {
    return posts.reduce((obj, group, index) => {

      const previousYearAndMonth = index - 1 >= 0 ? posts[index - 1].fieldValue.split(",") : false
      const previousYear = previousYearAndMonth && previousYearAndMonth[0]
      const previousMonth = previousYearAndMonth && previousYearAndMonth[1]

      const yearAndMonth = group.fieldValue.split(",")
      const year = yearAndMonth[0]
      const month = yearAndMonth[1]

      if (year != previousYear) {
        obj.menuItems.push({year: year, months: [month]});
        obj.posts.push({year: year, months: [{month: month, posts: group.edges}]})
      } else {
        obj.menuItems[obj.menuItems.length - 1].months.push(month);
        if (month != previousMonth) {
          obj.posts[obj.posts.length - 1].months.push({month: month, posts: group.edges});
        } else {
          obj.posts[obj.posts.length - 1].months[obj.posts[obj.posts.length - 1].months.length - 1].posts.push(group.edges);
        }
      }

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
    const sortedPosts = this.sortPosts(this.state.filteredPosts)

    return (
      <Layout
        location={this.props.location} description={this.siteDescription}
        title={`Gigs | ${this.siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<>
            <SidebarNav left>
              <ul id="sidebarNav">
                {sortedPosts.menuItems.map(({year, months}) =>
                  <li key={year}>
                    <a onClick={(e) => this.scrollTo(e, year)} href={`#${year}`}><strong>{year}</strong></a>
                    <ul>
                      {months.map(month => {
                        const className = `${year}-${month}`
                        return <li key={month}><a onClick={(e) => this.scrollTo(e, year)} href={`#${className}`}>{month}</a></li>
                      })}
                    </ul>
                  </li>
                )}
              </ul>
            </SidebarNav>
            <Search placeholder="Search gigs" toggleSidebar={this.toggleSidebar} filter={this.filter}/>
          </>
        }
      >
        <PageContent>
          {sortedPosts.posts.map(({year, months}) =>
            <section key={year} id={year}>
              {
                months.map(({month, posts}) => {
                  const id = `${year}-${month}`
                  return <section key={id} id={id}>
                    {posts.map(({node}, index) => <GigTile key={index} height="30vh" node={node}/>)}
                  </section>
                })
              }
            </section>
          )}
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
    gigsByDate: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}}) {
      group(field: fields___yearAndMonth) {
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
