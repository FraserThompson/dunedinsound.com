import React from 'react'
import { Link } from "gatsby";
import Menu from './Menu';

const SiteNav = (props) => {

  const isPartiallyActive = ({isPartiallyCurrent}) => {
    return isPartiallyCurrent ? { className: "active" } : null
  }

  return (
    <Menu {...props} horizontal right open>
      <Link activeClassName="active" to="/">Home</Link>
      <Link getProps={isPartiallyActive} to="/gigs/">Gigs</Link>
      <Link getProps={isPartiallyActive} to="/artists/">Artists</Link>
      <Link getProps={isPartiallyActive} to="/venues/">Venues</Link>
      <Link getProps={isPartiallyActive} to="/blog/">Blog</Link>
    </Menu>
  )
}

export default SiteNav
