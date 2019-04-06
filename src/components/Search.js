import React from 'react'
import styled from "styled-components"
import { MdMenu } from 'react-icons/md'
import { rhythm } from '../utils/typography';
import MenuButton from './MenuButton';

const HeaderSearch = styled.input`
  width: 100%;
  margin-left: ${rhythm(0.5)};
  margin-right: ${rhythm(0.5)};
`
class Search extends React.Component {

  render() {

    return (
      <>
        <MenuButton hideMobile={true} onClick={this.props.toggleSidebar}><MdMenu/></MenuButton>
        <HeaderSearch placeholder="Search" type="text" onChange={this.props.filter}/>
      </>
    )
  }
}

export default Search
