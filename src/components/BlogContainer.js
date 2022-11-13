import styled from '@emotion/styled'
import { invert } from 'polished'

export default styled.div`
  height: 100%;
  width: 100%;
  color: ${(props) => invert(props.theme.textColor)};

  pre {
    background-color: #1e1e1e;
    color: #cccccc;
    overflow: auto;
    font-family: 'Monaco', monospace;
    padding: 0 1em;
  }

  h2 {
    a:link,
    a:visited {
      color: black;
    }
  }

  a:link,
  a:visited {
    color: #000080;
  }

  a:hover {
    color: ${(props) => props.theme.secondaryColor};
  }

  code {
    font-family: Monaco, monospace;
    line-height: 100%;
    background-color: #eee;
    padding: 0.2em;
    letter-spacing: -0.05em;
    word-break: normal;
  }

  pre code {
    border: none;
    background: none;
    line-height: 1em;
    letter-spacing: normal;
    word-break: break-all;
  }

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
