// Search.js
// A simple searchbox.
// Props
//  - filter: What to do when someone types something
//  - placeholder (optional): Placeholder text (will use Search if not supplied)
import { debounce } from 'throttle-debounce'
import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default React.memo(({ placeholder = 'Search', filter }) => {
  const searchDebounced = useCallback(debounce(200, filter), [filter])

  const onChange = useCallback(
    e => {
      searchDebounced(e.target.value.toLowerCase().trim())
    },
    [searchDebounced]
  )

  return <HeaderSearch placeholder={placeholder} type="text" onChange={onChange} />
})

const HeaderSearch = styled.input`
  width: 100%;
  z-index: 10;
  margin-left: 1px;
  margin-right: 1px;
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    margin-left: ${rhythm(0.25)};
    margin-right: ${rhythm(0.25)};
  }
`
