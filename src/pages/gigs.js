import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Scrollspy from 'react-scrollspy'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { MdMenu } from 'react-icons/md'
import MenuButton from '../components/MenuButton'
import Helper from  '../utils/helper'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import GigTile from '../components/GigTile'

const filter = (needle, haystack) =>
  haystack.filter(({node}) => {
    const titleResult = node.frontmatter.title.toLowerCase().includes(needle)
    const artistResult = node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(needle)
    return titleResult || artistResult
  })

const filterDebounced = AwesomeDebouncePromise(filter, 500);

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

    this.imageCountByGig = data.imageCountByGig['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

    this.audioCountByGig = data.audioCountByGig['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

    this.state = {
      filteredPosts: data.allMarkdownRemark.edges,
      sidebarOpen: true
    }
  }

  filter = async (e) => {
    const searchInput = e.target.value;
    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allMarkdownRemark.edges
      this.setState({filteredPosts})
    } else {
      const filteredPosts = await filterDebounced(searchInput, this.props.data.allMarkdownRemark.edges)
      this.setState({filteredPosts})
    }
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {
    // sort our filtered posts by year and month
    const postsByDate = this.state.filteredPosts.reduce((object, {node}) => {
      const splitDate = node.frontmatter.date.split("-");
      const date = new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0]);
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-GB', { month: 'long' });
      object[year] || (object[year] = {})
      object[year][month] || (object[year][month] = [])
      object[year][month].push(node)
      return object
    }, {})

    // iterate over all our posts to find all the classes they use for scrollspy
    // and to assemble the list for the menu
    let scrollspyYearItems = []
    const menuItems = Object.keys(postsByDate).sort((a, b) => b - a).map(year => {
      let scrollspyMonthItems = []
      scrollspyYearItems.push(year)

      return (
        <li key={year}>
          <a href={`#${year}`}><strong>{year}</strong></a>
          <Scrollspy items={scrollspyMonthItems} currentClassName="active" offset={-60}>
            {Object.keys(postsByDate[year]).sort(Helper.sortByMonth).map(month => {
              const className = `${year}-${month}`
              scrollspyMonthItems.push(className);
              return <li key={month}><a href={`#${className}`}>{month}</a></li>
            })}
          </Scrollspy>
        </li>
      )

    })

    return (
      <Layout
        location={this.props.location} description={this.siteDescription}
        title={`Gigs | ${this.siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<><MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton><Search placeholder="Search gigs"  toggleSidebar={this.toggleSidebar} filter={this.filter}/></>}>
        <PageContent>
          <ReactCSSTransitionGroup transitionName="popin" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
            {Object.keys(postsByDate).sort((a, b) => b - a).map((year) => {

              const monthPosts = Object.keys(postsByDate[year]).sort((a, b) => b - a).map(month => {

                const posts = postsByDate[year][month]
                const id = `${year}-${month}`

                return <section key={id} id={id}>
                  {posts.map(node => <GigTile height="30vh" node={node} imageCount={this.imageCountByGig[node.fields.parentDir]} audioCount={this.audioCountByGig[node.fields.parentDir]}/>)}
                </section>

              })

              return <section key={year} id={year}>
                {monthPosts}
              </section>

            })}
          </ReactCSSTransitionGroup>
        </PageContent>
        <SidebarNav open={this.state.sidebarOpen} left>
          <Scrollspy items={scrollspyYearItems} currentClassName="active-top" offset={-60}>
            {menuItems}
          </Scrollspy>
        </SidebarNav>
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
      edges {
        node {
          ...GigFrontmatter
        }
      }
    }
    imageCountByGig: allFile( filter: {extension: {in: ["jpg", "JPG"]}}) {
      group(field: fields___gigDir) {
        fieldValue
        totalCount
      }
    }
    audioCountByGig: allFile( filter: {extension: {eq: "mp3"}}) {
      group(field: fields___gigDir) {
        fieldValue
        totalCount
      }
    }
  }
`
