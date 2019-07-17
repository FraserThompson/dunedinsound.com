import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'

export default React.memo(({ tracklist, playerTarget, fullDownloadLink }) => {
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
    <Tracklist>
      <h3>Tracklist (click to seek)</h3>
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
          <h3 className="coolText">🌟FULL MP3 DOWNLOAD🌟</h3>
        </a>
      )}
    </Tracklist>
  )
})

const Tracklist = styled.ul`
  transition: all 0.2s ease-in-out;
  transform: rotateY(90deg);
  position: absolute;
  left: 0;
  z-index: 3;
  transform-origin: left center;
  background: rgba(0, 0, 0, 0);
  &:hover {
    z-index: 10;
    transform: rotateY(20deg);
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
  }
`
