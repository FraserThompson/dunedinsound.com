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
      <DropdownMenu top={theme.default.headerHeightMobile} list={yearList} />
      {gigTiles}
    </>
  )
})

const Quote = styled.p`
  ${scale(1)};
  font-style: italic;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  text-shadow: 1px 1px #000;
  > span {
    transition: color 0.3s ease-in-out;
    color: white;
  }
  &:hover {
    > span {
      color: #b4dc7b;
    }
  }
`
