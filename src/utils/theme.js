import { rhythm } from '../utils/typography'

export const theme = {
  default: {
    headerHeight: rhythm(2),
    headerHeightMobile: rhythm(1.5),
    headerHeightMobileTwice: rhythm(3),
    headerHeightMobileWithSubheader: rhythm(2.5),
    headerHeightWithSubheader: rhythm(3.5),
    headerHeightNeg: rhythm(-2),
    footerHeight: '280px',
    waveformColor: '#01baef',
    waveformProgressColor: '#EC4067',
    backgroundColor: '#0C1214', // dark navy
    primaryColor: '#0C1821', // navy
    foregroundColor: '#FDE74C', // yellow
    secondaryColor: '#EC4067', // pink
    contrastColor: '#EFF1ED', // ice white
    contrastColor2: '#40e0d0', // cyan
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
