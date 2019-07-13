import React, { useState, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from '@emotion/styled'
import World from '../components/World'
import { debounce } from 'throttle-debounce'

export default ({data, location}) => {

  const [lights, setLights] = useState("off")
  const [hoveredNode, setHoveredNode] = useState(false)
  const [perspective, setPerspective] = useState("300px")
  const [postElements, setPostElements] = useState(null)

  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description
  const posts = data.allBlogs.edges

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance();
    msg.voiceURI = 'native'
    msg.volume = 1
    msg.rate = 0.1
    msg.pitch = Math.floor(Math.random() * (2 - 0 + 1));
    msg.text = text
    msg.lang = 'en-US'

    speechSynthesis.speak(msg)
  };

  const speakDebounced = debounce(1000, speak)

  const thingHover = (node) => {
    setHoveredNode(node)
    setLights("on")
    speakDebounced(node.frontmatter.title)
  }

  const thingUnhover = () => {
    setHoveredNode(false)
    setLights("off")
  }

  useEffect(() => {
    setPostElements(posts.map(({node}) =>
      <article key={node.fields.slug}>
        <Link onMouseOver={() => thingHover(node)} onMouseOut={thingUnhover} to={node.fields.slug}>
          <h2>{node.frontmatter.title}</h2>
        </Link>
      </article>
    ))
  }, [data])

  return (
    <Layout location={location} description={siteDescription} title={`VAULT SESSIONS | ${siteTitle}`} overrideBackgroundColor="white">
      <World perspective={perspective} lights={lights}>
        <Logo position="top">
          <img style={{filter: "invert(80%)"}} src={lights == "off" ? data.logoMono.publicURL : data.logo.publicURL}/>
        </Logo>
        <Logo position="bottom">
          <img style={{filter: "invert(80%)"}} src={lights == "off" ? data.logoMono.publicURL : data.logo.publicURL}/>
        </Logo>
        <div className="posts">
        {postElements}
        </div>
        <WallArt>
          {hoveredNode && <Img fluid={hoveredNode.frontmatter.cover.childImageSharp.fluid}/>}
        </WallArt>
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

const WallArt = styled.div`
  transition: all 0.2s ease-in-out;
  transform: rotateY(-90deg);
  position: absolute;
  right: 50px;
  z-index: 3;
  transform-origin: right center;
  width: 500px;
`

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
