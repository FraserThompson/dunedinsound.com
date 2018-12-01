import React from 'react'
import { Link } from 'gatsby'
import headerStyles from "./SiteHeaderStyles.css"

class SiteHeader extends React.Component {
    render() {
        return (
            <nav class="header navbar navbar-default" id="site-header" data-scroll-header>
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand hidden-xs" href="/" hidden-xs>Dunedin Gig Archives</a>
                    </div>
                    <div id="top-nav" style={{textAlign: "center"}}>
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/gigs/">Gigs</Link></li>
                            <li><Link to="/artists/">Artists</Link></li>
                            <li><Link to="/venues/">Venues</Link></li>
                            <li><Link to="/blog/">Blog</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
  
export default SiteHeader