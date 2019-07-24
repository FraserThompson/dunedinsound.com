import React, { useState, useCallback, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from '@emotion/styled'
import World from '../components/World'

export default ({ data, location }) => {
  const [lights, setLights] = useState('off')
  const [hoveredNode, setHoveredNode] = useState(false)
  const [perspective, setPerspective] = useState('300px')

  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description
  const posts = data.allBlogs.edges

  useEffect(() => {
    hoveredNode && speak(hoveredNode.frontmatter.title)
    !hoveredNode && speechSynthesis.cancel()
  }, [hoveredNode])

  const speak = useCallback(text => {
    const msg = new SpeechSynthesisUtterance()
    msg.voiceURI = 'native'
    msg.volume = 1
    msg.rate = 0.1
    msg.pitch = Math.floor(Math.random() * (2 - 0 + 1))
    msg.text = text
    msg.lang = 'en-US'
    speechSynthesis.speak(msg)
  })

  const thingHover = useCallback(node => {
    setHoveredNode(node)
    setLights('on')
    setPerspective('320px')
  }, [])

  const thingUnhover = useCallback(() => {
    setHoveredNode(false)
    setPerspective('300px')
    setLights('off')
  })

  const backContent = (
    <Posts>
      {posts.map(({ node }) => (
        <Link key={node.fields.slug} onMouseOver={() => thingHover(node)} onMouseOut={thingUnhover} to={node.fields.slug}>
          <article>
            <h2>{node.frontmatter.title}</h2>
          </article>
        </Link>
      ))}
    </Posts>
  )

  const bottomContent = (
    <Logo position="bottom">
      <img style={{ filter: 'invert(80%)' }} src={lights == 'off' ? data.logoMono.publicURL : data.logo.publicURL} />
    </Logo>
  )

  const topContent = (
    <Logo position="top">
      <img style={{ filter: 'invert(80%)' }} src={lights == 'off' ? data.logoMono.publicURL : data.logo.publicURL} />
    </Logo>
  )
  return (
    <Layout location={location} description={siteDescription} hideBrandOnMobile={true} title={`VAULT SESSIONS | ${siteTitle}`} overrideBackgroundColor="white">
      <World perspective={perspective} lights={lights} animated={true} backContent={backContent} bottomContent={bottomContent} topContent={topContent}>
        <WallArt>{hoveredNode && <Img fluid={hoveredNode.frontmatter.cover.childImageSharp.fluid} />}</WallArt>
      </World>
    </Layout>
  )
}

const Posts = styled.div`
  article {
    border-top: 2px solid darkcyan;
    border-bottom: 2px solid darkcyan;
    transition: filter 0.3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.8);
    h2 {
      text-transform: uppercase;
      color: #282828;
    }
    &:hover {
      filter: invert(1);
    }
  }
`

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
    allBlogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }, filter: { fields: { type: { eq: "vaultsessions" } } }) {
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
  top: 20%;
  z-index: 3;
  transform-origin: right center;
  width: 500px;
  height: 100%;
`

export const Logo = styled.div`
  margin: 0 auto;
  position: absolute;
  top: ${props => props.position == 'top' && '0px'};
  bottom: ${props => props.position == 'bottom' && '0px'};
  z-index: 2;
  width: 100%;
  img {
    opacity: 1;
    width: 100%;
  }
`
