import { rhythm } from '../utils/typography'

export const theme = {
  default: {
    headerHeight: rhythm(2),
    headerHeightMobile: rhythm(1.5),
    headerHeightMobileTwice: rhythm(3),
    headerHeightMobileWithSubheader: rhythm(2.5),
    headerHeightWithSubheader: rhythm(3.5),
    headerHeightNeg: rhythm(-2),
    footerHeight: rhythm(4),
    waveformColor: '#01baef',
    waveformProgressColor: '#EC4067',
    backgroundColor: '#0C1214',
    primaryColor: '#0C1821',
    foregroundColor: '#01baef',
    secondaryColor: '#EC4067',
    contrastColor: '#EFF1ED',
    textColor: '#ccc',
    contentContainerWidth: '740px',
    defaultBannerHeight: '70vh',
    breakpoints: {
      xs: '768px',
      md: '992px',
      lg: '1200px',
    },
  },
}
