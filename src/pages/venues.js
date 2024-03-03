import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import { graphqlGroupToObject } from '../utils/helper'
import Search from '../components/Search'
import { SiteHead } from '../components/SiteHead'
import VenuesMap from '../components/page/VenuesMap'
import styled from '@emotion/styled'
import Subheader from '../components/Subheader'

const Page = React.memo(({ data, location }) => {
  const tabs = [{ title: 'Directory', href: '/venues' }]

  const [filteredPosts, setFilteredPosts] = useState(data.allVenues.nodes)

  const [hideInactive, setHideInactive] = useState(false)
  const [hideActive, setHideActive] = useState(false)

  const gigCount = useMemo(
    () =>
      data.gigCountByVenue['group'].reduce((obj, item) => {
        obj[item.fieldValue] = item.totalCount
        return obj
      }),
    [data],
    []
  )

  const covers = useMemo(() => graphqlGroupToObject(data.covers.group))

  const searchFilter = useCallback(
    (searchInput) => {
      if (!searchInput || searchInput.length == 0) {
        const filteredPosts = data.allVenues.nodes
        setFilteredPosts(filteredPosts)
      } else {
        const filteredPosts = data.allVenues.nodes.filter((node) => node.title.toLowerCase().includes(searchInput))
        setFilteredPosts(filteredPosts)
      }
    },
    [data.allVenues.nodes]
  )

  // Hide inactive venues when they toggle it
  useEffect(() => {
    const newFilteredPosts = data.allVenues.nodes.filter((node) => (!hideActive && node.died === null) || (!hideInactive && node.died !== null))
    setFilteredPosts(newFilteredPosts)
  }, [hideInactive, hideActive])

  return (
    <Layout
      location={location}
      hideBrandOnMobile={true}
      hideFooter={true}
      isSidebar={true}
      headerContent={<Search placeholder="Search venues" filter={searchFilter} />}
    >
      <Subheader>
        <span>Mode: </span>
        <div>
          {tabs.map((tab) => (
            <Link className="button" activeStyle={{ backgroundColor: '#3f92f7', color: 'black' }} to={tab.href} key={tab.key}>
              {tab.title}
            </Link>
          ))}
        </div>
        <HideFilters>
          <label>
            <input name="hideInactive" type="checkbox" checked={hideInactive} onChange={() => setHideInactive(!hideInactive)} />
            Hide dead
          </label>
          <label>
            <input name="hideActive" type="checkbox" checked={hideActive} onChange={() => setHideActive(!hideActive)} />
            Hide alive
          </label>
        </HideFilters>
      </Subheader>
      <Content>
        <VenuesMap filteredPosts={filteredPosts} covers={covers} gigCount={gigCount} />
      </Content>
    </Layout>
  )
})

const HideFilters = styled.div`
  input,
  label {
    margin-right: 5px;
  }
  display: flex;
  margin-left: auto;
`

const Content = styled.div`
  position: relative;
  overflow: hidden;
  top: ${(props) => props.theme.subheaderHeight};
`

export const Head = (params) => <SiteHead title={'Venues'} {...params} />

export const pageQuery = graphql`
  query {
    allVenues: allVenueYaml(sort: { title: ASC }) {
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
    gigCountByVenue: allGigYaml(sort: { date: DESC }) {
      group(field: { venue: SELECT }) {
        fieldValue
        totalCount
      }
    }
  }
`

export default Page
