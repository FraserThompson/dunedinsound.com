import React, { useCallback } from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'
import { MdHome } from 'react-icons/md'

export default React.memo(props => {
  const isPartiallyActive = useCallback(({ isPartiallyCurrent }) => {
    return isPartiallyCurrent ? { className: 'active' } : null
  }, [])

  return (
    <Menu {...props} horizontal right open>
      <Link className="showMobile" activeClassName="active" to="/">
        <MdHome />
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
