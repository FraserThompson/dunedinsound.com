import React, { useState, useCallback, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'
import World from '../components/World'

const Page = ({ data, location }) => {
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

  const speak = useCallback((text) => {
    const msg = new SpeechSynthesisUtterance()
    msg.voiceURI = 'native'
    msg.volume = 1
    msg.rate = 0.1
    msg.pitch = Math.floor(Math.random() * (2 - 0 + 1))
    msg.text = text
    msg.lang = 'en-US'
    speechSynthesis.speak(msg)
  })

  const thingHover = useCallback((node) => {
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
      <div className="background">
        <GatsbyImage style={{ height: '100%', width: '100%', opacity: '0.6' }} image={hoveredNode && getImage(hoveredNode.frontmatter.cover)} alt="" />
      </div>
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
    <Layout location={location} description={siteDescription} hideNav={true} title={`VAULT SESSIONS | ${siteTitle}`} overrideBackgroundColor="white">
      <World
        perspective={perspective}
        lights={lights}
        animated={true}
        backContent={backContent}
        bottomContent={bottomContent}
        topContent={topContent}
        leftContent={hoveredNode && <Description dangerouslySetInnerHTML={{ __html: hoveredNode.html }}></Description>}
      ></World>
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
    allBlogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }, filter: { fields: { type: { eq: "vaultsessions" } } }) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
  }
`
const Logo = styled.div`
  margin: 0 auto;
  position: absolute;
  top: ${(props) => props.position == 'top' && '0px'};
  bottom: ${(props) => props.position == 'bottom' && '0px'};
  z-index: 2;
  width: 100%;
  img {
    opacity: 1;
    width: 100%;
  }
`

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  > a {
    display: block;
    width: 100%;
    transition: background-color 0.3s ease-in-out;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1;
    h2 {
      text-transform: uppercase;
      color: #282828;
      font-family: monospace;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
      cursor: crosshair;
      h2 {
        color: black;
      }
    }
  }
`

const Description = styled.div`
  color: white;
  font-family: monospace;
  font-size: 2.5em;
  height: 100%;
  display: flex;
  p {
    margin-top: auto;
    margin-bottom: auto;
  }
`

export default Page
