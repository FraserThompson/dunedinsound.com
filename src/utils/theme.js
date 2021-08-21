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
    waveformProgressColor: '#F71735',
    backgroundColor: '#08090C', // dark navy
    primaryColor: '#08090C', // navy
    foregroundColor: '#F1D302', // yellow
    secondaryColor: '#F71735', // pink
    contrastColor: '#FAF9F9', // ice white
    contrastColor2: '#2AA3FF', // cyan
    textColor: '#ccc',
    contentContainerWidth: '740px',
    defaultBannerHeight: '70vh',
    breakpoints: {
      xs: '768px',
      md: '992px',
      lg: '1600px',
    },
  },
}
