import React from 'react'
import SidebarNav from "./SidebarNav";
import { Link } from "gatsby";
import { theme } from '../utils/theme';
import Menu from './Menu';

const SiteNav = (props) => {

  const isPartiallyActive = ({isPartiallyCurrent}) => {
    return isPartiallyCurrent ? { className: "active" } : null
  }

  return (
    <Menu {...props} horizontal right open>
      <li><Link activeClassName="active" to="/">Home</Link></li>
      <li><Link getProps={isPartiallyActive} to="/gigs/">Gigs</Link></li>
      <li><Link getProps={isPartiallyActive} to="/artists/">Artists</Link></li>
      <li><Link getProps={isPartiallyActive} to="/venues/">Venues</Link></li>
      <li><Link getProps={isPartiallyActive} to="/blog/">Blog</Link></li>
    </Menu>
  )
}

export default SiteNav
