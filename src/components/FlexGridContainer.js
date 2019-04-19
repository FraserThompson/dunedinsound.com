import styled from "styled-components"

const FlexGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    flex: 1 1 ${props => (100 * ((props.xs || 6) / 12)) + "%"};
    width: ${props => props.fixedWidth && ((100 * ((props.xs || 6) / 12)) + "%")};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    > * {
      flex: 1 1 ${props => (100 * ((props.sm || 4) / 12)) + "%"};
      width: ${props => props.fixedWidth && ((100 * ((props.sm || 4) / 12)) + "%")};
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    > * {
      flex: 1 1 ${props => (100 * ((props.md || 3) / 12)) + "%"};
      width: ${props => props.fixedWidth && ((100 * ((props.md || 3) / 12)) + "%")};
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.lg}) {
    > * {
      flex: 1 1 ${props => (100 * ((props.lg || 3) / 12)) + "%"};
      width: ${props => props.fixedWidth && ((100 * ((props.lg || 3) / 12)) + "%")};
    }
  }

`

export default FlexGridContainer
