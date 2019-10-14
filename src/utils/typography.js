import Typography from 'typography'
import Noriega from 'typography-theme-noriega'

Noriega.overrideThemeStyles = () => ({
  body: {
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;',
  },
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  ul: {
    marginLeft: 'auto',
    paddingLeft: 'auto',
  },
})

delete Noriega.googleFonts

const typography = new Typography(Noriega)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
