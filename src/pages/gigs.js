import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { GigsTimeline } from '../components/page/GigsTimeline'
import styled from '@emotion/styled'
import Subheader from '../components/Subheader'

const Page = React.memo(({ data, location }) => {
  const tabs = [
    { title: 'Timeline', href: '/gigs' },
    { title: 'Shuffle', href: '/gigs/shuffle' },
  ]

  return (
    <Layout location={location} hideBrandOnMobile={true} hideFooter={true} isSidebar={true}>
      <Subheader>
        <span>Mode: </span>
        <div>
          {tabs.map((tab) => (
            <Link className="button" activeStyle={{ backgroundColor: '#3f92f7', color: 'black' }} to={tab.href} key={tab.key}>
              {tab.title}
            </Link>
          ))}
        </div>
      </Subheader>
      <TabsContentWrapper>
        <GigsTimeline data={data} />
      </TabsContentWrapper>
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

const TabsContentWrapper = styled.div``

export default Page
