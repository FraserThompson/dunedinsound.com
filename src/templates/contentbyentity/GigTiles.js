import React from 'react'
import Divider from '../../components/Divider'
import DropdownMenu from '../../components/DropdownMenu'
import FlexGridContainer from '../../components/FlexGridContainer'
import GigTile from '../../components/GigTile'
import { scrollTo } from '../../utils/helper'
import { theme } from '../../utils/theme'

export default React.memo(({ gigs, frontmatter }) => {
  const yearList = []

  const gigTiles = gigs.map(({ fieldValue, edges }) => {
    const yearSize = edges.length
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
          {edges.map(({ node }) => (
            <GigTile id={node.fields.slug} node={node} key={node.fields.slug} />
          ))}
        </FlexGridContainer>
      </div>
    )
  })

  if (frontmatter.audioculture) {
    const audioculture = frontmatter.audioculture
    gigTiles.push(
      <FlexGridContainer key={'audioculture'}>
        <Tile href={audioculture.link}>
          <Quote>
            "{audioculture.snippet}" - <span>Audioculture</span>
          </Quote>
        </Tile>
      </FlexGridContainer>
    )
  }

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
      <DropdownMenu top={theme.default.headerHeightMobile} history={history.current} list={yearList} />
      {gigTiles}
    </>
  )
})
