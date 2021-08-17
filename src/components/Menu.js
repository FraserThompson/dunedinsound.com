// Menu.js
// Parameters:
//  - horizontal (optional): Defines whether it should be displayed as a horizontal list or vertical list. Collapses at 992px by default.
//  - backgroundColor
//  - height
//  - width

import styled from '@emotion/styled'
import { rhythm, scale } from '../utils/typography'
import { lighten } from 'polished'

export default styled.div`
  width: ${(props) => props.width};
  text-align: ${(props) => props.textAlign || 'left'};
  background-color: ${(props) => props.backgroundColor || props.theme.primaryColor};
  background-clip: padding-box;
  border: none;
  border-radius: 0;
  margin: 0;
  overflow-y: hidden;
  scroll-behavior: smooth;

  #vaultSessionsHeaderLink {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 0.5em;
    max-width: 60px;
    line-height: 1;
    text-align: center;
    padding-top: 0px;
    > span {
      padding: 0px;
    }
  }

  a,
  span {
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
  }

  svg {
    height: 100%;
  }

  a {
    color: ${(props) => props.theme.textColor};

    &:hover,
    &:focus {
      color: ${(props) => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &:active {
      background-color: ${(props) => props.theme.foregroundColor} !important;
    }
  }

  li {
    padding: 0;

    > a {
      display: block;
    }

    &.active {
      a {
        color: ${(props) => lighten(0.5, props.theme.textColor)};
      }
    }
  }

  > a,
  li {
    cursor: pointer;
    position: relative;
    text-decoration: none;
    white-space: nowrap;
    color: ${(props) => props.theme.textColor};
    line-height: ${(props) => props.height || props.theme.headerHeightMobile};
    margin: 0px;
    display: ${(props) => (props.horizontal ? 'inline-block' : 'block')};
    border-bottom: ${(props) => props.horizontal && 'none'};
    border-top: ${(props) => props.horizontal && 'none'};

    &:hover {
      color: white;
    }

    &.active,
    &:active {
      background-color: ${(props) => props.theme.secondaryColor};
      color: ${(props) => lighten(0.5, props.theme.textColor)};
    }

    .title {
      ${scale(0.5)};
    }

    span.listButton {
      float: right;
      a {
        padding-left: 0;
        padding-right: 0;
      }
      a:hover {
        text-decoration: none;
        cursor: pointer;
        color: ${(props) => lighten(0.1, props.theme.foregroundColor)};
      }
    }
    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      line-height: ${(props) => props.height || props.theme.headerHeight};
    }
  }
`
