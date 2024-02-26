import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default React.memo(({ died, born, hideText = false, inactiveText = 'Defunct' }) => {
  if (died == undefined) {
    return <ActiveIcon title="Active">⬤ {!hideText && (!born ? 'Active' : `Active since ${born}`)}</ActiveIcon>
  } else {
    return (
      <DefunctIcon title="Defunct">
        ⬤ {!hideText && (died !== 0 ? (!born ? `${inactiveText} since ${died}` : `Active ${born} to ${died}`) : inactiveText)}
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
