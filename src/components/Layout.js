import React from 'react'
import { graphql } from 'gatsby'
import SiteHeader from './SiteHeader'
import { Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter'
import { lighten, darken } from 'polished'
import { Helmet } from 'react-helmet'
import SiteNav from './SiteNav'
import Menu from './Menu'
import GlobalStyle from './GlobalStyle'
import UpdateYourFrickinBrowser from './UpdateYourFrickinBrowser'

export default React.memo(
  ({
    location,
    children,
    overrideBackgroundColor,
    description,
    title,
    type,
    date,
    image,
    hideFooter,
    hideNav = false,
    hideBrandOnMobile,
    headerContent,
    scrollHeaderContent,
    scrollHeaderOverlay,
    isSidebar,
  }) => (
    <ThemeProvider theme={theme.default}>
      <>
        <Global styles={(theme) => GlobalStyle} />
        <Helmet htmlAttributes={{ lang: 'en' }} title={title}>
          <meta name="description" content={description} />
          <meta property="og:site_name" content="dunedinsound" />
          <meta property="og:url" content={location.href} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          {type && <meta property="og:type" content={type} />}
          {date && <meta itemprop="datePublished" content={date} />}
          {image && <meta property="og:image" content={image} />}
        </Helmet>
        <UpdateYourFrickinBrowser />
        {!hideNav && (
          <HeaderWrapper>
            <MobileNav className="showMobile">
              <SiteNav height={theme.default.headerHeightMobile} />
            </MobileNav>
            <SiteHeader
              scrollHeaderOverlay={scrollHeaderOverlay}
              scrollHeaderContent={scrollHeaderContent}
              headerContent={headerContent}
              hideBrandOnMobile={hideBrandOnMobile}
              isSidebar={isSidebar}
            />
          </HeaderWrapper>
        )}
        <SiteContainer
          className="SiteContainer"
          hideFooter={hideFooter}
          hideNav={hideNav}
          hideBrandOnMobile={hideBrandOnMobile}
          headerContent={headerContent}
          overrideBackgroundColor={overrideBackgroundColor}
        >
          {children}
        </SiteContainer>
        {!hideFooter && <SiteFooter />}
      </>
    </ThemeProvider>
  )
)

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 12;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid ${(props) => darken(0.025, props.theme.primaryColor)};
`
const SiteContainer = styled.div`
  min-height: ${(props) => `calc(100vh - ${!props.hideNav ? props.theme.headerHeight : '0px'} - 1px)`};
  background-color: ${(props) => props.overrideBackgroundColor || props.theme.backgroundColor};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.8);
  height: 100%;
  width: 100%;
  z-index: 2;
  position: ${(props) => !props.hideFooter && 'relative'};
  bottom: 0;
  margin-bottom: ${(props) => !props.hideFooter && `calc(${props.theme.footerHeight} + 30px)`};
  margin-top: ${(props) => props.headerContent && props.theme.headerHeightMobile};
  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    margin-top: ${(props) => !props.hideNav && props.theme.headerHeight};
    margin-bottom: ${(props) => !props.hideFooter && props.theme.footerHeight};
  }
`

const MobileNav = styled.div`
  position: fixed;
  bottom: 0;
  height: ${(props) => props.theme.headerHeightMobile};
  background-color: ${(props) => props.theme.primaryColor};
  z-index: 12;
  width: 100%;
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.25);
  border-top: 1px solid ${(props) => darken(0.025, props.theme.primaryColor)};
  ${Menu} {
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      flex-grow: 1;
      padding: 0;
      text-align: center;
      letter-spacing: -1px;
    }
  }
`

export const query = graphql`
  fragment SiteInformation on Site {
    siteMetadata {
      title
      description
    }
  }

  fragment DefaultFields on MarkdownRemark {
    fields {
      slug
      type
      machine_name
      parentDir
    }
  }

  fragment SmallImage on File {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED, outputPixelDensities: [0.5, 1, 2], width: 400)
    }
  }

  fragment MediumImage on File {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED, outputPixelDensities: [0.5, 1, 2], width: 800)
    }
  }

  fragment LargeImage on File {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED, outputPixelDensities: [0.5, 1, 2], width: 1600)
    }
  }

  fragment FullImage on File {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
    }
  }

  fragment VenueFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      description
      lat
      lng
      bandcamp
      facebook
      website
      died
      soundcloud
      cover {
        ...SmallImage
      }
    }
  }

  fragment BlogFrontmatter on MarkdownRemark {
    excerpt
    html
    ...DefaultFields
    frontmatter {
      title
      tags
      featureMode
      hideCaptions
      gallery
      cover {
        ...LargeImage
      }
      date(formatString: "DD MMMM YYYY")
    }
  }

  fragment GigFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      date(formatString: "DD MMMM YYYY")
      venue
      feature_vid
      description
      audioOnly
      artists {
        name
        tracklist {
          time
          title
        }
        vid {
          link
          title
        }
      }
      cover {
        ...FullImage
      }
    }
  }

  fragment GigTileFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      date(formatString: "DD MMMM YYYY")
      description
      artists {
        name
      }
      cover {
        ...LargeImage
      }
    }
  }

  fragment GigTileSmallFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      date(formatString: "DD MMMM YYYY")
      description
      artists {
        name
      }
      cover {
        ...MediumImage
      }
    }
  }

  fragment ArtistFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      bandcamp
      facebook
      instagram
      soundcloud
      spotify
      website
      origin
      died
      audioculture {
        link
        snippet
        image
      }
      cover {
        ...SmallImage
      }
    }
  }
`
