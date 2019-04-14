import React from 'react'
import styled from "styled-components"
import YouTube from 'react-youtube';

const YouTubeWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    grid-column: ${props => props.odd ? "col-start 4 / span 6" : null};
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`


class YouTubeResponsive extends React.Component {

  render() {
    return <YouTubeWrapper odd={this.props.odd}>
      <YouTube {...this.props} />
    </YouTubeWrapper>
  }

}

export default YouTubeResponsive
