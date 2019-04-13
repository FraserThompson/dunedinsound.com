import React from 'react'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const DividerWrapper = styled.div`
  width: 100%;
  position: ${props => props.sticky ? "sticky" : "relative"};
  top: ${props => props.sticky ? props.theme.headerHeight : "0"};
  color: ${props => props.color || "black"};
  z-index: 2;
  min-height: ${rhythm(1)};
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  background-color: ${props => props.highlight ? props.theme.highlightColor : props.theme.contrastColor};
  p {
    margin: 0;
    line-height: ${rhythm(1)};
    display: inline-block;
    vertical-align: middle;
  }
  a {
    color: ${props => props.highlight ? "white" : "black"};
    &:hover, &:active {
      color: ${props => props.highlight ? "white" : "black"};
    }
  }
`
export default class Divider extends React.Component {
  render() {
    return <DividerWrapper {...this.props}><a href={this.props.href}>{this.props.children}</a></DividerWrapper>
  }
}
