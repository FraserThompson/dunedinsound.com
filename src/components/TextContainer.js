import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import BlogContainer from './BlogContainer'

export default styled(BlogContainer)`
  padding-top: ${rhythm(0.5)};
  p,
  ul {
    font-size: ${(props) => (!props.featureMode ? '18px' : '21px')};
    max-width: ${(props) => props.theme.contentContainerWidth};
    margin: ${(props) => (!props.leftAlign ? '20px auto' : '')};
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};

    @media screen and (min-width: ${(props) => props.theme.breakpoints.lg}) {
      font-size: ${(props) => (!props.featureMode ? '20px' : '24px')};
    }
  }
  small {
    font-size: ${(props) => (!props.featureMode ? '60%' : '80%')};
    color: #bbb;
  }
  blockquote {
    font-style: italic;
    font-size: 140%;
    color: ${(props) => props.theme.primaryColor};
  }
  figure {
    max-width: ${(props) => (!props.featureMode ? props.theme.contentContainerWidth : 'initial')};
    margin-bottom: ${(props) => (!props.featureMode ? '1.61rem' : '0')};
  }
  figcaption {
    display: ${(props) => (!props.hideCaptions ? 'inline-block' : 'none')};
  }
`
