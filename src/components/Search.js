import React from 'react'
import styled from "styled-components"
import { rhythm } from '../utils/typography';

const HeaderSearch = styled.input`
  width: 100%;
  margin-left: ${rhythm(0.5)};
  margin-right: ${rhythm(0.5)};
`
class Search extends React.Component {

  render() {

    return (
      <HeaderSearch placeholder={this.props.placeholder || "Search"} type="text" onChange={this.props.filter}/>
    )
  }
}

export default Search
