import React, { useState, useMemo } from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import { graphqlGroupToObject } from '../../utils/helper'
import { SiteHead } from '../../components/SiteHead'
import styled from '@emotion/styled'
import Subheader from '../../components/Subheader'
import VenuesTimeline from '../../components/page/VenuesTimeline'

const Page = React.memo(({ data, location }) => {
  const tabs = [
    { title: 'Directory', href: '/venues' },
    { title: 'Timeline', href: '/venues/timeline' },
  ]

  const covers = useMemo(() => graphqlGroupToObject(data.covers.group))

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
      <Content>
        <VenuesTimeline venues={data.allVenues.nodes} covers={covers} />
      </Content>
    </Layout>
  )
})

const Content = styled.div`
  position: relative;
  overflow: hidden;
  top: ${(props) => props.theme.subheaderHeight};
`

export const Head = (params) => <SiteHead title={'Venues'} {...params} />

export const pageQuery = graphql`
  query {
    allVenues: allVenueYaml(sort: { date: ASC }) {
      nodes {
        ...VenueFrontmatter
      }
    }
    covers: allFile(filter: { sourceInstanceName: { eq: "media" }, fields: { mediaDir: { eq: "venue" } }, name: { eq: "cover" } }) {
      group(field: { fields: { parentDir: SELECT } }) {
        fieldValue
        nodes {
          ...SmallImage
        }
      }
    }
  }
`

export default Page
