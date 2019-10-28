import styled from '@emotion/styled'
import Content from './Content'
import { invert } from 'polished'

export default styled(Content)`
  max-width: ${props => props.theme.contentContainerWidth};
  height: 100%;
  width: 100%;
  color: ${props => invert(props.theme.textColor)};

  .youtubeEmbed {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;
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
`
