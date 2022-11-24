import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'

const Page = ({ location }) => (
  <Layout location={location}>
    <div className="wobbly-content">
      <h1 className="big">You've hit a dead link 😭</h1>
      <p>
        Maybe you were looking for a particular <Link to="/gigs/">gig</Link>?
      </p>
    </div>
  </Layout>
)

export const Head = (params) => {
  const title = `${params.data.site.siteMetadata.title}`
  const description = params.data.site.siteMetadata.description

  return <SiteHead title={title} description={description} {...params} />
}

export default Page
