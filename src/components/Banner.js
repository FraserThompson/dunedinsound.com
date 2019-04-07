import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';

const DefaultBannerHeight = "60vh";

const BannerWrapper = styled.div`
	background: #00a8c5;
	background: -webkit-linear-gradient(right,#00a8c5,#d74177);
	background: -moz-linear-gradient(right,#00a8c5,#d74177);
	background: linear-gradient(right,#00a8c5,#d74177);
  height: ${props => props.height ? props.height : DefaultBannerHeight};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > * {
    z-index: 1;
  }
`
const BannerText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
  max-width: 60vw;

  h1 {
    color: ${props => props.theme.contrastColor};
  }

  .center-content {
    padding-top: ${rhythm(1)};
    position: relative;
  }

`

class Banner extends React.Component {
  render() {
    return (
      <BannerWrapper className="banner" height={this.props.height}>
        {this.props.background && this.props.background}
        {this.props.backgroundImage && <BackgroundImage fluid={this.props.backgroundImage} />}
        <BannerText>
          {this.props.title && <h1 className="big">{this.props.title}</h1>}
          {this.props.children &&
            <div className="center-content">
              {this.props.children}
            </div>
          }
        </BannerText>
        {this.props.customContent}
      </BannerWrapper>
    )
  }
}

export default Banner
