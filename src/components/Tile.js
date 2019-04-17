import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import BackgroundImage from './BackgroundImage';
import Content from './Content';
import { rhythm } from '../utils/typography';

const Container = styled.div`
  background: #40E0D0;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: ${props => props.theme.textColor};
  position: relative;
  height: ${props => props.height ? props.height : "500px"};
  width: ${props => props.width};
  overflow: hidden;
  h1,h2,h3,h4 {
    text-shadow: 1px 1px #000;
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
  right: ${rhythm(0.5)};
`

const TitleWrapper = styled.div`
  z-index: 5;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 40%);
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
          {this.props.image && <BackgroundImage fluid={this.props.image}/>}
          <TitleWrapper>
            <Content>
              <h4 className="title">{this.props.title}</h4>
              {this.props.subtitle && <p className="subtitle"><small>{this.props.subtitle}</small></p>}
              {this.props.customContent}
            </Content>
          </TitleWrapper>
        </Link>
      </Container>
    )
  }
}

export default Tile
