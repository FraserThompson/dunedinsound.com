import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { MdPlaylistPlay } from 'react-icons/md';
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';

const DropdownMenu = styled.ul`
  position: absolute;
  bottom: 100%;
  min-width: 200px;
  width: ${props => props.width};
  text-align: left;
  background-color: ${props => props.theme.highlightColor2};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  right: 0!important;
  left: auto;
  border: none;
  border-radius: 0;
  margin: 0;
  list-style: none;
  overflow-y: hidden;
  visibility: ${props => props.open ? "1" : "0"};
  opacity: ${props => props.open ? "1" : "0"};
  transform: ${props => props.open ? "translateY(0)" : "translateY(" + props.theme.headerHeight + ")"};
  pointer-events: ${props => props.open ? "auto" : "none"};
  transition-property: all;
	transition-duration: .5s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);
  li {
    line-height: 40px;
    border-bottom: 2px solid ${props => props.theme.contrastColor};
    margin: 0px;
    &.active {
      background-color: ${props => props.theme.highlightColor};
      color: ${props => props.theme.highlightColor2};
    }
    a {
      padding: 10px;
      display: block;
      &:hover {
        text-decoration: none;
        cursor: pointer;
        background-color: ${props => lighten(0.1, props.theme.highlightColor2)};
      }
    }
  }
`

const DropdownButton = styled.button`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.highlightColor2};
  width: 50px;
  height: ${props => props.theme.headerHeight};
  font-size: ${rhythm(1)};
  padding: 0;
  outline: 0;
  svg {
    width: 100%;
    height: 100%;
  }
`

class Dropdown extends React.Component {

  state = {
    open: false,
    selected: 0
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open})
  }

  select = (index) => {
    this.setState({selected: index, open: false})
    this.props.callback && this.props.callback(index)
  }

  render = () => {

    const list = this.props.list.map((item, index) =>
      <li className={this.state.selected == index ? "active" : ""} key={index}>
        <small><a onClick={() => this.select(index)}>{item.title}</a></small>
      </li>
    )

    return (
      <div>
        <DropdownMenu width={this.props.width} open={this.state.open}>
          {list}
        </DropdownMenu>
        <DropdownButton aria-haspopup="true" onClick={this.toggleMenu}><MdPlaylistPlay/></DropdownButton>
      </div>
    )
  }
}

export default Dropdown
