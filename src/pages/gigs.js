import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { MdMenu } from 'react-icons/md'
import MenuButton from '../components/MenuButton'
import { postFilterDebounced, sortByMonth } from  '../utils/helper'
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

    this.state = {
      filteredPosts: data.allMarkdownRemark.edges,
      sidebarOpen: true
    }
  }

  componentDidMount() {
    this.gumshoe = new Gumshoe('#sidebarNav a',
      {
        offset: 60,
        nested: true,
        nestedClass: 'active-parent'
      }
    )
  }

  componentWillUnmount() {
    // this throws an error in the current version of gumshoe, when it's fixed i'll uncomment it
    //this.gumshoe.destroy()
  }

  filter = async (e) => {
    const searchInput = e.target.value.toLowerCase()

    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allMarkdownRemark.edges
      this.setState({filteredPosts})
    } else {
      const filteredPosts = await postFilterDebounced(searchInput, this.props.data.allMarkdownRemark.edges)
      this.setState({filteredPosts})
    }
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {

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

    const menuItems = Object.keys(postsByDate).sort((a, b) => b - a).map(year => {
      return (
        <li key={year}>
          <a href={`#${year}`}><strong>{year}</strong></a>
          <ul>
            {Object.keys(postsByDate[year]).sort(sortByMonth).map(month => {
              const className = `${year}-${month}`
              return <li key={month}><a href={`#${className}`}>{month}</a></li>
            })}
          </ul>
        </li>
      )
    })

    return (
      <Layout
        location={this.props.location} description={this.siteDescription}
        title={`Gigs | ${this.siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<><MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton><Search placeholder="Search gigs" toggleSidebar={this.toggleSidebar} filter={this.filter}/></>}>
        <PageContent>
          {Object.keys(postsByDate).sort((a, b) => b - a).map((year) => {

            const monthPosts = Object.keys(postsByDate[year]).sort((a, b) => b - a).map(month => {

              const posts = postsByDate[year][month]
              const id = `${year}-${month}`

              return <section key={id} id={id}>
                {posts.map((node, index) => <GigTile key={index} height="30vh" node={node}/>)}
              </section>

            })

            return <section key={year} id={year}>
              {monthPosts}
            </section>

            })}
        </PageContent>
        <SidebarNav open={this.state.sidebarOpen} left>
          <ul id="sidebarNav">
            {menuItems}
          </ul>
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
  }
`
