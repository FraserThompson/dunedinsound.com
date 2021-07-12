import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import BlogContainer from '../../components/BlogContainer'
import styled from '@emotion/styled'
import { rhythm } from '../../utils/typography'

const Page = React.memo(({ data }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const siteDescription = post.excerpt ? post.excerpt : data.site.siteMetadata.description

  const totalImages = data.files.group.find((group) => group.fieldValue == 'jpg').totalCount.toLocaleString()
  const totalAudio = data.files.group.find((group) => group.fieldValue == 'mp3').totalCount.toLocaleString()

  const currentYear = new Date().getFullYear()

  return (
    <Layout
      location={typeof window !== `undefined` && window.location}
      description={siteDescription}
      title={`${post.frontmatter.title} | ${siteTitle}`}
      overrideBackgroundColor="white"
    >
      <Header>
        <div className="content">
          <div className="title">
            <h1>THE DUNEDINSOUND.COM UNIVERSE</h1>
          </div>
          <MetadataTable>
            <tbody>
              {data.counts.group.map((group) => (
                <tr key={group.fieldValue}>
                  <td>{group.fieldValue}</td>
                  <td>{group.totalCount}</td>
                </tr>
              ))}
              <tr>
                <td>photos</td>
                <td>{totalImages}</td>
              </tr>
              <tr>
                <td>audio</td>
                <td>{totalAudio}</td>
              </tr>
              <tr>
                <td>years in operation</td>
                <td>{currentYear - 2014}</td>
              </tr>
            </tbody>
          </MetadataTable>
        </div>
      </Header>
      <BlogContainer>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </BlogContainer>
    </Layout>
  )
})

const Header = styled.div`
  background-color: black;
  background-image: radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 40px),
    radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 30px), radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 40px),
    radial-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1) 2px, transparent 30px);
  background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
  background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;

  .content {
    max-width: ${(props) => props.theme.contentContainerWidth};
    padding: ${rhythm(0.5)};
    margin: 0 auto;
  }

  .title {
    max-width: ${(props) => props.theme.contentContainerWidth};
    margin: 0 auto;
    border-bottom: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
    position: relative;
  }

  .title:after {
    position: absolute;
    bottom: -5px;
    left: 0;
    content: '';
    width: 100%;
    opacity: 0;
    border-bottom: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to right, #00ccd5, #d53a9d);
    animation: 2s fade infinite;
    animation-direction: alternate;
  }

  @keyframes fade {
    to {
      opacity: 1;
    }
  }

  h1 {
    text-align-last: justify;
    margin: 0;
  }
`

const MetadataTable = styled.table`
  tr {
    border-bottom: 1px solid white;
  }

  td:nth-of-type(2n) {
    text-align: right;
  }
`

export const pageQuery = graphql`
  query PageInfoPostBySlug($slug: String!) {
    site {
      ...SiteInformation
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...BlogFrontmatter
    }
    counts: allMarkdownRemark(filter: { fields: { type: { regex: "/gigs|artists|venues$/" } } }) {
      group(field: fields___type) {
        fieldValue
        totalCount
      }
    }
    files: allFile(filter: { name: { ne: "cover.jpg" } }) {
      group(field: extension) {
        fieldValue
        totalCount
      }
    }
  }
`

export default Page
