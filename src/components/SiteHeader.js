import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { rhythm } from '../utils/typography'
import { lighten } from 'polished';

const Container = styled.div`
  background-color: ${props => props.theme.headerColor};
  position: sticky;
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
    margin-left: ${rhythm(1)};
    margin-right: ${rhythm(1)};
  }
`

const Brand = styled.div`
  margin-right: auto;
  display: block;
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

const Nav = styled.ul`
  margin-left: auto;
  margin: 0px;
  padding-left: 0;
  height: ${props => props.theme.headerHeight};
  list-style: none;
  > li {
    position: relative;
    display: inline-block;
    height: ${props => props.theme.headerHeight};
    background-color: ${props => props.theme.headerColor};
    float: left;
    > a {
      padding: ${rhythm(0.5)};
      position: relative;
      display: block;
      border-right: 1px solid rgba(0,0,0,0.2);
      border-left: 1px solid rgba(255,255,255,0.1);
      height: ${props => props.theme.headerHeight};
      line-height: ${rhythm(1)};
      text-decoration: none;

      &.active {
        background-color: ${props => props.theme.highlightColor }
      }

      &:hover:not(.active) {
        background: ${props => lighten(0.1, props.theme.headerColor)};
      }
    }
  }
`

class SiteHeader extends React.Component {

    isPartiallyActive = ({isPartiallyCurrent}) => {
      return isPartiallyCurrent ? { className: "active" } : null
    }


    render() {
        return (
            <Container>
                <Brand>
                  <Link to="/">Dunedin Gig Archives</Link>
                </Brand>
                <div className="miscContent">
                  {this.props.headerContent}
                </div>
                <Nav>
                  <li><Link activeClassName="active" to="/">Home</Link></li>
                  <li><Link getProps={this.isPartiallyActive} to="/gigs/">Gigs</Link></li>
                  <li><Link getProps={this.isPartiallyActive} to="/artists/">Artists</Link></li>
                  <li><Link getProps={this.isPartiallyActive} to="/venues/">Venues</Link></li>
                  <li><Link getProps={this.isPartiallyActive} to="/blog/">Blog</Link></li>
                </Nav>
            </Container>
        )
    }
}

export default SiteHeader
