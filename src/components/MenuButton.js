import styled from '@emotion/styled'
import { scale } from '../utils/typography'
import { lighten } from 'polished'

export default styled.button`
  ${scale(1)};
  width: ${props => props.theme.headerHeightMobile};
  height: ${props => props.theme.headerHeightMobile};
  padding: 0;
  outline: 0;
  z-index: 12;
  color: ${props => props.theme.textColor};
  border: none;
  border-radius: 0px;
  background-color: ${props => props.theme.secondaryColor};

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: ${props => lighten(0.1, props.theme.secondaryColor)};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => props.hideMobile && 'none'};
    width: 50px;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    height: ${props => props.theme.headerHeight};
  }
`
