import React, { useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import YouTube from 'react-youtube'
import { rhythm } from '../utils/typography'
import { FaRegPlayCircle } from 'react-icons/fa'

export default React.memo(({ videoId, odd, vanilla, getPlayerTarget }) => {
  const APIKey = 'AIzaSyBUlBQysAAKfuSmm4Z92VBMAE9lli3zL58'
  const [clicked, setClicked] = useState(false)
  const [title, setTitle] = useState('')
  const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)

  useEffect(() => {
    getTitle()
  }, [videoId])

  const getTitle = async () => {
    let response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${APIKey}`)
    let data = await response.json()
    if (data.items && data.items.length) {
      const thumbnail = data.items[0].snippet.thumbnails.maxres ? data.items[0].snippet.thumbnails.maxres.url : data.items[0].snippet.thumbnails.high.url
      const title = data.items[0].snippet.title
      setTitle(title)
      setThumbnail(thumbnail)
    }
  }

  const onReady = useCallback(
    (event) => {
      event.target.setPlaybackQuality('hd720')
      event.target.playVideo() // this doesn't seem to work
      getPlayerTarget && getPlayerTarget(event.target)
    },
    [getPlayerTarget]
  )

  return (
    <YouTubeWrapper odd={odd}>
      {!clicked && !vanilla && (
        <PlaceholderContent>
          <a onClick={() => setClicked(true)}>
            <img src={thumbnail} width="100%" height="auto" />
            <div className="overlay">
              <h4>{title}</h4>
              <FaRegPlayCircle />
            </div>
          </a>
          <WatchOnYoutubeLink href={`https://www.youtube.com/watch?v=${videoId}`} rel="noopener" target="_blank" title="Watch video on YouTube">
            <small>Watch on YouTube</small>
          </WatchOnYoutubeLink>
        </PlaceholderContent>
      )}
      {(clicked || vanilla) && (
        <YouTube
          videoId={videoId}
          onReady={onReady}
          opts={{ host: 'https://www.youtube-nocookie.com', rel: 0, modestbranding: 1, playerVars: { autoplay: 1 } }}
        />
      )}
    </YouTubeWrapper>
  )
})

const YouTubeWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;
  overflow: hidden;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    grid-column: ${(props) => (props.odd ? 'col-start 4 / span 6' : null)};
  }

  iframe,
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const WatchOnYoutubeLink = styled.a`
  padding: ${rhythm(0.5)};
  position: absolute;
  bottom: 0;
  left: 0;
`

const PlaceholderContent = styled.div`
  a {
    cursor: pointer;
    transform: scale(1, 1);
    svg {
      transition: transform 0.1s ease-in-out;
    }
    &:hover,
    &:active {
      outline: 0;
      svg {
        transform: scale(1.1, 1.1);
        color: ${(props) => props.theme.foregroundColor};
      }
    }
  }

  .overlay {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 10%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    h4 {
      color: white;
      padding: ${rhythm(0.5)};
      position: absolute;
      top: 0px;
      left: 0px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-wrap: none;
    }

    svg {
      font-size: 8em;
      color: white;
    }
  }
`
