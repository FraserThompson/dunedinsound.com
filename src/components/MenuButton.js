import styled from 'styled-components'
import { scale } from '../utils/typography';

const MenuButton = styled.button`
  ${scale(1)};
  width: 50px;
  height: ${props => props.theme.headerHeight};
  padding: 0;
  outline: 0;
  z-index: 12;
  color: ${props => props.theme.textColor};
  border-radius: 0px;
  background-color: ${props => props.theme.highlightColor2};

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => props.hideMobile && "none"};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export default MenuButton
