import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const Content = styled.div`
  color: ${props => props.theme.textColor};
  padding: ${rhythm(0.5)};
`
export default Content;