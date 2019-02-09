import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';

class Tile extends React.Component {

  render() {

    const Container = styled.div`
      background-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.textColor};
      position: relative;
      height: 500px;
    `

    const Label = styled.span`
    `

    const TitleWrapper = styled.div`
      z-index: 5;
      position: absolute;
      bottom: 0px;
    `

    return (
      <Container>
        <Link to={this.props.href}>
          <Label>{this.props.label}</Label>
          {this.props.image && <BackgroundImage fluid={this.props.image}/>}
          <TitleWrapper>
            <h1>{this.props.title}</h1>
            <p>{this.props.subtitle}</p>
          </TitleWrapper>
        </Link>
      </Container>
    )
  }
}

export default Tile
