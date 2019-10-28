import React, { useState } from 'react'
import FlexGridContainer from '../../components/FlexGridContainer'
import Tabs from '../../components/Tabs'

export default React.memo(({ gigTiles, blogTiles, vaultsessionTiles, gigCount, blogCount, vaultsessionCount }) => {
  const [openTab, setOpenTab] = useState('gigs')
  return (
    <>
      <Tabs sticky={'top'}>
        <button className={openTab === 'gigs' ? 'active' : ''} onClick={() => setOpenTab('gigs')}>
          Gigs <small>({gigCount})</small>
        </button>
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
      {openTab === 'blogs' && <FlexGridContainer>{blogTiles}</FlexGridContainer>}
      {openTab === 'vaultsessions' && <FlexGridContainer>{vaultsessionTiles}</FlexGridContainer>}
    </>
  )
})
