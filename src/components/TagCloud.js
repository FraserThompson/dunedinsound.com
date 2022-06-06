import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default React.memo((props) => (
  <Tags>
    {props.selected && (
      <p data-weight="4">
        <Link to={`/blog/`}>All</Link>
      </p>
    )}
    {props.blogTags
      .sort((a, b) => b.totalCount - a.totalCount)
      .map(({ fieldValue, totalCount }) => (
        <p key={fieldValue} data-weight={Math.min(totalCount, 4)} className={fieldValue == props.selected ? 'selected' : undefined}>
          <Link to={`/blog/tags/${fieldValue}`}>
            {fieldValue} ({totalCount})
          </Link>
        </p>
      ))}
  </Tags>
))

const Tags = styled.div`
  > p {
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

    padding-bottom: 0;
    padding-top: 0;
    margin-bottom: 0;
    font-size: calc(var(--size) * 0.25rem + 0.4rem);

    &.selected {
      font-weight: 600;
    }
  }
`
