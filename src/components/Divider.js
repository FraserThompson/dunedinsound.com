// Divider.js
// A divider.
//
// Params:
//  - children: content to display in the divider
//  - color (optional): Text color
//  - sticky (optional): Makes it sticky
//  - backgroundColor (optional): Background color
//  - href (optional): Makes it a link

import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

const DividerWrapper = styled.div`
  color: ${props => props.color || 'black'};
  line-height: ${rhythm(1)};
  vertical-align: middle;
  width: 100%;
  position: ${props => (props.sticky ? 'sticky' : 'relative')};
  display: flex;
  align-items: center;
  top: ${props => (props.sticky ? props.theme.headerHeightWithMobile : '0')};
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    top: ${props => (props.sticky ? props.theme.headerHeight : '0')};
  }
  z-index: ${props => (props.sticky ? '6' : '5')};
  min-height: ${rhythm(1)};
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  background-color: ${props => props.backgroundColor || props.theme.contrastColor};
  p {
    margin: 0;
    line-height: ${rhythm(1)};
    display: inline-block;
    vertical-align: middle;
  }
  a {
    color: ${props => props.color || 'black'};
    &:hover,
    &:active {
      color: ${props => props.color || 'black'};
    }
  }
`
export default React.memo(({ href, color, sticky, backgroundColor, children }) => (
  <DividerWrapper color={color} sticky={sticky} backgroundColor={backgroundColor}>
    {href && <a href={href}>{children}</a>}
    {!href && children}
  </DividerWrapper>
))
