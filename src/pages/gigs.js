import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { postFilter } from '../utils/helper'
import GigTile from '../components/GigTile'
import 'gumshoejs/src/js/gumshoe/_closest.polyfill'
import 'gumshoejs/src/js/gumshoe/_customEvent.polyfill'
import Gumshoe from 'gumshoejs/src/js/gumshoe/gumshoe'
import InfiniteScroll from 'react-infinite-scroller'
import Divider from '../components/Divider'
import LoadingSpinner from '../components/LoadingSpinner'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const Sidebar = React.memo(({ menuItems, menuItemClick }) => {
  const [open, setOpen] = useState(true)

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
    <SidebarNav toggle={toggleSidebar} open={open} left>
      <ul id="sidebarNav">
        {menuItems.map(({ year, months, count }, yearIndex) => (
          <li key={year}>
            <a onClick={e => click(e, year, yearIndex)} href={`#${year}`}>
              <strong>{year}</strong> <span className="label">({count})</span>
            </a>
            <ul>
              {months.map(month => {
                const className = `${year}-${month}`
                return (
                  <li key={month}>
                    <a onClick={e => click(e, className, yearIndex)} href={`#${className}`}>
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

export default React.memo(({ data, location }) => {
  const allPosts = useMemo(() => data.gigsByDate.group.slice().reverse(), []) //because for some reason it returns it ascending order

  // Turn the posts sorted by years into two things:
  //    - A list of years and unique months for each year
  //    - A list of posts wrapped by year and month
  // Do this in one reduce for performance (albeit slightly worse readability)
  const sortPosts = useCallback(posts => {
    return posts.reduce(
      (obj, group, index) => {
        const previousYear = index - 1 >= 0 && posts[index - 1].fieldValue.substring(0, 4)
        const previousMonth = index - 1 >= 0 && posts[index - 1].fieldValue.substring(4)

        const year = group.fieldValue.substring(0, 4)
        const month = group.fieldValue.substring(4)

        const monthName = monthNames[parseInt(month)]

        if (year != previousYear) {
          obj.menuItems.push({ year: year, count: group.edges.length, months: [monthName] })
          obj.posts.push({ year: year, months: [{ month: monthName, posts: group.edges }] })
        } else {
          obj.menuItems[obj.menuItems.length - 1].months.push(monthName)
          obj.menuItems[obj.menuItems.length - 1].count = obj.menuItems[obj.menuItems.length - 1].count + group.edges.length
          if (month != previousMonth) {
            obj.posts[obj.posts.length - 1].months.push({ month: monthName, posts: group.edges })
          } else {
            obj.posts[obj.posts.length - 1].months[obj.posts[obj.posts.length - 1].months.length - 1].posts.push(group.edges)
          }
        }

        return obj
      },
      { menuItems: [], posts: [] }
    )
  }, [])

  const { menuItems: allMenuItems, posts: allPostsSorted } = useMemo(() => sortPosts(allPosts), []) //sort all of them and cache it

  const [displayedMenuItems, setDisplayedMenuItems] = useState(allMenuItems)
  const [postsSorted, setPostsSorted] = useState(allPostsSorted)
  const [pageUpTo, setPageUpTo] = useState(1)
  const [scrollToAnchor, setScrollToAnchor] = useState(null)
  const [gumshoe, setGumshoe] = useState(null)

  const yearPages = { '2019': 0, '2018': 1, '2017': 2, '2016': 3, '2015': 4, '2014': 5 } //should refactor this to be dynamic

  const scrollToGig = useCallback((anchor, year) => {
    menuItemClick(anchor, yearPages[year])
  }, [])

  useEffect(() => {
    location.state && location.state.gigFrom && scrollToGig(location.state.gigFrom.slug, location.state.gigFrom.year)
    setGumshoe(
      new Gumshoe('#sidebarNav a', {
        offset: 120,
        nested: true,
        nestedClass: 'active-parent',
      })
    )
  }, [])

  useEffect(() => {
    return () => gumshoe && gumshoe.destroy()
  }, [gumshoe])

  useEffect(() => scrollTo(scrollToAnchor), [scrollToAnchor])

  useEffect(() => {
    if (typeof window !== `undefined`) window.scrollTo(0, 0)
  }, [postsSorted])

  useEffect(() => {
    if (gumshoe && postsSorted.length > 0) {
      gumshoe.setup()
      gumshoe.detect()
    }
  }, [postsSorted, pageUpTo])

  const filter = useCallback(searchInput => {
    if (!searchInput || searchInput.length == 0) {
      setPostsSorted(allPostsSorted)
      setDisplayedMenuItems(allMenuItems)
      setPageUpTo(1)
    } else {
      const filteredPosts = postFilter(searchInput, allPosts)
      const { menuItems, posts } = sortPosts(filteredPosts)
      setPostsSorted(posts)
      setDisplayedMenuItems(menuItems)
      setPageUpTo(1)
    }
  }, [])

  const scrollTo = useCallback(anchor => {
    if (anchor) {
      const element = document.getElementById(anchor)
      if (typeof window !== `undefined`) {
        const y = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo(0, y - 90)
      }
    }
  }, [])

  const menuItemClick = useCallback(
    (anchor, yearIndex) => {
      setPageUpTo(yearIndex + 1 > pageUpTo ? yearIndex + 1 : pageUpTo)
      setScrollToAnchor(anchor)
    },
    [pageUpTo]
  )

  const loadMore = useCallback(index => setPageUpTo(index + 1), [])

  return (
    <Layout
      location={location}
      description={data.site.siteMetadata.description}
      title={`Gigs | ${data.site.siteMetadata.title}`}
      hideBrandOnMobile={true}
      hideFooter={true}
      isSidebar={true}
      headerContent={<Search placeholder="Search gigs by title, artist, or venue..." filter={filter} />}
    >
      <Sidebar menuItems={displayedMenuItems} menuItemClick={menuItemClick} />
      <PageContentWrapper>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={pageUpTo < allPostsSorted.length}
          loader={
            <div key={0} style={{ width: '100%', height: '20vh', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <LoadingSpinner />
            </div>
          }
        >
          {postsSorted.map(
            ({ year, months }, index) =>
              index < pageUpTo && (
                <section key={year} id={year}>
                  <Divider>
                    <strong>{year}</strong>
                  </Divider>
                  {months.map(({ month, posts }) => {
                    const id = `${year}-${month}`
                    return (
                      <section data-yearindex={index} key={id} id={id}>
                        {posts.map(({ node }) => (
                          <GigTile id={node.fields.slug} key={node.fields.slug} height="30vh" node={node} imageSizes={{ xs: 12, sm: 8, lg: 8 }} />
                        ))}
                      </section>
                    )
                  })}
                </section>
              )
          )}
        </InfiniteScroll>
      </PageContentWrapper>
    </Layout>
  )
})

const PageContentWrapper = styled.div`
  padding-left: 0px;

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }
`

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    gigsByDate: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { eq: "gigs" } } }) {
      group(field: fields___yearAndMonth) {
        fieldValue
        edges {
          node {
            ...GigTileFrontmatter
          }
        }
      }
    }
  }
`
