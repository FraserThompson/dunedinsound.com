import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';

const BannerWrapper = styled.div`
  height: ${props => props.height ? props.height : props.theme.bannerHeight};
  overflow: hidden;
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
    color: ${props => props.theme.contrastColor};
    position: sticky;
    top: 5px;
    z-index: 12;
  }

  .center-content {
    margin: auto;
    position: relative;
  }

`

class Banner extends React.Component {
  render() {
    return (
      <BannerWrapper height={this.props.height}>
        {this.props.background && this.props.background}
        {this.props.backgroundImage && <BackgroundImage fluid={this.props.backgroundImage} />}
        <BannerText>
          {this.props.title && <h1 className="big">{this.props.title}</h1>}
          <div className="center-content">
            {this.props.children}
          </div>
        </BannerText>
        {this.props.customContent}
      </BannerWrapper>
    )
  }
}

export default Banner
