import styled from 'styled-components'

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);

    * {
      grid-column: span ${props => props.xs};
    }

    @media screen and (min-width: 768px) {
      * {
        grid-column: span ${props => props.sm};
      }
    }

    @media screen and (min-width: 992px) {
      * {
        grid-column: span ${props => props.md};
      }
    }

    @media screen and (min-width: 1200px) {
      * {
        grid-column: span ${props => props.lg};
      }
    }
  `

export default GridContainer
