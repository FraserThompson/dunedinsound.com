import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    header = (
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/gigs/">Gigs</Link></li>
        <li><Link to="/artists/">Artists</Link></li>
		    <li><Link to="/venues/">Venues</Link></li>
        <li><Link to="/blog/">Blog</Link></li>
      </ul>
    )

    return (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </div>
    )
  }
}

export default Layout
