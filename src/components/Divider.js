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
import { darken } from 'polished'

export default React.memo(({ href, color, sticky, backgroundColor, children, className }) => (
  <DividerWrapper color={color} sticky={sticky} backgroundColor={backgroundColor} className={className}>
    {href && <a href={href}>{children}</a>}
    {!href && children}
  </DividerWrapper>
))

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

  top: ${props => (props.sticky ? (props.sticky == 2 ? props.theme.headerHeightMobileWithSubheader : props.theme.headerHeightMobile) : '0')};
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
    top: ${props => (props.sticky ? (props.sticky == 2 ? props.theme.headerHeightWithSubheader : props.theme.headerHeight) : '0')};
  }
`
