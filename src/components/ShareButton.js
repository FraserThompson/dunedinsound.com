import React from 'react'
import styled from '@emotion/styled'
import { FaShare } from 'react-icons/fa'

/**
 * A share button which invokes the Web Share API.
 *
 * Sharedata: Title, text, and URL
 */
export default React.memo(({ shareData }) => {
  const clickHandler = async (e) => {
    try {
      await navigator.share(shareData)
    } catch {
      console.error('Something went wrong.')
    }
  }

  return (
    <ShareButtonWrapper onClick={clickHandler}>
      <FaShare /> Share
    </ShareButtonWrapper>
  )
})

const ShareButtonWrapper = styled.button`
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-color: transparent;
  filter: drop-shadow(2px 2px 10px black);
  background-color: ${(props) => props.theme.contrastColor2};
  transition: filter 150ms ease-in-out;

  &:hover {
    filter: invert(1);
  }
`
