import { rhythm } from '../utils/typography'

const headerHeight = rhythm(2)
const headerHeightMobile = rhythm(1.5)
const subheaderHeight = '30px'

export const theme = {
  default: {
    headerHeight,
    headerHeightMobile,
    headerHeightMobileTwice: `calc(${headerHeightMobile} + ${headerHeightMobile})`,
    headerHeightMobileWithSubheader: `calc(${headerHeightMobile}  + 30px + 1px)`,
    headerHeightWithSubheader: `calc(${headerHeight} + 30px + 1px)`,
    headerHeightNeg: `-${headerHeight}`,
    subheaderHeight,
    footerHeight: '280px',
    waveformColor: '#bfced9',
    waveformProgressColor: '#fffadf',
    backgroundColor: '#08090C', // dark navy
    primaryColor: '#0F0E0E', // smoky black
    foregroundColor: '#3f92f7', // lightblue
    secondaryColor: '#367e80', // teal
    contrastColor: '#FAF9F9', // ice white
    contrastColor2: '#622196', // purple
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
