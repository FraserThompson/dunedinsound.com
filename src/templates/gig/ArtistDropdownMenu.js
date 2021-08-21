// PlayerMenu.js
// A menu used by Player.js

import React, { useState, useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { FaBars } from 'react-icons/fa'
import Menu from '../../components/Menu'
import { Link } from 'gatsby'
import { rhythm } from '../../utils/typography'
import { scrollTo } from '../../utils/helper'

export default React.memo(({ list, history, height, children }) => {
  const [open, setOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)

  useEffect(() => {
    const unlisten = history.listen((location) => handleURLChange(location.location))
    return () => unlisten()
  }, [])

  const handleURLChange = (location) => {
    if (location.hash) {
      const newSelectedArtistId = location.hash.substring(1)
      setSelectedArtist(newSelectedArtistId)
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

  const select = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <DropdownWrapper>
      <DropdownLink open={open} aria-haspopup="true" onClick={toggleMenu}>
        {children}
        <FaBars />
      </DropdownLink>
      <DropdownMenu height={height} open={open} direction={'down'}>
        {list.map((item, index) => (
          <li key={index} className={selectedArtist == item.details.fields.machine_name ? 'active' : ''}>
            <ArtistTitle onClick={() => select()} onClick={(e) => scrollTo(e, item.details.fields.machine_name)} href={`#${item.details.fields.machine_name}`}>
              {item.title}
            </ArtistTitle>
            <div>
              {item.details.frontmatter.bandcamp && (
                <a href={item.details.frontmatter.bandcamp} target="_blank">
                  <small>Bandcamp</small>
                </a>
              )}
              {item.details.frontmatter.facebook && (
                <a href={item.details.frontmatter.facebook} target="_blank">
                  <small>Facebook</small>
                </a>
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

const ArtistTitle = styled.a`
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
  visibility: ${(props) => (props.open ? '1' : '0')};
  opacity: ${(props) => (props.open ? '1' : '0')};
  transform: ${(props) =>
    props.open ? 'translateY(0)' : props.direction == 'up' ? `translateY(${props.theme.headerHeight})` : `translateY(-${props.theme.headerHeight})`};
  pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
  transition-property: visibility, opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);

  width: 100%;

  a {
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

  svg {
    color: ${(props) => (props.open ? props.theme.secondaryColor : 'black')};
    width: 30px;
    height: 30px;
    float: right;
  }
`
