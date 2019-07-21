import React from 'react'
import styled from '@emotion/styled'
import { scale, rhythm } from '../utils/typography'
import { theme } from '../utils/theme'
import { Link } from 'gatsby'
import { MdKeyboardArrowUp, MdKeyboardArrowLeft } from 'react-icons/md'

export default React.memo(({ to, gigSlug, gigYear, title, type = 'left' }) =>
  type == 'left' ? (
    <BackButton>
      <Link style={{ position: 'absolute', left: '0px' }} title="Back to Gigs" to={to || '/gigs/'} state={{ gigFrom: { slug: gigSlug, year: gigYear } }}>
        <MdKeyboardArrowLeft />
      </Link>
    </BackButton>
  ) : (
    <Wrapper>
      <Link title={title} to={to || '/gigs/'} state={{ gigFrom: { slug: gigSlug, year: gigYear } }}>
        <p>☝ {title} ☝</p>
        <MdKeyboardArrowUp />
      </Link>
    </Wrapper>
  )
)

const Wrapper = styled.span`
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

const BackButton = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  > a {
    svg {
      height: ${props => props.theme.headerHeight};
      font-size: ${rhythm(1.8)};
      color: ${props => props.theme.textColor};
    }
    &:hover {
      svg {
        color: ${props => props.theme.secondaryColor};
      }
    }
  }
`
