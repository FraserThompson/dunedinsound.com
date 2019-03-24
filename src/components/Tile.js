import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import BackgroundImage from './BackgroundImage';
import Content from './Content';
import { rhythm } from '../utils/typography';

const Container = styled.div`
  background-color: black;
  color: ${props => props.theme.textColor};
  position: relative;
  height: ${props => props.height ? props.height : "500px"};
`

const Label = styled.span`
  position: relative;
  background-color: #fff;
  color: #000;
  z-index: 8;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  border-radius: .25em;
  padding: ${rhythm(0.1)};
  top: ${rhythm(0.5)};
  left: ${rhythm(0.5)};
`

const TitleWrapper = styled.div`
  z-index: 5;
  position: absolute;
  bottom: 0px;
`

class Tile extends React.Component {

  render() {

    return (
      <Container height={this.props.height}>
        <Link to={this.props.href} style={{display: "block", width: "100%", height: "100%"}}>
          {this.props.label && <Label><small>{this.props.label}</small></Label>}
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
