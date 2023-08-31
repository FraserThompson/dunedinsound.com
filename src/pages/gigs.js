import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import Tabs from '../components/Tabs'
import { GigsTimeline } from '../components/page/GigsTimeline'

const Page = React.memo(({ data, location }) => {
  const [openTab, setOpenTab] = useState('timeline')
  return (
    <Layout location={location} hideBrandOnMobile={true} hideFooter={true} isSidebar={true}>
      <GigsTimeline data={data} />
    </Layout>
  )
})

export const pageQuery = graphql`
  query {
    gigsByDate: allGigYaml(sort: { date: DESC }) {
      group(field: { fields: { yearAndMonth: SELECT } }) {
        fieldValue
        nodes {
          ...GigTileFrontmatter
        }
      }
    }
  }
`
export const Head = (params) => <SiteHead title={'Gigs'} {...params} />

export default Page
