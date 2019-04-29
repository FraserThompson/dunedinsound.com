// Tile.js
// A cool tile.
// Props
//  - href: Path to link to
//  - label
//  - title
//  - subtitle
//  - image
//  - children (optional)
//  - width (optional): Width of the tile
//  - textColor (optional)
//  - height (optional): Defaults to 500px
//  - shadowBottom(optional) : Whether to show a shadow on the bottom


import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import BackgroundImage from './BackgroundImage'
import Content from './Content'
import { rhythm } from '../utils/typography'
import { lighten } from 'polished';

const Container = styled.div`
  background: #40E0D0;
  background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);
  color: ${props => props.theme.textColor};
  position: relative;
  height: ${props => props.height ? props.height : "500px"};
  width: ${props => props.width};
  overflow: hidden;
  h1,h2,h3,h4 {
    text-shadow: 1px 1px #000;
  }

  a {
    &:hover, &:focus {
      h4 {
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &.active {
      background-color: ${props => props.theme.foregroundColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }
  }

`

const Label = styled.span`
  position: absolute;
  background: black;
  margin-right: -0.8em;
  margin-top: -0.8em;
  color: ${props => props.textColor};
  z-index: 5;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  text-orientation: upright;
  writing-mode: vertical-rl;

  top: ${rhythm(0.5)};
  left: 0px;
`

const TitleWrapper = styled.div`
  z-index: 5;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: ${props => props.shadowBottom && "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 40%)"};
  height: 100%;
  display: flex;
  ${Content} {
    margin-top: auto;
    margin-left: 0;
    .title {
      margin-bottom: ${rhythm(0.5)};
    }
    .subtitle {
      margin: 0px;
      line-height: 0.9;
    }
  }
`

class Tile extends React.Component {

  render() {

    return (
      <Container {...this.props} className="tile">
        <Link to={this.props.href} style={{display: "block", width: "100%", height: "100%"}}>
          {this.props.label && <Label><small>{this.props.label}</small></Label>}
          {this.props.image && <BackgroundImage image={this.props.image}/>}
          <TitleWrapper shadowBottom={this.props.title || this.props.subtitle}>
            <Content>
              {this.props.title && <h4 className="title">{this.props.title}</h4>}
              {this.props.subtitle && <p className="subtitle"><small>{this.props.subtitle}</small></p>}
            </Content>
            {this.props.children}
          </TitleWrapper>
        </Link>
      </Container>
    )
  }
}

export default Tile
