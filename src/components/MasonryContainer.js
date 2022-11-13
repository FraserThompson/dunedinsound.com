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
  column-gap: 0;
  background-color: black;
  columns: 1 200px;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    columns: ${(props) => props.columns + ' 200px'};
  }
`
