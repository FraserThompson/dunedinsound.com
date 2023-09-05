import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { GigsTimeline } from '../components/page/GigsTimeline'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import { GigsJukebox } from '../components/page/GigsJukebox'

const Page = React.memo(({ data, location }) => {
  const [openTab, setOpenTab] = useState()
  const tabs = [
    { title: 'Timeline', key: 'timeline' },
    { title: 'Shuffle', key: 'shuffle' },
  ]

  useEffect(() => {
    if (window.location.hash) {
      setOpenTab(window.location.hash.slice(1))
    } else {
      setOpenTab('timeline')
    }
  }, [])

  useEffect(() => {
    history.replaceState(undefined, undefined, '#' + openTab)
  }, [openTab])

  return (
    <Layout location={location} hideBrandOnMobile={true} hideFooter={true} isSidebar={true}>
      <Subheader>
        <span>Mode: </span>
        <div>
          {tabs.map((tab) => (
            <button className={openTab === tab.key ? 'active' : ''} href={`#${tab.key}`} onClick={() => setOpenTab(tab.key)}>
              {tab.title}
            </button>
          ))}
        </div>
      </Subheader>
      <TabsContentWrapper>
        {openTab == 'timeline' && <GigsTimeline data={data} />}
        {openTab == 'shuffle' && <GigsJukebox data={data} />}
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

const Subheader = styled.div`
  position: fixed;
  top: ${(props) => props.theme.headerHeightMobile};
  z-index: 8;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  display: flex;
  align-items: center;

  color: black;
  border-bottom: 1px solid black;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);

  font-size: 80%;
  width: 100%;
  min-height: ${(props) => props.theme.subheaderHeight};

  background-color: ${(props) => props.theme.contrastColor};

  > div,
  span {
    margin-right: ${rhythm(0.5)};
  }

  button {
    border: none;
    background-color: black;
    &.active,
    &:active {
      color: black;
      background-color: ${(props) => props.theme.foregroundColor};
    }
  }
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    position: fixed;
    top: ${(props) => props.theme.headerHeight};
  }
`

export default Page
