import React from 'react'
import { graphql } from 'gatsby'
import SiteHeader from './SiteHeader'
import { Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from '../utils/theme'
import 'react-18-image-lightbox/style.css'
import SiteFooter from './SiteFooter'
import { darken } from 'polished'
import SiteNav from './SiteNav'
import Menu from './Menu'
import GlobalStyle from './GlobalStyle'
import UpdateYourFrickinBrowser from './UpdateYourFrickinBrowser'
import GoatCounter from './GoatCounter'

export default React.memo(
  ({
    location,
    children,
    overrideBackgroundColor,
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
        <GoatCounter />
        <Global styles={(theme) => GlobalStyle} />
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
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
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

  fragment VenueFrontmatter on VenueYaml {
    fields {
      slug
      fileName
    }
    title
    description
    lat
    lng
    facebook
    website
    died
  }

  fragment BlogFrontmatter on Mdx {
    excerpt
    fields {
      type
      slug
    }
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

  fragment GigFrontmatter on GigYaml {
    fields {
      type
      slug
      fileName
    }
    title
    date(formatString: "DD MMMM YYYY")
    venue
    feature_vid
    description
    intro
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
  }

  fragment GigTileFrontmatter on GigYaml {
    fields {
      type
      slug
      fileName
    }
    title
    date(formatString: "DD MMMM YYYY")
    description
    venue
    artists {
      name
    }
  }

  fragment ArtistFrontmatter on ArtistYaml {
    fields {
      slug
      fileName
    }
    title
    description
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
  }

  fragment VaultsessionFrontmatter on VaultsessionYaml {
    fields {
      slug
      fileName
    }
    date(formatString: "DD MMMM YYYY")
    title
    artist
    full_video
    description
    tracklist {
      title
      time
      link
    }
  }
`
