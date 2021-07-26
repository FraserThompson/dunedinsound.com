import React from 'react'

export default React.memo(({ frontmatter, liClassname }) => {
  return (
    <>
      {frontmatter.lat && (
        <li>
          <a
            title="Google Maps"
            className={liClassname}
            rel="noopener"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${frontmatter.lat},${frontmatter.lng}`}
          >
            Google Maps
          </a>
        </li>
      )}
      {frontmatter.facebook && (
        <li>
          <a title="Facebook Page" className={liClassname} rel="noopener" href={frontmatter.facebook}>
            Facebook
          </a>
        </li>
      )}
      {frontmatter.spotify && (
        <li>
          <a title="Listen on Spotify" className={liClassname} rel="noopener" href={frontmatter.spotify}>
            Spotify
          </a>
        </li>
      )}
      {frontmatter.bandcamp && (
        <li>
          <a title="Listen on Bandcamp" className={liClassname} rel="noopener" href={frontmatter.bandcamp}>
            Bandcamp
          </a>
        </li>
      )}
      {frontmatter.soundcloud && (
        <li>
          <a title="Listen on Soundcloud" className={liClassname} rel="noopener" href={frontmatter.soundcloud}>
            Soundcloud
          </a>
        </li>
      )}
      {frontmatter.website && (
        <li>
          <a title="Website" className={liClassname} rel="noopener" href={frontmatter.website}>
            Website
          </a>
        </li>
      )}
      {frontmatter.audioculture && (
        <li>
          <a title="Audioculture article" className={liClassname} rel="noopener" href={frontmatter.audioculture.link}>
            Audioculture
          </a>
        </li>
      )}
    </>
  )
})
