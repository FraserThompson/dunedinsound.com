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
    waveformColor: '#bfced9',
    waveformProgressColor: '#fffadf',
    backgroundColor: '#08090C', // dark navy
    primaryColor: '#0F0E0E', // smoky black
    foregroundColor: '#3f92f7', // lightblue
    secondaryColor: '#367e80', // teal
    contrastColor: '#FAF9F9', // ice white
    contrastColor2: '#ABEBD2', // mint
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
