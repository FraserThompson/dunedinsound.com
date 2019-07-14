import React from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'

export default React.memo(props => {
  const isPartiallyActive = ({ isPartiallyCurrent }) => {
    return isPartiallyCurrent ? { className: 'active' } : null
  }

  return (
    <Menu {...props} horizontal right open>
      <Link className="showMobile" activeClassName="active" to="/">
        Home
      </Link>
      <Link getProps={isPartiallyActive} to="/gigs/">
        Gigs
      </Link>
      <Link getProps={isPartiallyActive} to="/artists/">
        Artists
      </Link>
      <Link getProps={isPartiallyActive} to="/venues/">
        Venues
      </Link>
      <Link getProps={isPartiallyActive} to="/blog/">
        Articles
      </Link>
      <Link className="rainbowBackground" id="vaultSessionsHeaderLink" getProps={isPartiallyActive} to="/vaultsessions/">
        <span>
          VAULT
          <br />
          SESSIONS
        </span>
      </Link>
    </Menu>
  )
})
