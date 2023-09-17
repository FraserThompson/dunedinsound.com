import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import { SiteHead } from '../../components/SiteHead'
import styled from '@emotion/styled'
import { rhythm } from '../../utils/typography'
import { GigsJukebox } from '../../components/page/GigsJukebox'

const Page = React.memo(({ data, location }) => {
  const tabs = [
    { title: 'Timeline', href: '/gigs' },
    { title: 'Shuffle', href: '/gigs/shuffle' },
  ]

  return (
    <Layout location={location}>
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
        <GigsJukebox data={data} />
      </TabsContentWrapper>
    </Layout>
  )
})

export const pageQuery = graphql`
  query {
    gigs: allGigYaml {
      nodes {
        ...GigFrontmatter
      }
    }
    audio: allFile(filter: { sourceInstanceName: { eq: "media" }, ext: { in: [".json", ".mp3"] }, fields: { mediaDir: { eq: "gig" } } }) {
      group(field: { fields: { gigDir: SELECT } }) {
        fieldValue
        nodes {
          name
          relativeDirectory
          publicURL
          ext
        }
      }
    }
    artists: allArtistYaml {
      group(field: { title: SELECT }) {
        fieldValue
        nodes {
          fields {
            fileName
            slug
          }
          title
          bandcamp
          facebook
          instagram
        }
      }
    }
    venues: allVenueYaml {
      group(field: { fields: { fileName: SELECT } }) {
        fieldValue
        nodes {
          fields {
            fileName
            slug
          }
          title
        }
      }
    }
  }
`
export const Head = (params) => <SiteHead title={'Gig Jukebox'} {...params} />

const TabsContentWrapper = styled.div``

const Subheader = styled.div`
  position: fixed;
  top: 0;
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

  button,
  .button {
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
