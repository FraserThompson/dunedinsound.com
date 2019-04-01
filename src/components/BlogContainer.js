import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import Content from './Content';

const BlogContainer = styled(Content)`
  max-width: ${props => props.theme.contentContainerWidth};
  height: 100%;
  width: 100%;
  color: black;
  a {
    color: black;
  }
`
export default BlogContainer;
