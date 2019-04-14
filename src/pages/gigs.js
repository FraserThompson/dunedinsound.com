import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Scrollspy from 'react-scrollspy'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Search from '../components/Search';
import SidebarNav from '../components/SidebarNav';
import { MdMenu } from 'react-icons/md';
import MenuButton from '../components/MenuButton';

const PageContent = styled.div`
  padding-left: 0px;

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }

`

class Gigs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filteredPosts: this.props.data.allMarkdownRemark.edges,
      sidebarOpen: true
    }
  }

  filter = (e) => {
    const searchInput = e.target.value;
    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allMarkdownRemark.edges;
      this.setState({filteredPosts})
    } else {
      const filteredPosts = this.props.data.allMarkdownRemark.edges.filter(({node}) => {
        const titleResult = node.frontmatter.title.toLowerCase().includes(searchInput)
        const artistResult = node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(searchInput)
        return titleResult || artistResult
      })
      this.setState({filteredPosts})
    }
  }

  sortByMonth = (a, b) => {
    const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return allMonths.indexOf(a) > allMonths.indexOf(b)
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {

    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    // sort our filtered posts by year and month
    const postsByDate = this.state.filteredPosts.reduce((object, {node}) => {
      const date = new Date(node.frontmatter.date)
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-us', { month: 'long' });
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
            {Object.keys(postsByDate[year]).sort(this.sortByMonth).map(month => {
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
        location={this.props.location} description={siteDescription}
        title={`Gigs | ${siteTitle}`}
        hideBrand={true}
        hideFooter={true}
        headerContent={<><MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton><Search toggleSidebar={this.toggleSidebar} filter={this.filter}/></>}>
        <PageContent>
          <ReactCSSTransitionGroup transitionName="popin" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
            {Object.keys(postsByDate).sort((a, b) => b - a).map((year) => {

              const monthPosts = Object.keys(postsByDate[year]).sort(this.sortByMonth).map(month => {

                const posts = postsByDate[year][month]
                const id = `${year}-${month}`

                return <section key={id} id={id}>
                  {posts.map(node => {
                    const title = node.frontmatter.title || node.fields.slug
                    const artists = node.frontmatter.artists.map(artist => artist.name).join(", ")
                    return (
                      <Tile
                        key={node.fields.slug}
                        title={title}
                        subtitle={artists}
                        image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                        label={node.frontmatter.date}
                        height="30vh"
                        href={node.fields.slug}
                      />
                    )
                  })}
                </section>

              })

              return <section key={year} id={year}>
                {monthPosts}
              </section>

            })}
          </ReactCSSTransitionGroup>
        </PageContent>
        <SidebarNav width="15vw" open={this.state.sidebarOpen} left>
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
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM YYYY")
            title
            artists { name }
            cover {
              childImageSharp {
                fluid(maxWidth: 1600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
