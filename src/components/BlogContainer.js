import styled from 'styled-components'
import Content from './Content'
import { darken } from 'polished'

const BlogContainer = styled(Content)`
  max-width: ${props => props.theme.contentContainerWidth};
  height: 100%;
  width: 100%;
  color: black;

  .youtubeEmbed {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px; height: 0; overflow: hidden;
  }

  .youtubeEmbed iframe,
  .youtubeEmbed object,
  .youtubeEmbed embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  a {
    color: ${props => darken(0.2, props.theme.highlightColor)};
    text-decoration: none;
    &:hover {
      color: ${props => props.theme.highlightColor2};
    }
  }
`
export default BlogContainer;
