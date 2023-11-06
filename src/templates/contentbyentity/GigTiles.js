import styled from '@emotion/styled'
import React from 'react'
import Divider from '../../components/Divider'
import DropdownMenu from '../../components/DropdownMenu'
import FlexGridContainer from '../../components/FlexGridContainer'
import GigTile from '../../components/GigTile'
import Tile from '../../components/Tile'
import { scrollTo } from '../../utils/helper'
import { theme } from '../../utils/theme'
import { scale } from '../../utils/typography'

export default React.memo(({ gigs, frontmatter }) => {
  const yearList = []

  const gigTiles = gigs.map(({ fieldValue, nodes }) => {
    const yearSize = nodes.length
    yearList.push({ title: fieldValue, machineName: fieldValue })
    return (
      <div id={fieldValue} key={fieldValue}>
        <Divider backgroundColor={theme.default.foregroundColor} color={'black'} sticky={'headerMobile'}>
          <a style={{ width: '100%' }} onClick={(e) => scrollTo(e, fieldValue)} href={'#' + fieldValue}>
            <small>
              {fieldValue} ({yearSize})
            </small>
          </a>
        </Divider>
        <FlexGridContainer>
          {nodes.map((node) => (
            <GigTile id={node.fields.slug} node={node} key={node.fields.slug} />
          ))}
        </FlexGridContainer>
      </div>
    )
  })

  if (gigTiles.length <= 3) {
    gigTiles.push(
      <FlexGridContainer key={'contribution'}>
        <Tile backgroundColor="black" height="50px" to="/page/contribution_guidelines">
          <small>Can you add to this? 🤔</small>
        </Tile>
      </FlexGridContainer>
    )
  }

  return (
    <>
      <DropdownMenu top={theme.default.headerHeightMobile} list={yearList} />
      {gigTiles}
    </>
  )
})
