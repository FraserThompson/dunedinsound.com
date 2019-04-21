// GridContainer.js
// A grid. Will display items in a grid.
//
// Params (breakpoints) will use theme defaults if not supplied
//  - xs (optional)
//  - sm (optional)
//  - md (optional)
//  - lg (optional)

import styled from 'styled-components'

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(12, [col-start] 1fr);
    justify-items: ${props => props.center ? "center" : "initial"};
    grid-auto-flow: dense;

    > * {
      grid-column: span ${props => props.xs || 12};
    }

    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
      > * {
        grid-column: span ${props => props.sm || 6};
      }
    }

    @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
      > * {
        grid-column: span ${props => props.md || 4};
      }
    }

    @media screen and (min-width: ${props => props.theme.breakpoints.lg}) {
      > * {
        grid-column: span ${props => props.lg || 4};
      }
    }
  `

export default GridContainer
