// PlayerMenu.js
// A menu used by Player.js

import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { MdKeyboardArrowDown, MdExitToApp } from 'react-icons/md'
import { scale, rhythm } from '../../utils/typography'
import Menu from '../../components/Menu'
import { lighten } from 'polished'
import { Link } from 'gatsby'

export default React.memo(({ list, selected, selectCallback, direction = 'up', width, height, fullWidthMobile, textAlign, children }) => {
  const [open, setOpen] = useState(false)

  const toggleMenu = useCallback(
    e => {
      e.stopPropagation()
      e.preventDefault()
      setOpen(!open)
    },
    [open]
  )

  const select = useCallback(
    (e, item, index) => {
      selectCallback && selectCallback(e, item, index)
      setOpen(false)
    },
    [selectCallback]
  )

  return (
    <>
      <DropdownLink open={open} aria-haspopup="true" onClick={toggleMenu}>
        {children}
        <span className="icon">
          <MdKeyboardArrowDown />
        </span>
      </DropdownLink>
      <DropdownMenu width={width} textAlign={textAlign} height={height} open={open} direction={direction} fullWidthMobile={fullWidthMobile}>
        {list.map((item, index) => (
          <li key={index} className={selected == index ? 'active' : ''} onClick={e => select(e, item, index)}>
            {item.title}
            <span className="goToArtist">
              {item.details && (
                <Link title={`More gigs from ${item.title}`} to={item.details.fields.slug}>
                  <MdExitToApp />
                </Link>
              )}
            </span>
          </li>
        ))}
      </DropdownMenu>
    </>
  )
})

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: ${props => props.direction == 'up' && '100%'};
  top: ${props => props.direction == 'down' && '100%'};
  right: 0 !important;
  left: auto;
  max-height: 80vh;
  overflow-y: auto;
  visibility: ${props => (props.open ? '1' : '0')};
  opacity: ${props => (props.open ? '1' : '0')};
  transform: ${props =>
    props.open ? 'translateY(0)' : props.direction == 'up' ? `translateY(${props.theme.headerHeight})` : `translateY(-${props.theme.headerHeight})`};
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  transition-property: visibility, opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);

  text-align: ${props => (props.fullWidthMobile ? 'center' : 'auto')};
  width: ${props => (props.fullWidthMobile ? '100%' : 'auto')};

  .goToArtist {
    position: absolute;
    right: 0px;
    top: 0px;
    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
      float: right;
      position: static;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    text-align: auto;
    width: auto;
  }
`

const DropdownLink = styled.a`
  width: 100%;
  cursor: pointer;

  .icon {
    color: ${props => props.open && props.theme.secondaryColor};
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 1.8em;
  }
`
