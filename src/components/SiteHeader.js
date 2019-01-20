import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"
import { rhythm } from '../utils/typography'

class SiteHeader extends React.Component {

    render() {
        
        const Container = styled.div`
            background-color: ${props => props.theme.headerColor};
            height: ${rhythm(2)};
            color: #c8c8c8;
        `

        const Brand = styled.div`
            float: left;
            display: block;
            height: ${rhythm(2)};
            a {
                padding: ${rhythm(0.5)};
                line-height: ${rhythm(2)};
            }
        `

        const Nav = styled.ul`
            float: right;
            margin: 0px;
            padding-left: 0;
            height: ${rhythm(2)};
            list-style: none;
            > li {
                position: relative;
                display: inline-block;
                height: ${rhythm(2)};
                float: left;
                > a {
                    padding: ${rhythm(0.5)};
                    position: relative;
                    display: block;
                    border-right: 1px solid rgba(0,0,0,0.2);
                    border-left: 1px solid rgba(255,255,255,0.1);
                    height: ${rhythm(2)};
                    line-height: ${rhythm(1)};
                }
            }
        `

        return (
            <Container>
                <Brand>
                    <Link to="/">Dunedin Gig Archives</Link>
                </Brand>
                <Nav>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/gigs/">Gigs</Link></li>
                    <li><Link to="/artists/">Artists</Link></li>
                    <li><Link to="/venues/">Venues</Link></li>
                    <li><Link to="/blog/">Blog</Link></li>
                </Nav>
            </Container>
        )
    }
}
  
export default SiteHeader