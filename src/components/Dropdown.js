import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { MdPlaylistPlay, MdFileDownload } from 'react-icons/md';
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
	transition-duration: .3s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);

  li {
    line-height: 40px;
    border-bottom: 2px solid ${props => props.theme.contrastColor};
    margin: 0px;

    &.active {
      background-color: ${props => props.theme.highlightColor};
      color: ${props => props.theme.highlightColor2};
    }

    cursor: pointer;

    &:hover:not(.active) {
      background-color: ${props => lighten(0.1, props.theme.highlightColor2)};
    }

    .inner {
      padding: 10px;
      display: block;
      text-decoration: none;

      .title {
        font-size: ${rhythm(0.5)};
      }

      .downloadButton {
        float: right;
        a:hover {
          text-decoration: none;
          cursor: pointer;
          color: ${props => lighten(0.1, props.theme.highlightColor)};
        }
      }
    }
  }
`

const DropdownButton = styled.button`
  width: 50px;
  height: ${props => props.theme.headerHeight};
  font-size: ${rhythm(1)};
  padding: 0;
  outline: 0;
  z-index: 12;

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

  toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({open: !this.state.open})
  }

  select = (index) => {
    this.setState({selected: index, open: false})
    this.props.callback && this.props.callback(index)
  }

  render = () => {

    const list = this.props.list.map((item, index) =>
      <li className={this.state.selected == index ? "active" : ""} key={index}>
        <a className="inner" onClick={() => this.select(index)}>
          <span className="title">{index + 1}. {item.title}</span><span className="downloadButton"><a title={"Download MP3:" + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank"><MdFileDownload/></a></span>
        </a>
      </li>
    )

    return (
      <div>
        <DropdownMenu width={this.props.width} open={this.state.open}>
          {list}
        </DropdownMenu>
        <DropdownButton className={this.state.open ? "active" : ""} open={this.state.open} aria-haspopup="true" onClick={this.toggleMenu}><MdPlaylistPlay/></DropdownButton>
      </div>
    )
  }
}

export default Dropdown
