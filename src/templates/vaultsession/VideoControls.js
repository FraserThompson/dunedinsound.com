import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'

export default React.memo(({ tracklist, playerTarget, fullDownloadLink, onHover }) => {
  const [playerSeconds, setPlayerSeconds] = useState(0)

  const seekVideoTo = useCallback(
    time => {
      playerTarget && playerTarget.seekTo(time, true)
      setPlayerSeconds(time)
    },
    [playerTarget]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerSeconds(playerTarget.getCurrentTime())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tracklist onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <h3 className="title">Tracklist (click to seek)</h3>
      {tracklist.map((video, index) => {
        const nextTrackSeconds = index + 1 < tracklist.length && tracklist[index + 1].seconds
        return (
          <Track key={video.link} active={playerSeconds >= video.seconds && (nextTrackSeconds ? playerSeconds < nextTrackSeconds : true)}>
            <a className="trackTitle" onClick={() => seekVideoTo(video.seconds)}>
              {video.title}
            </a>{' '}
            <a target="_blank" href={`https://youtube.com/watch?v=${video.link}`}>
              <small>(Video)</small>
            </a>
          </Track>
        )
      })}
      {fullDownloadLink && (
        <a title="FULL MP3 DOWNLOAD" target="_blank" href={fullDownloadLink}>
          <h3 className="coolText">🌟DOWNLOAD MP3🌟</h3>
        </a>
      )}
    </Tracklist>
  )
})

const Tracklist = styled.ul`
  transition-property: z-index, transform, background, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  position: absolute;
  left: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0);
  transform-origin: left center;
  font-family: monospace;
  .title {
    font-family: monospace;
  }
  &:hover {
    z-index: 13;
    box-shadow: 0 0 30px purple;
    transform: rotateY(-80deg);
    background: rgba(0, 0, 0, 1);
  }
`

const Track = styled.li`
  a {
    cursor: pointer;
  }
  .trackTitle {
    color: ${props => props.active && props.theme.secondaryColor};
    font-weight: ${props => props.active && 'bold'};
    font-family: monospace;
  }
`
