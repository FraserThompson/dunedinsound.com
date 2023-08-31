import React, { useState, useCallback } from 'react'
import SidebarNav from '../SidebarNav'
import ActiveIndicator from '../ActiveIndicator'

export const VenuesSidebar = ({ menuItems, menuItemClick, setRef, selected }) => {
  const [open, setOpen] = useState(true)

  const toggleSidebar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const click = useCallback(
    (index) => {
      setOpen(true)
      menuItemClick && menuItemClick(index)
    },
    [menuItemClick]
  )

  return (
    <SidebarNav toggle={toggleSidebar} open={open} left>
      <ul>
        {menuItems.map((node, index) => (
          <li key={index} ref={setRef} className={index === selected ? 'active' : ''}>
            <a onClick={() => click(index)}>
              {node.title}
              <div style={{ position: 'absolute', right: '0px', top: '0px' }}>
                <ActiveIndicator died={node.died} hideText={true} />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SidebarNav>
  )
}
