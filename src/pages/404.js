import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'

export default ({ location }) => (
  <Layout location={location}>
    <div className="wobbly-content">
      <h1 className="big">You've hit a dead link 😭</h1>
      <p>
        Maybe you were looking for a particular <Link to="/gigs/">gig</Link>?
      </p>
    </div>
  </Layout>
)
