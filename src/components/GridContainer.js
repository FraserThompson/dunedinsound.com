import styled from 'styled-components'

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    justify-items: ${props => props.center ? "center" : "initial"};
    grid-auto-flow: dense;

    * {
      grid-column: span ${props => props.xs || 12};
    }

    @media screen and (min-width: 768px) {
      * {
        grid-column: span ${props => props.sm || 6};
      }
    }

    @media screen and (min-width: 992px) {
      * {
        grid-column: span ${props => props.md || 4};
      }
    }

    @media screen and (min-width: 1200px) {
      * {
        grid-column: span ${props => props.lg || 4};
      }
    }
  `

export default GridContainer
