import React from 'react'
import { Link, graphql } from 'gatsby'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Tile from '../components/Tile';
import { rhythm } from '../utils/typography';
import Menu from '../components/Menu';
import Scrollspy from 'react-scrollspy'

const SidebarNav = styled(Menu)`
  background-color: ${props => props.theme.headerColor};
  transition: all .2s ease;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  width: ${props => props.width || "15vw"};
  top: ${props => props.theme.headerHeight};
  left: 0;
  z-index: 10;
  padding: 0;
  margin: 0;
  .year, .months {
    padding-left: ${rhythm(0.5)};
  }
  .year {
    border-left: 2px solid ${props => props.theme.highlightColor2};
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`

const HeaderSearch = styled.input`
  width: 100%;
`

const PageContent = styled.div`
  padding-left: 15vw;
`

class Gigs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filteredPosts: this.props.data.allMarkdownRemark.edges
    }
  }

  filter = (e) => {
    const searchInput = e.target.value;
    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allMarkdownRemark.edges;
      this.setState({filteredPosts})
    } else {
      const filteredPosts = this.props.data.allMarkdownRemark.edges.filter(({node}) => node.frontmatter.title.toLowerCase().includes(searchInput))
      this.setState({filteredPosts})
    }
  }

  sortByMonth = (a, b) => {
    const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return allMonths.indexOf(a) > allMonths.indexOf(b)
  }

  render() {

    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    const postsByDate = this.state.filteredPosts.reduce((object, {node}) => {
      const date = new Date(node.frontmatter.date)
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-us', { month: 'long' });
      object[year] || (object[year] = {})
      object[year][month] || (object[year][month] = [])
      object[year][month].push(node)
      return object
    }, {})

    return (
      <Layout location={this.props.location} title={siteTitle} headerContent={<HeaderSearch type="text" onChange={this.filter}/>}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <PageContent>
          {Object.keys(postsByDate).sort((a, b) => b - a).map((year) => {

            const monthPosts = Object.keys(postsByDate[year]).sort(this.sortByMonth).map(month => {

              const posts = postsByDate[year][month]
              const id = year + "-" + month

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
                      height="200px"
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
        </PageContent>
        <SidebarNav>
        <Scrollspy items={ ['2019', '2019-March', '2018', '2018-March'] } currentClassName="active">
          {Object.keys(postsByDate).sort((a, b) => b - a).map((year) => {
            const month_names = Object.keys(postsByDate[year]).sort(this.sortByMonth).map((month) => <li key={month}><a href={"#" + year + "-" + month}>{month}</a></li>)
            return (
              <li key={year}>
                <a className="year" href={"#" + year}>{year}</a>
                {month_names}
              </li>
            )
          })}
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
