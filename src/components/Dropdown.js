import React from 'react'
import styled from "styled-components"
import { MdPlaylistPlay, MdFileDownload } from 'react-icons/md';
import Menu from './Menu';
import MenuButton from './MenuButton';
import { scale, rhythm } from '../utils/typography';

const DropdownMenu = styled(Menu)`
  position: absolute;
  bottom: 100%;
  right: 0!important;
  left: auto;
  visibility: ${props => props.open ? "1" : "0"};
  opacity: ${props => props.open ? "1" : "0"};
  transform: ${props => props.open ? "translateY(0)" : `translateY(${props.theme.headerHeight})`};
  pointer-events: ${props => props.open ? "auto" : "none"};
  transition-property: all;
	transition-duration: .3s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);
  box-shadow: 0 6px 12px rgba(0,0,0,.250);
`

class Dropdown extends React.Component {

  state = {
    open: false,
  }

  toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({open: !this.state.open})
  }

  select = (index) => {
    this.props.callback && this.props.callback(index)
    this.setState({open: false})
  }

  render = () => {

    const list = this.props.list.map((item, index) =>
      <a className={this.props.selected == index ? "active" : ""} key={index} onClick={() => this.select(index)}>
        <span className="title">{index + 1}. {item.title}</span><span className="listButton"><a title={"Download MP3:" + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank"><MdFileDownload/></a></span>
      </a>
    )

    return (
      <div>
        <DropdownMenu {...this.props} open={this.state.open}>
          {list}
        </DropdownMenu>
        <MenuButton className={this.state.open ? "active" : ""} open={this.state.open} aria-haspopup="true" onClick={this.toggleMenu}><MdPlaylistPlay/></MenuButton>
      </div>
    )
  }
}

export default Dropdown
