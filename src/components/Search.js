// Search.js
// A simple searchbox.
// Props
//  - filter: What to do when someone types something
//  - placeholder (optional): Placeholder text (will use Search if not supplied)
import { debounce } from 'throttle-debounce'
import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default class Search extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: '',
    }

    this.searchDebounced = debounce(100, this.props.filter)
  }

  onChange = e => {
    this.setState({ searchQuery: e.target.value }, () => {
      this.searchDebounced(this.state.searchQuery.toLowerCase().trim())
    })
  }

  render() {
    return <HeaderSearch placeholder={this.props.placeholder || 'Search'} type="text" value={this.state.searchQuery} onChange={this.onChange} />
  }
}

const HeaderSearch = styled.input`
  width: 100%;
  z-index: 10;
  margin-left: ${rhythm(0.25)};
  margin-right: ${rhythm(0.25)};
`
