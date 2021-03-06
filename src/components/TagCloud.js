import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

const allowedTagPages = ['interview', 'opinion', 'news', 'events', 'documentary', 'tech']

export default React.memo(props => (
  <Tags>
    {props.blogTags.map(
      ({ fieldValue, totalCount }) =>
        allowedTagPages.includes(fieldValue) && (
          <span key={fieldValue} className={fieldValue == props.selected ? 'selected' : undefined}>
            <Link to={`/blog/tags/${fieldValue}`}>
              {fieldValue} ({totalCount})
            </Link>
          </span>
        )
    )}
    {props.selected && (
      <span>
        <Link to={`/blog/`}>all</Link>
      </span>
    )}
  </Tags>
))

const Tags = styled.div`
  > span {
    padding-right: ${rhythm(0.5)};
    &.selected {
      font-weight: 600;
    }
  }
`
