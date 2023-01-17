import React from 'react'
import { getSrc } from 'gatsby-plugin-image'
import { graphql, useStaticQuery } from 'gatsby'

export const SiteHead = ({ description = null, title = null, cover = null, date = null, location }) => {
  const image = cover && getSrc(cover)

  const siteQuery = useStaticQuery(graphql`
    query Site {
      site {
        ...SiteInformation
      }
    }
  `)

  if (!title) {
    title = siteQuery.site.siteMetadata.title
  } else {
    title = `${title} | ${siteQuery.site.siteMetadata.title}`
  }

  if (!description) description = siteQuery.site.siteMetadata.description

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="dunedinsound" />
      <meta property="og:url" content={`https://dunedinsound.com${location.pathname}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={'article'} />
      {date && <meta itemProp="datePublished" content={date} />}
      {image && <meta property="og:image" content={image} />}
    </>
  )
}
