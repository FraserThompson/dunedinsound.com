import React from 'react'
import styled from '@emotion/styled'
import { scale, rhythm } from '../utils/typography'
import { theme } from '../utils/theme'
import { Link } from 'gatsby'
import { FaChevronUp, FaChevronLeft } from 'react-icons/fa'

export default React.memo(({ to = '/gigs/', type = 'left' }) => {
  const pathComponents = to && typeof to == `string` && to.split('/').filter((item) => item)
  const destination = pathComponents && pathComponents.length > 1 ? pathComponents[1].replace(/\_/g, ' ') : pathComponents[0] || 'gigs'
  const destinationText = `Back to ${destination}`

  return type == 'left' ? (
    <BackButtonLeft destinationText={destinationText}>
      <Link style={{ position: 'absolute', left: '0px' }} title={destinationText} to={to}>
        <FaChevronLeft />
      </Link>
    </BackButtonLeft>
  ) : (
    <BackButtonUp>
      <Link title={destinationText} to={to}>
        <p>☝ {destinationText} ☝</p>
        <FaChevronUp />
      </Link>
    </BackButtonUp>
  )
})

const BackButtonUp = styled.span`
  ${scale(2)};
  color: ${(props) => props.theme.textColor};
  position: absolute;
  text-align: center;
  top: calc(-1em + 5px);
  transition: all 300ms ease-in-out;
  opacity: 0.5;
  display: none !important;

  p {
    ${scale(0.5)};
    margin-bottom: 5px;
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

    height: ${(props) => props.theme.headerHeightMobile};

    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      height: ${(props) => props.theme.headerHeight};
    }

    svg {
      font-size: ${rhythm(0.8)};
      color: ${(props) => props.theme.textColor};
      @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
        font-size: ${rhythm(1.2)};
      }
    }
    &:hover {
      svg {
        color: ${(props) => props.theme.secondaryColor};
      }
      ::after {
        background-color: ${(props) => props.theme.primaryColor};
        content: '${(props) => props.destinationText}';
      }
    }
  }
`
