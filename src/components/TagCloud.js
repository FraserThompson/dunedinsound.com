import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default React.memo((props) => (
  <Tags>
    {props.blogTags
      .sort((a, b) => b.totalCount - a.totalCount)
      .map(({ fieldValue, totalCount }) => (
        <span key={fieldValue} data-weight={Math.min(totalCount, 4)} className={fieldValue == props.selected ? 'selected' : undefined}>
          <Link to={`/blog/tags/${fieldValue}`}>
            {fieldValue} ({totalCount})
          </Link>
        </span>
      ))}
    {props.selected && (
      <span>
        <Link to={`/blog/`}>all</Link>
      </span>
    )}
  </Tags>
))

const Tags = styled.div`
  > span {
    &[data-weight='1'] {
      --size: 1;
    }

    &[data-weight='2'] {
      --size: 2;
    }

    &[data-weight='3'] {
      --size: 2;
    }

    &[data-weight='4'] {
      --size: 3;
    }

    padding-right: ${rhythm(0.5)};
    font-size: calc(var(--size) * 0.25rem + 0.4rem);

    &.selected {
      font-weight: 600;
    }
  }
`
