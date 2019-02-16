import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';

class Banner extends React.Component {
  render() {
    const Banner = styled.div`
    height: 80vh;
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
      width: 80vw;
      padding: 10px;
      z-index: 1;
      background: rgba(0,0,0,.8);
      h1 {
        font-size: ${rhythm(1.5)};
        text-align: center;
        color: #fff;
        text-transform: uppercase;
      }
    `

    return (
      <Banner>
        <BackgroundImage fluid={this.props.backgroundImage} />
        <BannerText>
          {this.props.children}
        </BannerText>
      </Banner>
    )
  }
}

export default Banner
