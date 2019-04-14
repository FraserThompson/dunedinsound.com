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
  background-color: #fff;
  color: #000;
  z-index: 8;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  border-radius: .25em;
  padding-left: ${rhythm(0.1)};
  padding-right: ${rhythm(0.1)};
  top: ${rhythm(0.5)};
  left: ${rhythm(0.5)};
`

const TitleWrapper = styled.div`
  z-index: 5;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
  position: absolute;
  bottom: 0px;
  h3 {
    margin-bottom: ${rhythm(0.5)}
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
              <h3>{this.props.title}</h3>
              {this.props.subtitle && <p style={{marginBottom: "0px"}}><small>{this.props.subtitle}</small></p>}
            </Content>
          </TitleWrapper>
        </Link>
      </Container>
    )
  }
}

export default Tile
