import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { MdPlaylistPlay, MdFileDownload } from 'react-icons/md';
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';
import Menu from './Menu';

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: 100%;
  right: 0!important;
  left: auto;
  visibility: ${props => props.open ? "1" : "0"};
  opacity: ${props => props.open ? "1" : "0"};
  transform: ${props => props.open ? "translateY(0)" : "translateY(" + props.theme.headerHeight + ")"};
  pointer-events: ${props => props.open ? "auto" : "none"};
  transition-property: all;
	transition-duration: .3s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);
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
        <a onClick={() => this.select(index)}>
          <span className="title">{index + 1}. {item.title}</span><span className="listButton"><a title={"Download MP3:" + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank"><MdFileDownload/></a></span>
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
