import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { MdMenu } from 'react-icons/md';
import { rhythm } from '../utils/typography';

const DropdownMenu = styled.ul`
  position: absolute;
  bottom: 100%;
  float: left;
  min-width: 200px;
  font-size: 14px;
  text-align: left;
  background-color: ${props => props.theme.highlightColor2};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  right: 0!important;
  left: auto;
  overflow-y: auto;
  border: none;
  border-radius: 0;
  margin: 0;
  list-style: none;
  li {
    line-height: 40px;
    border-bottom: 2px solid ${props => props.theme.highlightColor2};
    padding: 10px;
    margin: 0px;
    &.active {
      background-color: ${props => props.theme.highlightColor};
      color: ${props => props.theme.highlightColor2};
    }
    a {
      display: block;
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
        <a onClick={() => this.select(index)}>{item.title}</a>
      </li>
    )

    return (
      <div>
        {this.state.open &&
          <DropdownMenu>
            {list}
          </DropdownMenu>
        }
        <DropdownButton aria-haspopup="true" onClick={this.toggleMenu}><MdMenu/></DropdownButton>
      </div>
    )
  }
}

export default Dropdown
