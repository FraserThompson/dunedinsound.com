import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import BackgroundImage from './BackgroundImage';
import Content from './Content';
import { rhythm } from '../utils/typography';

const Container = styled.div`
	background: #00a8c5;
	background: -webkit-linear-gradient(right,#00a8c5,#d74177);
	background: -moz-linear-gradient(right,#00a8c5,#d74177);
	background: linear-gradient(right,#00a8c5,#d74177);
  color: ${props => props.theme.textColor};
  position: relative;
  height: ${props => props.height ? props.height : "500px"};
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
