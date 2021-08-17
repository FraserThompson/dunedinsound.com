// PlayerMenu.js
// A menu used by Player.js

import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { FaChevronRight, FaBars } from 'react-icons/fa'
import Menu from '../../components/Menu'
import { Link } from 'gatsby'
import { rhythm } from '../../utils/typography'

export default React.memo(({ list, selected, selectCallback, direction = 'up', width, height, fullWidthMobile, textAlign, children }) => {
  const [open, setOpen] = useState(false)

  const toggleMenu = useCallback(
    (e) => {
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
    <DropdownWrapper>
      <DropdownLink open={open} aria-haspopup="true" onClick={toggleMenu}>
        {children}
        <FaBars />
      </DropdownLink>
      <DropdownMenu width={width} textAlign={textAlign} height={height} open={open} direction={direction} fullWidthMobile={fullWidthMobile}>
        {list.map((item, index) => (
          <li key={index} className={selected == index ? 'active' : ''}>
            <div onClick={(e) => select(e, item, index)}>{item.title}</div>
            <div>
              {item.details.frontmatter.bandcamp && (
                <Link to={item.details.frontmatter.bandcamp}>
                  <small>Bandcamp</small>
                </Link>
              )}
              {item.details.frontmatter.facebook && (
                <Link to={item.details.frontmatter.facebook}>
                  <small>Facebook</small>
                </Link>
              )}
              <Link to={item.details.fields.slug}>
                <small>Other gigs</small>
              </Link>
            </div>
          </li>
        ))}
      </DropdownMenu>
    </DropdownWrapper>
  )
})

const DropdownWrapper = styled.div`
  position: fixed;
  width: 100%;
  top: ${(props) => props.theme.headerHeightMobile};
  z-index: 7;
  right: 0;
  height: 30px;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    top: ${(props) => props.theme.headerHeight};
  }
`

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: ${(props) => props.direction == 'up' && '100%'};
  top: ${(props) => props.direction == 'down' && '100%'};
  right: 0 !important;
  left: auto;
  max-height: 80vh;
  overflow-y: auto;
  visibility: ${(props) => (props.open ? '1' : '0')};
  opacity: ${(props) => (props.open ? '1' : '0')};
  transform: ${(props) =>
    props.open ? 'translateY(0)' : props.direction == 'up' ? `translateY(${props.theme.headerHeight})` : `translateY(-${props.theme.headerHeight})`};
  pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
  transition-property: visibility, opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);

  text-align: ${(props) => (props.fullWidthMobile ? 'center' : 'auto')};
  width: ${(props) => (props.fullWidthMobile ? '100%' : 'auto')};

  li {
    min-height: ${rhythm(1)};
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    text-align: left;
    width: auto;
  }
`

const DropdownLink = styled.a`
  display: block;
  width: 100%;
  cursor: pointer;

  svg {
    color: ${(props) => (props.open ? props.theme.secondaryColor : 'black')};
    width: 30px;
    height: 30px;
    float: right;
  }
`
