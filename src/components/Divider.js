// Divider.js
// A divider.
//
// Params:
//  - children: content to display in the divider
//  - color (optional): Text color
//  - sticky (optional): Makes it sticky in either 'header' 'top' or 'headerMobile' location
//  - backgroundColor (optional): Background color
//  - href (optional): Makes it a link

import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import { darken } from 'polished'

export default React.memo(({ href, color, sticky, backgroundColor, children, className }) => (
  <DividerWrapper color={color} sticky={sticky} backgroundColor={backgroundColor} className={className}>
    {href && <a href={href}>{children}</a>}
    {!href && children}
  </DividerWrapper>
))

const getStickyTopDesktop = props => {
  switch (props.sticky) {
    case 'header':
      return props.theme.headerHeight
    case 'top':
      return '0'
    case 'headerMobile':
      return props.theme.headerHeightMobile
  }
}

const getStickyTopMobile = props => {
  switch (props.sticky) {
    case 'header':
      return props.theme.headerHeightMobile
    case 'top':
      return '0'
    case 'headerMobile':
      return props.theme.headerHeightMobile
  }
}

export const DividerWrapper = styled.div`
  color: ${props => props.color || 'black'};
  position: relative;
  line-height: ${rhythm(1)};
  vertical-align: middle;
  width: 100%;
  display: flex;
  align-items: center;
  min-height: ${rhythm(1)};
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  background-color: ${props => props.backgroundColor || props.theme.contrastColor};
  border-bottom: 1px solid ${props => darken(0.1, props.backgroundColor || props.theme.contrastColor)};

  top: ${getStickyTopMobile};
  position: ${props => (props.sticky ? 'sticky' : 'relative')};
  z-index: ${props => (props.sticky ? '6' : '5')};
  box-shadow: ${props => props.sticky && '0 6px 12px rgba(0,0,0,0.25)'};

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

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    top: ${getStickyTopDesktop};
  }
`
