import styled from 'styled-components'
import { rhythm } from '../utils/typography';

const MenuButton = styled.button`
  width: 50px;
  height: ${props => props.theme.headerHeight};
  font-size: ${rhythm(1)};
  padding: 0;
  outline: 0;
  z-index: 12;
  color: white;

  @media screen and (min-width: 992px) {
    display: ${props => props.hideMobile && "none"};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export default MenuButton
