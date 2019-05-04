import React from 'react'
import styled from '@emotion/styled'
import YouTube from 'react-youtube'
import { rhythm } from '../utils/typography'
import { MdPlayCircleOutline } from 'react-icons/md';

const YouTubeWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;
  overflow: hidden;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    grid-column: ${props => props.odd ? "col-start 4 / span 6" : null};
  }

  iframe, img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const PlaceholderContent = styled.div`
  a {
    cursor: pointer;
    transform: scale(1,1);
    svg {
      transition: transform 0.1s ease-in-out;
    }
    &:hover, &:active {
      outline: 0;
      svg {
        transform: scale(1.10,1.10);
        color: ${props => props.theme.foregroundColor};
      }
    }
  }

  .overlay {
    background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 10%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .watchOnYoutubeLink {
      padding: ${rhythm(0.5)};
      position: absolute;
      top: 0;
      right: 0;
    }

    h4 {
      color: white;
      padding: ${rhythm(0.5)};
      position: absolute;
      top: 0px;
      left: 0px;
      text-overflow: ellipsis;
      overflow: hidden;
      text-wrap: none;
    }

    svg {
      font-size: 8em;
      color: white;
    }
  }
`

class YouTubeResponsive extends React.Component {

  APIKey = "AIzaSyBUlBQysAAKfuSmm4Z92VBMAE9lli3zL58"

  state = {
    clicked: false,
    title: ""
  }

  getTitle = async () => {
    let response = await fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + this.props.videoId + "&key=" + this.APIKey)
    let data = await response.json()
    this.setState({title: data.items[0].snippet.title})
  }

  componentDidMount = () => {
    this.getTitle()
  }

  render() {
    return <YouTubeWrapper odd={this.props.odd}>
      {!this.state.clicked &&
        <PlaceholderContent>
          <a onClick={() => this.setState({clicked: true})}>
            <img src={`http://i.ytimg.com/vi/${this.props.videoId}/maxresdefault.jpg`} width="100%" height="auto"/>
            <div className="overlay">
              <h4>{this.state.title}</h4>
              <a className="watchOnYoutubeLink" href={"https://www.youtube.com/watch?v=" + this.props.videoId} rel="noopener" target="_blank" title="Watch video on YouTube"><small>Watch on YouTube</small></a>
              <MdPlayCircleOutline/>
            </div>
          </a>
        </PlaceholderContent>
      }
      {this.state.clicked && <YouTube {...this.props} />}
    </YouTubeWrapper>
  }

}

export default YouTubeResponsive
