import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import styled from '@emotion/styled'
import World from '../components/World'

const Logo = styled.div`
  margin: 0 auto;
  position: absolute;
  top: ${props => props.position == "top" && "0px"};
  bottom: ${props => props.position == "bottom" && "0px"};
  z-index: 2;
  width: 100%;
  transform: ${props => props.position == "top" ? "rotateX(-90deg)" : "rotateX(90deg);"};
  transform-origin: ${props => props.position == "top" ? "center top" : "center bottom"};
  img {
    transform: translateZ(-50px);
    opacity: 1;
    width: 100%;
  }
`

export default ({data, location}) => {

  const [lights, setLights] = useState("off")
  const [perspective, setPerspective] = useState("300px")

  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description
  const posts = data.allBlogs.edges

  const postElements = posts.map(({node}) =>
    <article key={node.fields.slug}>
      <Link onMouseOver={() => setLights("on")} onMouseOut={() => setLights("off")} to={node.fields.slug}><h1>{node.frontmatter.title}</h1></Link>
    </article>
  )

  return (
    <Layout location={location} description={siteDescription} title={`VAULT SESSIONS | ${siteTitle}`} overrideBackgroundColor="white">
      <World perspective={perspective} lights={lights}>
        {lights == "off" && <Logo position="top">
          <img style={{filter: "invert(80%)"}} src={data.logoMono.publicURL}/>
        </Logo>}
        {lights == "on" && <Logo position="top">
          <img src={data.logo.publicURL}/>
        </Logo>}
        {lights == "off" && <Logo position="bottom">
          <img style={{filter: "invert(80%)"}} src={data.logoMono.publicURL}/>
        </Logo>}
        {lights == "on" && <Logo position="bottom">
          <img src={data.logo.publicURL}/>
        </Logo>}
        {postElements}
      </World>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    logo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    logoMono: file(name: { eq: "vslogo_mono" }) {
      publicURL
    }
    allBlogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }, filter: {fields: {type: { eq: "vaultsessions"}}}) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
  }
`
