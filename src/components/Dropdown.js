import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { MdPlaylistPlay } from 'react-icons/md';

const DropdownMenu = styled.ul`
  position: absolute;
  bottom: 100%;
  float: left;
  min-width: 160px;
  font-size: 14px;
  text-align: left;
  background-color: ${props => props.theme.headerColor};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  right: 0!important;
  left: auto;
  overflow-y: auto;
  border: none;
  border-radius: 0;
  list-style: none;
  li {
    line-height: 40px;
  }
`

class Dropdown extends React.Component {

  state = {
    open: false
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open})
  }

  render = () => {

    const menuList = this.props.list.map((item, index) => <li key={index}>{item}</li>)

    return (
      <div>
        {this.state.open &&
          <DropdownMenu>
            {menuList}
          </DropdownMenu>
        }
        <button aria-haspopup="true" onClick={this.toggleMenu}><MdPlaylistPlay/></button>
      </div>
    )
  }
}

export default Dropdown
