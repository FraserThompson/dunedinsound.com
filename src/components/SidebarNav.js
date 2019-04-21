// SidebarNav.js
// Verticaly idebar navigation menu.
// Props
//  - backgroundColor (optional): Will use theme headercolor if not supplied.
//  - width (optional): Defaults to 250px
//  - left: Display it on the left
//  - right: Display it on the right
//  - open: Is it open or closed?


import styled from 'styled-components'
import Menu from '../components/Menu'
import { darken } from 'polished';

const DefaultWidth = "60vw"

const SidebarNav = styled(Menu)`

  background-color: ${props => props.backgroundColor || props.theme.headerColor};
  height: ${props => `calc(100vh - ${props.theme.headerHeightWithMobile })`};
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  max-width: ${props => props.width || "250px"};
  top: ${props => props.theme.headerHeightWithMobile};
  left: ${props => props.left && 0};
  right: ${props => props.right && 0};
  z-index: 10;
  padding: 0;
  margin: 0;
  box-shadow: 0 6px 12px rgba(0,0,0,.25);
  border-right: 1px solid ${props => darken(0.025, props.theme.headerColor)};

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    height: ${props => `calc(100vh - ${props.theme.headerHeight })`};
  }

  transition-property: width, visibility, opacity, transform, pointer-events;
	transition-duration: .3s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);

  visibility: ${props => props.open ? "hidden" : "visible"};
	opacity: ${props => props.open ? "0" : "1"};
  transform: ${props => props.open ? `translateX(${(props.left ? "-" : "") + (props.width || DefaultWidth)})` : `translateY(0)`};
  pointer-events: ${props => props.open ? "none" : "auto"};
  width: ${DefaultWidth};

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    visibility: ${props => !props.open ? "hidden" : "visible"};
    opacity: ${props => !props.open ? "0" : "1"};
    transform: ${props => !props.open ? `translateX(${(props.left ? "-" : "") + (props.width || DefaultWidth)})` : `translateY(0)`};
    pointer-events: ${props => !props.open ? "none" : "auto"};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    top: ${props => props.theme.headerHeight};
  }

  .active-top {
    > a {
      color: white;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    a {
      color: ${props => props.theme.textColor};
      display: block;
    }
  }
`

export default SidebarNav
