// Search.js
// A simple searchbox.
// Props
//  - filter: What to do when someone types something
//  - placeholder (optional): Placeholder text (will use Search if not supplied)

import React from 'react'
import styled from "styled-components"
import { rhythm } from '../utils/typography';

const HeaderSearch = styled.input`
  width: 100%;
  margin-left: ${rhythm(0.5)};
  margin-right: ${rhythm(0.5)};
`
class Search extends React.PureComponent {

  render() {

    return (
      <HeaderSearch placeholder={this.props.placeholder || "Search"} type="text" onChange={this.props.filter}/>
    )
  }
}

export default Search
