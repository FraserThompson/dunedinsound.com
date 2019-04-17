import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Tile from '../components/Tile';
import {nodeTypeToHuman} from '../utils/helper';
import GridContainer from '../components/GridContainer';
import GigTile from '../components/GigTile';

const HomePageGridContainer = styled(GridContainer)`
  > div:nth-child(1) {
    grid-column: span 12;
  }
  > div:nth-child(2) {
    grid-column: span 12;
  }
  > div:nth-child(3) {
    grid-column: span 12;
  }
  > div:nth-child(4) {
    display: initial;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    > div:nth-child(1) {
      grid-column: span 8;
    }
    > div:nth-child(2) {
      grid-column: span 4;
    }
    > div:nth-child(3) {
      grid-column: span 12;
    }
    > div:nth-child(4) {
      display: none;
    }
  }
`

class Homepage extends React.Component {

  constructor(props) {
    super(props)
    const { data } = this.props

    this.siteTitle = data.site.siteMetadata.title
    this.siteDescription = data.site.siteMetadata.description
    this.posts = data.allMarkdownRemark.edges
    this.firstNode = this.posts.find(({node}) => node.fields.type === "gigs").node

    this.imageCountByGig = data.imageCountByGig['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

    this.audioCountByGig = data.audioCountByGig['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

  }
  render() {

    return (
      <Layout description={this.siteDescription} location={this.props.location} title={this.siteTitle}>
        <HomePageGridContainer>
          <div>
            <GigTile
              title={"LATEST GIG: " + this.firstNode.frontmatter.title}
              node={this.firstNode}
              height="60vh"
              imageCount={this.imageCountByGig[this.firstNode.fields.parentDir]}
              audioCount={this.audioCountByGig[this.firstNode.fields.parentDir]}
            />
          </div>
          <div>
            {this.posts.slice(4, 6).map(({ node }) => {
              const title = nodeTypeToHuman(node.fields.type).toUpperCase() + ": " + node.frontmatter.title || node.fields.slug
              if (node.fields.type === "gigs") {
                return <GigTile title={"GIG: " + node.frontmatter.title} node={node} height="30vh" imageCount={this.imageCountByGig[node.fields.parentDir]} audioCount={this.audioCountByGig[node.fields.parentDir]} key={node.fields.slug}/>
              } else {
                return <Tile
                  key={node.fields.slug}
                  title={title}
                  image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                  label={node.frontmatter.date}
                  height={"30vh"}
                  href={node.fields.slug}
                />
              }
            })}
          </div>
          <GridContainer>
            {this.posts.slice(1, 4).map(({ node }, index) => {
              const title = nodeTypeToHuman(node.fields.type).toUpperCase() + ": " + node.frontmatter.title || node.fields.slug
              if (node.fields.type === "gigs") {
                return <GigTile title={"GIG: " + node.frontmatter.title} node={node} height="30vh" imageCount={this.imageCountByGig[node.fields.parentDir]} audioCount={this.audioCountByGig[node.fields.parentDir]} key={node.fields.slug}/>
              } else {
                return <Tile
                  key={node.fields.slug}
                  title={title}
                  image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                  label={node.frontmatter.date}
                  height={"30vh"}
                  href={node.fields.slug}
                />
              }
            })}
          </GridContainer>

          <Tile
            title="This way to more gigs 😲"
            height={"10vh"}
            href="/gigs"
          />
        </HomePageGridContainer>
      </Layout>
    )
  }
}

export default Homepage

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allMarkdownRemark(limit: 7, sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { regex: "/gigs|blog$/"}}}) {
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
