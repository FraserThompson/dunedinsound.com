// PlayerMenu.js
// A menu used by Player.js

import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { MdPlaylistPlay, MdFileDownload } from 'react-icons/md'
import { scale } from '../utils/typography'
import Menu from './Menu'
import MenuButton from './MenuButton'
import { lighten } from 'polished'

export default React.memo(({ list, selected, selectCallback, seekCallback }) => {
  const [open, setOpen] = useState(false)

  const toggleMenu = useCallback(e => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(!open)
  }, [])

  const select = useCallback(index => {
    selectCallback && selectCallback(index)
    setOpen(false)
  }, [])

  return (
    <div>
      <DropdownMenu open={open}>
        {list.map((item, index) => (
          <div key={item.title}>
            <li className={selected == index ? 'active' : ''} onClick={() => select(index)}>
              <span id="title">
                {index + 1}. {item.title}
              </span>
              <span className="listButton">
                <a title={'Download MP3: ' + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank">
                  <MdFileDownload />
                </a>
              </span>
            </li>
            {item.tracklist && (
              <ul className="tracklist">
                {item.tracklist.map(item => {
                  return (
                    <li key={item.title} onClick={() => seekCallback(item.time, index, true)}>
                      {item.title} ({item.time})
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </DropdownMenu>
      <MenuButton className={open ? 'active' : ''} open={open} aria-haspopup="true" onClick={toggleMenu}>
        <MdPlaylistPlay />
      </MenuButton>
    </div>
  )
})

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: 100%;
  right: 0 !important;
  left: auto;
  max-height: 80vh;
  overflow-y: auto;
  visibility: ${props => (props.open ? '1' : '0')};
  opacity: ${props => (props.open ? '1' : '0')};
  transform: ${props => (props.open ? 'translateY(0)' : `translateY(${props.theme.headerHeight})`)};
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  .title {
    ${scale(1)}
  }
  > li:hover:not(.active) {
    background-color: ${props => lighten(0.1, props.theme.backgroundColor)};
  }
  .tracklist {
    margin-top: 0px;
    margin-bottom: 0px;
    li {
      ${scale(-0.5)};
    }
  }
`
