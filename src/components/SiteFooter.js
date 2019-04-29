import { StaticQuery, graphql } from 'gatsby'
import React from 'react'
import { Link } from 'gatsby'
import Divider from './Divider'
import styled from "styled-components"
import Img from 'gatsby-image'
import { rhythm } from '../utils/typography'

const Container = styled.div`
  background-color: ${props => props.theme.primaryColor};
  min-height: ${props => props.theme.footerHeight};
`

const Content = styled.div`
  color: ${props => props.theme.textColor};
  text-align: center;
  padding: ${rhythm(1)};
  #footer-social-icons {
    > a {
      margin: ${rhythm(0.5)};
    }
  }
`

class SiteFooter extends React.Component {

  render() {

    return (
      <StaticQuery
        query={graphql`
          query {
            facebook: file(name: { eq: "fb-icon" }) {
              childImageSharp {
                fixed(width: 30, height: 30) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            instagram: file(name: { eq: "instagram-icon" }) {
              childImageSharp {
                fixed(width: 30, height: 30) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            youtube: file(name: { eq: "youtube-icon" }) {
              childImageSharp {
                fixed(width: 30, height: 30) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        `}
        render={data =>
          <Container>
            <Divider/>
            <Content>
              <p>Obscure and unofficial media from gigs in Dunedin, New Zealand since 2014. <Link to="/page/info/">More Info</Link></p>
              <p>This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a></p>
              <div id="footer-social-icons">
                <a title="Facebook" target="_blank" href="https://facebook.com/dunedinsound/"><Img fixed={data.facebook.childImageSharp.fixed}/></a>
                <a title="Instagram" target="_blank" href="https://instagram.com/dunedinsound/"><Img fixed={data.instagram.childImageSharp.fixed}/></a>
                <a title="YouTube" target="_blank" href="https://www.youtube.com/channel/UCcou-Lq6d-AMOkg2UKVEhhg"><Img fixed={data.youtube.childImageSharp.fixed}/></a>
              </div>
            </Content>
          </Container>
        }
      />
    )
  }
}

export default SiteFooter
