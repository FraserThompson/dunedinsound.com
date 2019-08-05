// SidebarNav.js
// Vertical sidebar navigation menu.
// Props
//  - backgroundColor (optional): Will use theme primaryColor if not supplied.
//  - width (optional): Defaults to 300px on desktop and 80vw on mobile
//  - left: Display it on the left
//  - right: Display it on the right

import React from 'react'
import styled from '@emotion/styled'
import Menu from '../components/Menu'
import { darken, lighten } from 'polished'
import { Transition } from 'react-transition-group'
import FadeInOut from './FadeInOut'
import MenuButton from './MenuButton'
import { MdMenu } from 'react-icons/md'

export default React.memo(({ left, right, width, backgroundColor, open, toggle, children }) => (
  <>
    <MenuButtonWrapper>
      <MenuButton hideMobile={true} onClick={toggle}>
        <MdMenu />
      </MenuButton>
    </MenuButtonWrapper>
    <SidebarNavWrapper left={left} right={right} width={width} backgroundColor={backgroundColor} open={open}>
      <List>{children}</List>
    </SidebarNavWrapper>
    <Transition mountOnEnter={true} unmountOnExit={true} in={!open} timeout={200}>
      {state => <PageOverlay state={state} onClick={toggle} />}
    </Transition>
  </>
))

const DefaultWidth = '80vw'

const PageOverlay = styled(FadeInOut)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
`

const SidebarNavWrapper = styled(Menu)`
  background-color: ${props => props.backgroundColor || props.theme.primaryColor};
  height: ${props => `calc(100vh - ${props.theme.headerHeightWithMobile})`};
  overflow-x: hidden;
  position: fixed;
  width: ${props => props.width || DefaultWidth};
  max-width: ${props => props.width || DefaultWidth};
  top: ${props => props.theme.headerHeightMobile};
  left: ${props => props.left && 0};
  right: ${props => props.right && 0};
  z-index: 10;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  border-right: 1px solid ${props => darken(0.025, props.theme.primaryColor)};

  visibility: ${props => (props.open ? 'hidden' : 'visible')};
  opacity: ${props => (props.open ? '0' : '1')};
  transform: ${props => (props.open ? `translateX(${(props.left ? '-' : '') + (props.width || DefaultWidth)})` : `translateX(0)`)};
  pointer-events: ${props => (props.open ? 'none' : 'auto')};

  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1.2);
  will-change: transform;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    height: ${props => `calc(100vh - ${props.theme.headerHeight})`};
    top: ${props => props.theme.headerHeight};
    width: 300px;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    visibility: ${props => (!props.open ? 'hidden' : 'visible')};
    opacity: ${props => (!props.open ? '0' : '1')};
    transform: ${props => (!props.open ? `translateX(${(props.left ? '-' : '') + (props.width || DefaultWidth)})` : `translateX(0)`)};
    pointer-events: ${props => (!props.open ? 'none' : 'auto')};
  }
`

const List = styled.div`
  height: 100%;
  .label {
    float: right;
  }

  ul {
    list-style: none;
    scroll-behavior: smooth;
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
    height: 100%;
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
          border-bottom: 1px solid ${props => darken(0.2, props.theme.foregroundColor)};
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

const MenuButtonWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 12;
`
