import React from 'react'
import styled from '@emotion/styled'
import { scale, rhythm } from '../utils/typography'
import { theme } from '../utils/theme'
import { Link } from 'gatsby'
import { MdKeyboardArrowUp, MdKeyboardArrowLeft } from 'react-icons/md'

export default React.memo(({ to = '/gigs/', gigSlug, gigYear, type = 'left' }) => {
  const destination = to.split('/').filter(item => item)
  const destinationText = `Back to ${destination.length > 1 ? destination[1].replace(/\_/g, ' ') : destination[0]}`

  return type == 'left' ? (
    <BackButtonLeft destinationText={destinationText}>
      <Link style={{ position: 'absolute', left: '0px' }} title={destinationText} to={to} state={{ gigFrom: { slug: gigSlug, year: gigYear } }}>
        <MdKeyboardArrowLeft />
      </Link>
    </BackButtonLeft>
  ) : (
    <BackButtonUp>
      <Link title={destinationText} to={to} state={{ gigFrom: { slug: gigSlug, year: gigYear } }}>
        <p>☝ {destinationText} ☝</p>
        <MdKeyboardArrowUp />
      </Link>
    </BackButtonUp>
  )
})

const BackButtonUp = styled.span`
  ${scale(4)};
  color: ${props => props.theme.textColor};
  position: absolute;
  text-align: center;
  top: -${rhythm(1)};
  transition: all 300ms ease-in-out;
  opacity: 0.5;
  display: none !important;

  p {
    ${scale(0.5)};
    margin-bottom: -${rhythm(1)};
    text-transform: uppercase;
  }

  &:hover {
    top: 0px;
    opacity: 1;
  }

  @media screen and (min-width: ${theme.default.breakpoints.xs}) {
    display: inline-block !important;
  }
`

const BackButtonLeft = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  > a {
    display: flex;
    align-items: center;
    svg {
      height: ${props => props.theme.headerHeight};
      font-size: ${rhythm(1.8)};
      color: ${props => props.theme.textColor};
    }
    &:hover {
      svg {
        color: ${props => props.theme.secondaryColor};
      }
      ::after {
        content: '${props => props.destinationText}';
      }
    }
  }
`
