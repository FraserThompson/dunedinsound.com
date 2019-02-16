import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import BackgroundImage from './BackgroundImage';
import Content from './Content';

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

class Tile extends React.Component {

  render() {

    return (
      <Container>
        <Link to={this.props.href}>
          <Label>{this.props.label}</Label>
          {this.props.image && <BackgroundImage fluid={this.props.image}/>}
          <TitleWrapper>
            <Content>
              <h1>{this.props.title}</h1>
              <p>{this.props.subtitle}</p>
            </Content>
          </TitleWrapper>
        </Link>
      </Container>
    )
  }
}

export default Tile
