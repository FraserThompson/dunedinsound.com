import React from 'react'
import SiteHeader from './SiteHeader'
import styled, { ThemeProvider } from "styled-components"
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter';
import { lighten } from 'polished';
import { Helmet } from 'react-helmet';
import SiteNav from './SiteNav';
import Menu from './Menu';
import { rhythm } from '../utils/typography';
import GlobalStyle from './GlobalStyle';

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 12;
`
const SiteContainer = styled.div`
  min-height: ${props => "calc(100vh - " + props.theme.headerHeight + " - " + props.theme.footerHeight + " - " + rhythm(3) + ")"};
  background-color: ${props => props.overrideBackgroundColor};
  height: 100%;
  width: 100%;
`

const MobileNav = styled.div`
  height: ${props => props.theme.headerHeightMobile};
  background-color: ${props => props.theme.headerColor};
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

class Layout extends React.Component {

  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <ThemeProvider theme={this.props.theme || theme.default}>
        <>
          <Helmet
            htmlAttributes={{ lang: 'en' }}
            meta={[{ name: 'description', content: this.props.description }]}
            title={this.props.title}
          />
          <GlobalStyle/>
          <HeaderWrapper>
            <MobileNav className="showMobile">
              <SiteNav backgroundColor={lighten(0.1, theme.default.headerColor)} height={theme.default.headerHeightMobile}/>
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

export default Layout
