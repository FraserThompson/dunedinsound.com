import React from 'react'
import styled from '@emotion/styled'

export default () => (
  <UpdateYourFrickinBrowser>
    <h1>
      You're using a <i>really</i> old web browser and your internet experience will SUCK.
    </h1>
    <p>Seriously, stop using Internet Explorer. It's slow, insecure, and doesn't support all the things which make the internet cool.</p>
    <p>
      You should consider installing{' '}
      <a title="Google Chrome" target="_blank" href="https://www.google.com/chrome/">
        Google Chrome
      </a>{' '}
      or{' '}
      <a title="Google Chrome" target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">
        Mozilla Firefox
      </a>
      . Alternatively, if you're using Windows 10 you might already have{' '}
      <a title="Google Chrome" target="_blank" href="https://www.microsoft.com/en-nz/windows/microsoft-edge">
        Microsoft Edge
      </a>
      , try that.
    </p>
    <p>Until then you'll see this annoying message.</p>
  </UpdateYourFrickinBrowser>
)

const UpdateYourFrickinBrowser = styled.div`
  display: none;
  background-color: white;
  color: black;
  @media all and (-ms-high-contrast: none) {
    display: block;
  }
`
