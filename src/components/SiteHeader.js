import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { rhythm } from '../utils/typography'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import MenuButton from './MenuButton';
import SidebarNav from './SidebarNav';
import { MdMenu } from 'react-icons/md';

const Container = styled.div`

  background-color: ${props => props.backgroundColor || props.theme.headerColor};
  position: sticky;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-items: center;
  top: 0px;
  z-index: 10;
  height: ${props => props.theme.headerHeight};
  color: ${props => props.theme.textColor};

  .miscContent {
    margin: 0 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-items: center;
  }
`

const Brand = styled.div`
  margin-right: auto;
  display: "block";
  height: ${props => props.theme.headerHeight};
  a {
    padding: ${rhythm(0.5)};
    line-height: ${props => props.theme.headerHeight};
    &:hover {
      text-decoration: none;
      color: ${props => props.theme.highlightColor2};
    }
  }
`

class SiteHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      navOpen: true
    }
  }

  toggleNav = () => {
    this.setState({navOpen: !this.state.navOpen})
  }

  isPartiallyActive = ({isPartiallyCurrent}) => {
    return isPartiallyCurrent ? { className: "active" } : null
  }

  render() {
    return (
      <Container backgroundColor={this.props.backgroundColor}>
        <ReactCSSTransitionGroup component={React.Fragment} transitionName="fade" transitionEnterTimeout={300} transitionLeaveTimeout={1}>
          {!this.props.hideBrand && <Brand>
            <Link to="/">Dunedin Gig Archives</Link>
          </Brand>}
          {this.props.headerContent && <div className="miscContent">
            {this.props.headerContent}
          </div>}
        </ReactCSSTransitionGroup>
        <MenuButton className={!this.state.navOpen ? "active" : ""} hideMobile={true} onClick={this.toggleNav}><MdMenu/></MenuButton>
        <SidebarNav backgroundColor={this.props.backgroundColor} open={this.state.navOpen} horizontal right>
          <li><Link activeClassName="active" to="/">Home</Link></li>
          <li><Link getProps={this.isPartiallyActive} to="/gigs/">Gigs</Link></li>
          <li><Link getProps={this.isPartiallyActive} to="/artists/">Artists</Link></li>
          <li><Link getProps={this.isPartiallyActive} to="/venues/">Venues</Link></li>
          <li><Link getProps={this.isPartiallyActive} to="/blog/">Blog</Link></li>
        </SidebarNav>
      </Container>
    )
  }
}

export default SiteHeader
