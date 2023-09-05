import React, { useState } from 'react'
import FlexGridContainer from '../../components/FlexGridContainer'
import Tabs from '../../components/Tabs'
import ImageGallery from '../../components/ImageGallery'
import styled from '@emotion/styled'

export default React.memo(({ gigTiles, blogTiles, vaultsessionTiles, images, imageCaptions, gigCount, blogCount, vaultsessionCount }) => {
  const [openTab, setOpenTab] = useState('gigs')
  return (
    <>
      <Tabs sticky={'top'}>
        <button className={openTab === 'gigs' ? 'active' : ''} onClick={() => setOpenTab('gigs')}>
          Gigs <small>({gigCount})</small>
        </button>
        {images && (
          <button className={openTab === 'images' ? 'active' : ''} onClick={() => setOpenTab('images')}>
            Images <small>({images.length})</small>
          </button>
        )}
        {blogCount > 0 && (
          <button className={openTab === 'blogs' ? 'active' : ''} onClick={() => setOpenTab('blogs')}>
            Articles <small>({blogCount})</small>
          </button>
        )}
        {vaultsessionCount > 0 && (
          <button className={openTab === 'vaultsessions' ? 'active' : ''} onClick={() => setOpenTab('vaultsessions')}>
            <WrappingText className="rainbowBackground">VAULT SESSION</WrappingText>
          </button>
        )}
      </Tabs>
      {openTab === 'gigs' && gigTiles}
      {openTab === 'images' && <ImageGallery images={images} imageCaptions={imageCaptions} />}
      {openTab === 'blogs' && <FlexGridContainer>{blogTiles}</FlexGridContainer>}
      {openTab === 'vaultsessions' && <FlexGridContainer>{vaultsessionTiles}</FlexGridContainer>}
    </>
  )
})

const WrappingText = styled.div`
  letter-spacing: -0.2px;
  font-size: 0.8em;
  text-overflow: initial;
  width: 60px;
  line-height: 1;
  white-space: normal;
  word-break: break-word;
  align-items: center;
  height: 100%;
  word-wrap: break-word;
  display: flex;
`
