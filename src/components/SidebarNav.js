import styled from 'styled-components'
import Menu from '../components/Menu'

const DefaultWidth = "60vw"

const SidebarNav = styled(Menu)`

  background-color: ${props => props.backgroundColor || props.theme.headerColor};
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  width: ${props => props.width};
  top: ${props => props.theme.headerHeight};
  left: ${props => props.left && 0};
  right: ${props => props.right && 0};
  z-index: 10;
  padding: 0;
  margin: 0;

  transition-property: width, visibility, opacity, transform, pointer-events;
	transition-duration: .3s;
	transition-timing-function: cubic-bezier(0,0,0,1.2);

  visibility: ${props => props.open ? "hidden" : "visible"};
	opacity: ${props => props.open ? "0" : "1"};
  transform: ${props => props.open ? `translateX(${(props.left ? "-" : "") + (props.width || DefaultWidth)})` : `translateY(0)`};
  pointer-events: ${props => props.open ? "none" : "auto"};
  width: ${DefaultWidth};

  @media screen and (min-width: 992px) {
    width: ${props => props.width};
    visibility: ${props => !props.open ? "hidden" : "visible"};
    opacity: ${props => !props.open ? "0" : "1"};
    transform: ${props => !props.open ? `translateX(${(props.left ? "-" : "") + (props.width || DefaultWidth)})` : `translateY(0)`};
    pointer-events: ${props => !props.open ? "none" : "auto"};
    height: ${props => props.horizontal && "auto"};
    position: ${props => props.horizontal && "initial"};
    width: ${props => props.horizontal && "auto"};
  }

  .active-top {
    > a {
      color: white;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`

export default SidebarNav
