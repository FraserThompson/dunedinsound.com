import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';
import { transparentize } from 'polished';

const BannerWrapper = styled.div`
  height: ${props => props.height ? props.height : "50vh"};
  position: relative;
  > * {
    z-index: 1;
  }
`
const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height:100%;
  margin: 0 auto;
  text-align: center;
  max-width: 60vw;

  h1 {
    margin-top: ${rhythm(1)};
    justify-self: flex-start;
    font-size: ${rhythm(1.5)};
    text-align: center;
    color: #fff;
    text-transform: uppercase;
    position: sticky;
    top: 0px;
    z-index: 12;
  }

  div {
    margin: auto;
    position: relative;
    bottom: ${rhythm(1)}
  }

`

class Banner extends React.Component {
  render() {
    return (
      <BannerWrapper height={this.props.height}>
        {this.props.background && this.props.background}
        {this.props.backgroundImage && <BackgroundImage fluid={this.props.backgroundImage} />}
        <BannerText>
          <h1>{this.props.title}</h1>
          <div>
            {this.props.children}
          </div>
        </BannerText>
      </BannerWrapper>
    )
  }
}

export default Banner
