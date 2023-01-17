import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'
import { SiteHead } from '../components/SiteHead'

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
  const description = 'This is a page that does not exist.'
  return <SiteHead title={'404'} description={description} {...params} />
}

export default Page
