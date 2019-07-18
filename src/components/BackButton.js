import React from 'react'
import styled from '@emotion/styled'
import { scale, rhythm } from '../utils/typography'
import { theme } from '../utils/theme'
import { Link } from 'gatsby'
import { MdKeyboardArrowUp } from 'react-icons/md'

export default React.memo(({ title, to, state }) => (
  <Wrapper>
    <Link title={title} to={to} state={state}>
      <p>☝ Back to {title} ☝</p>
      <MdKeyboardArrowUp />
    </Link>
  </Wrapper>
))

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
