import styled from 'styled-components'
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';

const MenuButton = styled.button`
  width: 50px;
  height: ${props => props.theme.headerHeight};
  font-size: ${rhythm(1)};
  padding: 0;
  outline: 0;
  z-index: 12;
  color: ${props => props.theme.textColor};
  border-radius: 0px;
  background-color: ${props => props.theme.highlightColor2};

  @media screen and (min-width: 992px) {
    display: ${props => props.hideMobile && "none"};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export default MenuButton