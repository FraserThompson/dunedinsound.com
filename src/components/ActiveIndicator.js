import React from 'react'
import styled from '@emotion/styled'

export default React.memo(({ died, hideText = false, inactiveText = 'Defunct' }) => {
  if (died == undefined) {
    return <ActiveIcon title="Active">⬤ {!hideText && 'Active'}</ActiveIcon>
  } else {
    return <DefunctIcon title="Defunct">⬤ {!hideText && (died !== 0 ? `${inactiveText} since ${died}` : inactiveText)}</DefunctIcon>
  }
})

const ActiveIcon = styled.span`
  color: #31a24c;
  font-weight: 600;
`

const DefunctIcon = styled.span`
  color: #ab0000;
  font-weight: 600;
`
