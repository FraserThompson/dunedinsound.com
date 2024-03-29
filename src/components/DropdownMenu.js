// PlayerMenu.js
// A menu used by Player.js

import React, { useState, useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { FaBars } from 'react-icons/fa'
import Menu from './Menu'
import { scrollTo } from '../utils/helper'
import { rhythm } from '../utils/typography'

export default React.memo(({ list, history, menuTitle, children, top }) => {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (history) {
      const unlisten = history.listen((location) => handleURLChange(location.location))
      return () => unlisten()
    }
  }, [])

  const handleURLChange = (location) => {
    if (location.hash) {
      const newSelectedId = location.hash.substring(1)
      setSelectedItem(newSelectedId)
    }
  }

  const toggleMenu = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setOpen(!open)
    },
    [open]
  )

  const select = useCallback((e, machineName) => {
    scrollTo(e, machineName)
    setOpen(false)
  }, [])

  return (
    <DropdownWrapper top={top}>
      <DropdownLink open={open} aria-haspopup="true" onClick={toggleMenu}>
        {children}
        <div>
          {menuTitle}
          <FaBars />
        </div>
      </DropdownLink>
      <DropdownMenu open={open} direction={'down'}>
        {list.map((item, index) => (
          <li key={index} className={selectedItem == item.machineName ? 'active' : ''}>
            <ItemTitle className="menu-title" onClick={(e) => select(e, item.machineName)} href={`#${item.machineName}`}>
              {item.title}
            </ItemTitle>
            {item.children}
          </li>
        ))}
      </DropdownMenu>
    </DropdownWrapper>
  )
})

const DropdownWrapper = styled.div`
  position: fixed;
  width: 100%;
  top: ${(props) => props.top || props.theme.headerHeightMobile};
  z-index: 7;
  right: 0;
  height: ${(props) => props.theme.subheaderHeight};

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    top: ${(props) => props.top || props.theme.headerHeight};
  }

  a.menu-title {
    display: inline !important;
  }
`

const ItemTitle = styled.a`
  font-weight: bold;
`

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: ${(props) => props.direction == 'up' && '100%'};
  top: ${(props) => props.direction == 'down' && '100%'};
  right: 0 !important;
  left: auto;
  max-height: 80vh;
  overflow-y: auto;
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.open ? '1' : '0')};
  transform: ${(props) =>
    props.open ? 'translateY(0)' : props.direction == 'up' ? `translateY(${props.theme.headerHeight})` : `translateY(-${props.theme.headerHeight})`};
  pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
  transition-property: visibility, opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);

  width: 100%;

  li {
    display: flex;
    align-items: center;
  }

  a.menu-title {
    width: 100%;
    min-height: ${rhythm(1)};
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    width: auto;
  }
`

const DropdownLink = styled.a`
  display: block;
  width: 100%;
  cursor: pointer;

  > div {
    height: ${(props) => props.theme.subheaderHeight};
    display: flex;
    align-items: center;
    color: ${(props) => (props.open ? props.theme.secondaryColor : 'black')};
    float: right;
  }
`
