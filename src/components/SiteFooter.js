import React from 'react'
import { Link } from 'gatsby'
import Divider from './Divider';
import styled from "styled-components"
import { rhythm } from '../utils/typography';

class SiteFooter extends React.Component {

  render() {

    const Container = styled.div`
      background-color: ${props => props.theme.headerColor};
      min-height: ${props => props.theme.footerHeight};
    `

    const Content = styled.div`
      color: ${props => props.theme.textColor};
      text-align: center;
      padding: ${rhythm(1)};
    `

    return (
      <Container>
        <Divider />
        <Content>
          <p>Obscure and unofficial media from gigs in Dunedin, New Zealand since 2014. <a href="/about/">Wow cool, tell me more!</a></p>
          <p>This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a></p>
        </Content>
      </Container>
    )
  }
}

export default SiteFooter
