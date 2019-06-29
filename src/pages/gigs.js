import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { postFilter } from  '../utils/helper'
import GigTile from '../components/GigTile'
import 'gumshoejs/src/js/gumshoe/_closest.polyfill'
import 'gumshoejs/src/js/gumshoe/_customEvent.polyfill'
import Gumshoe from 'gumshoejs/src/js/gumshoe/gumshoe'
import MenuButton from '../components/MenuButton';
import { MdMenu } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroller';
import Divider from '../components/Divider';
import LoadingSpinner from '../components/LoadingSpinner';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const PageContent = styled.div`
  padding-left: 0px;

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }
`

class Gigs extends React.Component {

  constructor(props) {
    super(props)

    const { data } = this.props
    this.siteTitle = data.site.siteMetadata.title
    this.siteDescription = data.site.siteMetadata.description
    this.allPosts = data.gigsByDate.group.slice().reverse() //because for some reason it returns it ascending order

    this.sidebarRef = React.createRef()

    const {menuItems, posts} = this.sortPosts(this.allPosts)
    this.allPostsSorted = posts
    this.allMenuItems = menuItems

    this.state = {
      searchQuery: "",
      sidebarOpen: true,
      menuItems,
      pageUpTo: 1,
      postsSorted: posts
    }
  }

  initGumshoe() {
    this.gumshoe && this.gumshoe.destroy()
    this.gumshoe = null
    this.gumshoe = new Gumshoe('#sidebarNav a',
      {
        offset: 120,
        nested: true,
        nestedClass: 'active-parent'
      }
    )
  }

  componentDidMount() {
    this.initGumshoe()
  }

  componentDidUpdate = (prevProps, prevState) => {
    // scroll to after render to ensure it's loaded
    if (this.state.scrollTo && this.state.scrollTo !== prevState.scrollTo) {
      this.scrollTo(this.state.scrollTo)
    }
    if (this.state.postsSorted !== prevState.postsSorted || this.state.pageUpTo !== prevState.pageUpTo) {
      this.state.postsSorted.length !== 0 && this.initGumshoe()
    }
  }

  componentWillUnmount() {
    this.gumshoe.destroy()
  }

  filter = (searchInput) => {
    // We destroy and remake it on each time because setup doesnt seem to work right
    this.gumshoe && this.gumshoe.destroy()
    this.gumshoe = null

    if (typeof window !== `undefined`) window.scrollTo(0, 0)

    if (!searchInput || searchInput.length == 0) {
      this.setState({postsSorted: this.allPostsSorted, pageUpTo: 1, menuItems: this.allMenuItems})
    } else {
      const filteredPosts = postFilter(searchInput, this.allPosts)
      const {menuItems, posts} = this.sortPosts(filteredPosts)
      this.setState({postsSorted: posts, pageUpTo: 1, menuItems})
    }
  }

  // Turn the posts sorted by years into two things:
  //    - A list of years and unique months for each year
  //    - A list of posts wrapped by year and month
  // Do this in one reduce for performance (albeit slightly worse readability)
  sortPosts = (posts) => {
    return posts.reduce((obj, group, index) => {

      const previousYear = index - 1 >= 0 && posts[index - 1].fieldValue.substring(0, 4)
      const previousMonth = index - 1 >= 0 && posts[index - 1].fieldValue.substring(4)

      const year = group.fieldValue.substring(0, 4)
      const month = group.fieldValue.substring(4)

      const monthName = monthNames[parseInt(month)]

      if (year != previousYear) {
        obj.menuItems.push({year: year, count: group.edges.length, months: [monthName]})
        obj.posts.push({year: year, months: [{month: monthName, posts: group.edges}]})
      } else {
        obj.menuItems[obj.menuItems.length - 1].months.push(monthName)
        obj.menuItems[obj.menuItems.length - 1].count = obj.menuItems[obj.menuItems.length - 1].count + group.edges.length
        if (month != previousMonth) {
          obj.posts[obj.posts.length - 1].months.push({month: monthName, posts: group.edges})
        } else {
          obj.posts[obj.posts.length - 1].months[obj.posts[obj.posts.length - 1].months.length - 1].posts.push(group.edges)
        }
      }

      return obj

    }, { menuItems: [], posts: [] } )
  }

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  scrollTo = (anchor) => {
    const element = document.getElementById(anchor)
    if (typeof window !== `undefined`) {
      const y = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, y - 90)
    }
  }

  menuItemClick = (e, anchor, yearIndex) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({sidebarOpen: true, pageUpTo: yearIndex + 1 > this.state.pageUpTo ? yearIndex + 1 : this.state.pageUpTo, scrollTo: anchor})
  }

  loadMore = (index) => {
    this.setState({pageUpTo: index + 1})
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {
    return (
      <Layout
        location={this.props.location} description={this.siteDescription}
        title={`Gigs | ${this.siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={
          <>
            <SidebarNav toggle={this.toggleSidebar} button={<MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton>} open={this.state.sidebarOpen} sidebarRef={this.sidebarRef} left>
              <ul id="sidebarNav">
                {this.state.menuItems.map(({year, months, count}, yearIndex) =>
                  <li key={year}>
                    <a onClick={(e) => this.menuItemClick(e, year, yearIndex)} href={`#${year}`}><strong>{year}</strong> <span className="label">({count})</span></a>
                    <ul>
                      {months.map(month => {
                        const className = `${year}-${month}`
                        return <li key={month}><a onClick={(e) => this.menuItemClick(e, className, yearIndex)} href={`#${className}`}>{month}</a></li>
                      })}
                    </ul>
                  </li>
                )}
              </ul>
            </SidebarNav>
            <Search placeholder="Search gigs by title, artist, or venue..." filter={this.filter}/>
          </>
        }
      >
        <PageContent>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.pageUpTo < this.allPostsSorted.length}
            loader={<div key={0} style={{width: "100%", height: "20vh", display: "flex", justifyContent: "center", alignContent: "center"}}><LoadingSpinner/></div>}
          >
            {this.state.postsSorted.map(({year, months}, index) =>
              index < this.state.pageUpTo &&
                <section key={year} id={year}>
                  <Divider><strong>{year}</strong></Divider>
                  {
                    months.map(({month, posts}) => {
                      const id = `${year}-${month}`
                      return <section key={id} id={id}>
                        {posts.map(({node}) => <GigTile key={node.fields.slug} height="30vh" node={node} imageSizes={{xs: 12, sm: 8, lg: 8}}/>)}
                      </section>
                    })
                  }
                </section>
            )}
          </InfiniteScroll>
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
