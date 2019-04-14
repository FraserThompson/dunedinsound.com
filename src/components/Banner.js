import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage';

const DefaultBannerHeight = "80vh";

const BannerWrapper = styled.div`
  background: #40E0D0;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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
  background: rgba(0,0,0,.8);
  padding: ${rhythm(1)};

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
      <BannerWrapper className="banner" {...this.props}>
        {this.props.backgroundImage && <BackgroundImage fluid={this.props.backgroundImage} />}
        {(this.props.title || this.props.children) &&
          <BannerText>
            {this.props.title && <h1 className="big">{this.props.title}</h1>}
            {this.props.children &&
              <div className="center-content">
                {this.props.children}
              </div>
            }
          </BannerText>
        }
        {this.props.customContent}
      </BannerWrapper>
    )
  }
}

export default Banner
