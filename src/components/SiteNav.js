import React, { useCallback } from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'

export default React.memo((props) => {
  const isPartiallyActive = useCallback(({ isPartiallyCurrent }) => {
    return isPartiallyCurrent ? { className: 'menu-title active' } : null
  }, [])

  return (
    <Menu {...props} horizontal right open>
      <Link className="menu-title showMobile" activeClassName="active" to="/">
        Home
      </Link>
      <Link className="menu-title" getProps={isPartiallyActive} to="/gigs/">
        Gigs
      </Link>
      <Link className="menu-title" getProps={isPartiallyActive} to="/artists/">
        Artists
      </Link>
      <Link className="menu-title" getProps={isPartiallyActive} to="/venues/">
        Venues
      </Link>
      <Link className="menu-title" getProps={isPartiallyActive} to="/blog/">
        Articles
      </Link>
      <a className="rainbowBackground menu-title" id="vaultSessionsHeaderLink" href="/vaultsessions/" target="_blank">
        <span>
          VAULT
          <br />
          SESSIONS
        </span>
      </a>
    </Menu>
  )
})
