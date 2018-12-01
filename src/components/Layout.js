import React from 'react'
import SiteHeader from './SiteHeader'

import { rhythm, scale } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <div
        style={{
          maxWidth: '100vw'
        }}
      >
        <SiteHeader/>
        {children}
      </div>
    )
  }
}

export default Layout
