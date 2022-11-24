import React from 'react'
import { getSrc } from 'gatsby-plugin-image'

export const SiteHead = ({ description, title, cover = null, date = null, location, params, data, pageContext }) => {
  const image = cover && getSrc(cover)
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="dunedinsound" />
      <meta property="og:url" content={`https://dunedinsound.com${location.pathname}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={'article'} />
      {date && <meta itemprop="datePublished" content={date} />}
      {image && <meta property="og:image" content={image} />}
    </>
  )
}
