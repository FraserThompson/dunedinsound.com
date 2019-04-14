import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { rhythm } from '../utils/typography'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import SiteNav from './SiteNav';

const Container = styled.div`
  background-color: ${props => props.backgroundColor || props.theme.headerColor};
  position: sticky;
  width: 100%;
  display: ${props => props.hideOnMobile && "none"};
  flex-direction: row;
  justify-items: center;
  top: 0px;
  z-index: 10;
  height: ${props => props.theme.headerHeight};
  color: ${props => props.theme.textColor};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);


  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    display: flex;
  }

  .miscContent {
    margin: 0 auto;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
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

  render() {
    return (
      <Container hideOnMobile={!this.props.headerContent} backgroundColor={this.props.backgroundColor}>
        <ReactCSSTransitionGroup component={React.Fragment} transitionName="fade" transitionEnterTimeout={300} transitionLeaveTimeout={1}>
          {!this.props.hideBrand && <Brand>
            <Link to="/">Dunedin Gig Archives</Link>
          </Brand>}
          {this.props.headerContent && <div className="miscContent">
            {this.props.headerContent}
          </div>}
        {!this.props.hideNav && <SiteNav className="hideMobile"/>}
        </ReactCSSTransitionGroup>
      </Container>
    )
  }
}

export default SiteHeader
