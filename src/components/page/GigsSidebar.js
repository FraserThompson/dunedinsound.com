import React, { useState, useCallback, useEffect, useRef } from 'react'
import SidebarNav from '../SidebarNav'
import { theme } from '../../utils/theme'

export const GigsSidebar = React.memo(({ menuItems, menuItemClick }) => {
  const [open, setOpen] = useState(true)
  const ref = useRef()

  useEffect(() => {
    document.addEventListener('gumshoeActivate', scrollToActive)
    return () => document.removeEventListener('gumshoeActivate', scrollToActive)
  }, [])

  const scrollToActive = useCallback(
    (event) => {
      const year = event.target.parentElement.parentElement
      ref.current.scrollTop = year.offsetTop
    },
    [ref]
  )

  const toggleSidebar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const click = useCallback(
    (e, year, yearIndex) => {
      e.preventDefault()
      e.stopPropagation()
      setOpen(true)
      menuItemClick && menuItemClick(year, yearIndex)
    },
    [menuItemClick]
  )

  return (
    <SidebarNav toggle={toggleSidebar} open={open} topOffset={theme.default.subheaderHeight} left>
      <ul ref={ref} id="sidebarNav">
        {menuItems.map(({ year, months, count }, yearIndex) => (
          <li key={year}>
            <a onClick={(e) => click(e, year, yearIndex)} className="menu-title" href={`#${year}`}>
              <strong>{year}</strong> <span className="label">({count})</span>
            </a>
            <ul>
              {months.map((month) => {
                const className = `${year}-${month}`
                return (
                  <li key={month}>
                    <a onClick={(e) => click(e, className, yearIndex)} className="menu-title" href={`#${className}`}>
                      {month}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </SidebarNav>
  )
})
