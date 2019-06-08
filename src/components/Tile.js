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
import styled from '@emotion/styled'
import BackgroundImage from './BackgroundImage'
import Content from './Content'
import { rhythm } from '../utils/typography'
import { lighten } from 'polished';

const Container = styled.a`
  background: #40E0D0;
  background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);
  color: ${props => props.theme.textColor};
  position: relative;
  display: block;
  height: ${props => props.height ? props.height : "500px"};
  width: ${props => props.width};
  overflow: hidden;
  h1,h2,h3,h4 {
    text-shadow: 1px 1px #000;
    transition: color 0.3s ease-in-out;
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
  background-color: ${props => props.theme.contrastColor};
  z-index: 5;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  left: 0px;
  top: 0px;
  small {
    color: ${lighten(0.2, "black")};
  }
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
      <Container {...this.props}  className="tile">
        {this.props.label && <Label><small>{this.props.label}</small></Label>}
        {this.props.image && <BackgroundImage sizes={this.props.sizes} image={this.props.image}/>}
        <TitleWrapper shadowBottom={this.props.title || this.props.subtitle}>
          <Content>
            {this.props.title && <h4 className="title">{this.props.title}</h4>}
            {this.props.subtitle && <p className="subtitle"><small>{this.props.subtitle}</small></p>}
          </Content>
          {this.props.children}
        </TitleWrapper>
      </Container>
    )
  }
}

export default Tile
