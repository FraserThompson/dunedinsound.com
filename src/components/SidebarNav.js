// SidebarNav.js
// Vertical sidebar navigation menu.
// Props
//  - backgroundColor (optional): Will use theme primaryColor if not supplied.
//  - width (optional): Defaults to 250px
//  - left: Display it on the left
//  - right: Display it on the right

import React from 'react'
import styled from '@emotion/styled'
import Menu from '../components/Menu'
import { darken, lighten } from 'polished';
import MenuButton from './MenuButton';
import { MdMenu } from 'react-icons/md';

const DefaultWidth = "60vw"

const SidebarNavWrapper = styled(Menu)`

  background-color: ${props => props.backgroundColor || props.theme.primaryColor};
  height: ${props => `calc(100vh - ${props.theme.headerHeightWithMobile })`};
  overflow-x: hidden;
  position: fixed;
  max-width: ${props => props.width || "250px"};
  top: ${props => props.theme.headerHeightWithMobile};
  left: ${props => props.left && 0};
  right: ${props => props.right && 0};
  z-index: 10;
  box-shadow: 0 6px 12px rgba(0,0,0,.25);
  border-right: 1px solid ${props => darken(0.025, props.theme.primaryColor)};

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

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  > li {
    &:hover:not(.active-parent) {
      > a {
        background-color: ${props => lighten(0.1, props.theme.backgroundColor)};
      }
    }
  }

  > ul {
    overflow-y: auto;
    height: 100vh;
    > li {
      border-left: 5px solid transparent;
      &:hover:not(.active-parent) {
        border-left: 5px solid ${props => lighten(0.3, props.theme.backgroundColor)};
        > a {
          color: white;
          background-color: ${props => lighten(0.3, props.theme.backgroundColor)};
        }
      }
      &.active-parent {
        border-left: 5px solid ${props => props.theme.foregroundColor};
        &:active {
          background-color: transparent !important;
        }
        > a {
          color: white;
          background-color: ${props => props.theme.foregroundColor};
        }
      }
      > ul {
        > li {
          &:hover:not(.active) {
            background-color: ${props => lighten(0.1, props.theme.backgroundColor)};
          }
        }
      }
    }
  }
`
class SidebarNav extends React.Component {

  state = {
    open: true,
  }

  render() {
    return <>
      <MenuButton hideMobile={true} onClick={() => this.setState({open: !this.state.open})}><MdMenu/></MenuButton>
      <SidebarNavWrapper ref={this.props.sidebarRef} left={this.props.left} right={this.props.right} width={this.props.width} backgroundColor={this.props.backgroundColor} open={this.state.open}>{this.props.children}</SidebarNavWrapper>
    </>
  }
}


export default SidebarNav
