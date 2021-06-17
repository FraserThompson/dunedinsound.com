import React, { useCallback } from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'

export default React.memo(props => {
  const isPartiallyActive = useCallback(({ isPartiallyCurrent }) => {
    return isPartiallyCurrent ? { className: 'active' } : null
  }, [])

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
      <a className="rainbowBackground" id="vaultSessionsHeaderLink" href="/vaultsessions/" target="_blank">
        <span>
          VAULT
          <br />
          SESSIONS
        </span>
      </a>
    </Menu>
  )
})
