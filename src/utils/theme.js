import { rhythm } from '../utils/typography'

export const theme = {
    default: {
        headerHeight: rhythm(2),
        headerHeightMobile: rhythm(1),
        headerHeightWithMobile: rhythm(3),
        headerHeightNeg: rhythm(-2),
        footerHeight: rhythm(4),
        waveformColor: "#01baef",
        waveformProgressColor: "#EC4067",
        backgroundColor: "#0C1214",
        headerColor: "#0C1821",
        highlightColor: "#01baef",
        highlightColor2: "#EC4067",
        contrastColor: "#EFF1ED",
        textColor: "#ccc",
        contentContainerWidth: "740px",
        breakpoints: {
          xs: "768px",
          md: "992px",
          lg: "1200px"
        }
    }
}
