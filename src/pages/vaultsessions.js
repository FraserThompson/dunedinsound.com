import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'
import World from '../components/World'
import { SiteHead } from '../components/SiteHead'
import { graphqlGroupToObject } from '../utils/helper'

const Page = ({ data, location }) => {
  const [lights, setLights] = useState('off')
  const [hoveredNode, setHoveredNode] = useState(false)
  const [perspective, setPerspective] = useState('300px')

  const posts = data.allVaultsessions.nodes
  const covers = useMemo(() => graphqlGroupToObject(data.covers.group))

  useEffect(() => {
    hoveredNode && speak(hoveredNode.title)
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
        <GatsbyImage style={{ height: '100%', width: '100%', opacity: '0.6' }} image={hoveredNode && getImage(covers[hoveredNode.fields.fileName][0])} alt="" />
      </div>
      {posts.map((node) => (
        <Link key={node.fields.slug} onMouseOver={() => thingHover(node)} onMouseOut={thingUnhover} to={node.fields.slug}>
          <article>
            <h2>{node.title}</h2>
          </article>
        </Link>
      ))}
      <Link to={'https://www.youtube.com/@syrupbois'} style={{ paddingTop: '1.5em' }}>
        <article>
          <h3>friends of the vault</h3>
        </article>
      </Link>
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

  const leftContent = <Description>{hoveredNode.description}</Description>

  return (
    <Layout location={location} hideNav={true} overrideBackgroundColor="white">
      <World
        perspective={perspective}
        lights={lights}
        animated={true}
        backContent={backContent}
        bottomContent={bottomContent}
        topContent={topContent}
        leftContent={hoveredNode && leftContent}
      ></World>
    </Layout>
  )
}

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
    h3 {
      text-align: center;
      color: #410000;
      font-family: serif;
      font-size: 6vh;
      @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
        font-size: 6vh;
      }
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
      cursor: crosshair;
      h2 {
        color: black;
      }
      h3 {
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

export const Head = (params) => <SiteHead title={'VAULT SESSIONS'} {...params} />

export const pageQuery = graphql`
  query {
    allVaultsessions: allVaultsessionYaml(sort: { date: ASC }) {
      nodes {
        ...VaultsessionFrontmatter
      }
    }
    covers: allFile(filter: { sourceInstanceName: { eq: "media" }, fields: { mediaDir: { eq: "vaultsession" } }, name: { eq: "cover" } }) {
      group(field: { fields: { parentDir: SELECT } }) {
        fieldValue
        nodes {
          ...MediumImage
        }
      }
    }
    logo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    logoMono: file(name: { eq: "vslogo_mono" }) {
      publicURL
    }
  }
`

export default Page
