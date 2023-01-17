import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { rhythm } from '../utils/typography'

export default () => {
  const data = useStaticQuery(graphql`
    query {
      facebook: file(name: { eq: "fb-icon" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 50, height: 50)
        }
      }
      instagram: file(name: { eq: "instagram-icon" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 50, height: 50)
        }
      }
      youtube: file(name: { eq: "youtube-icon" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 50, height: 50)
        }
      }
    }
  `)

  return (
    <Container>
      <Content>
        <p>
          Obscure and unofficial media from gigs in Dunedin, New Zealand since 2014. <br />
          <Link to="/page/info/">More Info</Link>
        </p>
        <div id="footer-social-icons">
          <a title="Facebook" target="_blank" rel="noopener" href="https://facebook.com/dunedinsound/">
            <GatsbyImage image={getImage(data.facebook)} alt="Facebook" style={{ display: 'inline-block' }} />
          </a>
          <a title="Instagram" target="_blank" rel="noopener" href="https://instagram.com/dunedinsound/">
            <GatsbyImage image={getImage(data.instagram)} alt="Instagram" style={{ display: 'inline-block' }} />
          </a>
          <a title="YouTube" target="_blank" rel="noopener" href="https://www.youtube.com/channel/UCcou-Lq6d-AMOkg2UKVEhhg">
            <GatsbyImage image={getImage(data.youtube)} alt="YouTube" style={{ display: 'inline-block' }} />
          </a>
        </div>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  background-color: ${(props) => props.theme.primaryColor};
  min-height: ${(props) => props.theme.footerHeight};
  position: fixed;
  bottom: ${(props) => props.theme.headerHeightMobile};
  width: 100%;
  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    bottom: 0;
  }
`

const Content = styled.div`
  color: ${(props) => props.theme.textColor};
  text-align: center;
  padding: ${rhythm(1)};
  padding-top: 2em;
  #footer-social-icons {
    > a {
      margin: ${rhythm(0.5)};
    }
  }
`
