import React from 'react'
import { graphql } from 'gatsby'
import SiteHeader from './SiteHeader'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter'
import { lighten, darken } from 'polished'
import { Helmet } from 'react-helmet'
import SiteNav from './SiteNav'
import Menu from './Menu'
import { rhythm } from '../utils/typography'
import GlobalStyle from './GlobalStyle'

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 12;
  box-shadow: 0 6px 12px rgba(0,0,0,.25);
  border-bottom: 1px solid ${props => darken(0.025, props.theme.primaryColor)};
`
const SiteContainer = styled.div`
  min-height: ${props => `calc(100vh - ${props.theme.headerHeight} - ${props.theme.footerHeight} - ${rhythm(3)})`};
  background-color: ${props => props.overrideBackgroundColor};
  height: 100%;
  width: 100%;
`

const MobileNav = styled.div`
  height: ${props => props.theme.headerHeightMobile};
  background-color: ${props => props.theme.primaryColor};
  z-index: 12;
  width: 100%;
  ${Menu} {
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      flex-grow: 1;
      text-align: center;
    }
  }
`

class Layout extends React.PureComponent {

  render() {
    const { location, children } = this.props

    return (
      <ThemeProvider theme={this.props.theme || theme.default}>
        <>
          <Global styles={theme => GlobalStyle}/>
          <Helmet
            htmlAttributes={{ lang: 'en' }}
            title={this.props.title}
          >
            <meta name="description" content={this.props.description} />
            <meta property="og:site_name" content="dunedinsound" />
            <meta property="og:url" content={location.href} />
            <meta property="og:title" content={this.props.title} />
            <meta property="og:description" content={this.props.description} />
            {this.props.type && <meta property="og:type" content={this.props.type} />}
            {this.props.date && <meta itemprop="datePublished" content={this.props.date}/>}
            {this.props.image && <meta property="og:image" content={this.props.image} />}
          </Helmet>
          <HeaderWrapper>
            <MobileNav className="showMobile">
              <SiteNav backgroundColor={lighten(0.1, theme.default.primaryColor)} height={theme.default.headerHeightMobile}/>
            </MobileNav>
            <SiteHeader {...this.props}/>
          </HeaderWrapper>
          <SiteContainer overrideBackgroundColor={this.props.overrideBackgroundColor}>
            {children}
          </SiteContainer>
          {!this.props.hideFooter && <SiteFooter/> }
        </>
      </ThemeProvider>
    )
  }
}

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

  fragment TinyImage on File {
    childImageSharp {
      fluid(maxWidth: 200, quality: 80, srcSetBreakpoints: [ 50, 200, 400 ]) {
        ...GatsbyImageSharpFluid_withWebp
      }
    }
  }

  fragment SmallImage on File {
    childImageSharp {
      fluid(maxWidth: 400, quality: 80, srcSetBreakpoints: [ 100, 400, 800 ]) {
        ...GatsbyImageSharpFluid_withWebp
      }
    }
  }

  fragment MediumImage on File {
    childImageSharp {
      fluid(maxWidth: 800, quality: 80, srcSetBreakpoints: [ 200, 800, 1600 ]) {
        ...GatsbyImageSharpFluid_withWebp
      }
    }
  }

  fragment LargeImage on File {
    childImageSharp {
      fluid(maxWidth: 1600, quality: 80, srcSetBreakpoints: [ 400, 1600, 3200 ]) {
        ...GatsbyImageSharpFluid_withWebp
      }
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
      description
      artists {
        name
        tracklist {time, title}
        vid {
          link,
          title
        }
      }
      cover {
        ...LargeImage
      }
    }
  }

  fragment GigTileFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      date(formatString: "DD MMMM YYYY")
      venue
      description
      artists {
        name
        vid {
          link,
          title
        }
      }
      cover {
        ...LargeImage
      }
    }
  }

  fragment ArtistFrontmatter on MarkdownRemark {
    ...DefaultFields
    frontmatter {
      title
      bandcamp
      facebook
      soundcloud
      website
      origin
      cover {
        ...SmallImage
      }
    }
  }

`

export default Layout
