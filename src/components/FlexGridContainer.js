// FlexGridContainer.js
// A flexible grid. Will display items in a grid but will also grow to take up space if there is any.
//
// Params (breakpoints) will use theme defaults if not supplied
//  - xs (optional)
//  - sm (optional)
//  - md (optional)
//  - lg (optional)

import styled from '@emotion/styled'

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  > * {
    flex: 1 1 ${(props) => 100 * ((props.xs || 6) / 12) + '%'};
    width: ${(props) => props.fixedWidth && 100 * ((props.xs || 6) / 12) + '%'};
    max-width: ${(props) => props.maxWidth && props.maxWidth};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    > * {
      flex: 1 1 ${(props) => 100 * ((props.sm || 4) / 12) + '%'};
      width: ${(props) => props.fixedWidth && 100 * ((props.sm || 4) / 12) + '%'};
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    > * {
      flex: 1 1 ${(props) => 100 * ((props.md || 3) / 12) + '%'};
      width: ${(props) => props.fixedWidth && 100 * ((props.md || 3) / 12) + '%'};
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.lg}) {
    > * {
      flex: 1 1 ${(props) => 100 * ((props.lg || 3) / 12) + '%'};
      width: ${(props) => props.fixedWidth && 100 * ((props.lg || 3) / 12) + '%'};
    }
  }
`
