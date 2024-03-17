import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default React.memo(({ died, born, hideText = false, inactiveText = 'Defunct' }) => {
  if (died == undefined) {
    return <ActiveIcon title="Active">⬤ {!hideText && (!born ? 'Active' : `Active since ${born}`)}</ActiveIcon>
  } else {
    // Workaround for gatsby not picking up the field being date type for some reason
    const diedYear = new Date(died).getFullYear()
    return (
      <DefunctIcon title="Defunct">
        ⬤ {!hideText && (diedYear !== 1600 ? (!born ? `${inactiveText} since ${diedYear}` : `Active ${born} to ${diedYear}`) : inactiveText)}
      </DefunctIcon>
    )
  }
})

const ActiveIcon = styled.span`
  color: #31a24c;
  font-size: ${rhythm(0.6)};
`

const DefunctIcon = styled.span`
  color: #ab0000;
  font-size: ${rhythm(0.6)};
`
