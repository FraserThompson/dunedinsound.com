import React, { useState } from 'react'
import FlexGridContainer from '../../components/FlexGridContainer'
import Tabs from '../../components/Tabs'
import ImageGallery from '../../components/ImageGallery'

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
            <span className="rainbowBackground">VAULT SESSION</span>
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
