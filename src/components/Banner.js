import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';
import { transparentize } from 'polished';

const BannerWrapper = styled.div`
  height: ${props => props.height ? props.height : "60vh"};
  position: relative;
  > * {
    z-index: 1;
  }
`
const BannerText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  margin: 0 auto;
  text-align: center;
  max-width: 60vw;
  padding: ${rhythm(1)};
  z-index: 1;
  background: ${props => transparentize(0.2, props.theme.headerColor)};
  h1 {
    font-size: ${rhythm(1.5)};
    text-align: center;
    color: #fff;
    text-transform: uppercase;
  }
`

class Banner extends React.Component {
  render() {
    return (
      <BannerWrapper height={this.props.height}>
        {this.props.background && this.props.background}
        {this.props.backgroundImage && <BackgroundImage fluid={this.props.backgroundImage} />}
        <BannerText>
          {this.props.children}
        </BannerText>
      </BannerWrapper>
    )
  }
}

export default Banner
