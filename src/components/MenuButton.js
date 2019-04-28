import styled from 'styled-components'
import { scale } from '../utils/typography';
import { lighten } from 'polished';

const MenuButton = styled.button`
  ${scale(1)};
  width: 30px;
  height: ${props => props.theme.headerHeight};
  padding: 0;
  outline: 0;
  z-index: 12;
  color: ${props => props.theme.textColor};
  border: none;
  border-radius: 0px;
  background-color: ${props => props.theme.highlightColor2};

  &:hover {
    background-color: ${props => lighten(0.1, props.theme.highlightColor2)};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => props.hideMobile && "none"};
    width: 50px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export default MenuButton
