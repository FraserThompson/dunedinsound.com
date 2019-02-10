import styled from 'styled-components'

const Divider = styled.div`
  width: 100%;
  position: ${props => props.sticky ? "sticky" : "relative"};
  top: ${props => props.sticky ? props.theme.headerHeight : "0"};
  color: ${props => props.color || "black"};
  z-index: 2;
  background-color: ${props => props.highlight ? props.theme.highlightColor : props.theme.contrastColor};
`
export default Divider;
