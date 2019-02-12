import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { rhythm } from '../utils/typography'

class SiteHeader extends React.Component {

    isPartiallyActive = ({isPartiallyCurrent}) => {
      return isPartiallyCurrent ? { className: "active" } : null
    }


    render() {

        const Container = styled.div`
            background-color: ${props => props.theme.headerColor};
            position: sticky;
            top: 0px;
            z-index: 10;
            height: ${props => props.theme.headerHeight};
            color: ${props => props.theme.textColor};
        `

        const Brand = styled.div`
            float: left;
            display: block;
            height: ${props => props.theme.headerHeight};
            a {
                padding: ${rhythm(0.5)};
                line-height: ${props => props.theme.headerHeight};
            }
        `

        const Nav = styled.ul`
            float: right;
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

                    &.active {
                      background-color: ${props => props.theme.highlightColor2 }
                    }
                }
            }
        `


        return (
            <Container>
                <Brand>
                    <Link to="/">Dunedin Gig Archives</Link>
                </Brand>
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
