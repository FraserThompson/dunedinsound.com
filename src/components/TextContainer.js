import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import BlogContainer from './BlogContainer'

export default styled(BlogContainer)`
  padding: ${rhythm(0.5)};
  margin: ${(props) => (!props.leftAlign ? '0 auto' : '')};
  max-width: ${(props) => props.theme.contentContainerWidth};
`
