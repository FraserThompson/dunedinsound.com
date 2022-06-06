import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Search from '../components/Search'
import SidebarNav from '../components/SidebarNav'
import { postFilter, scrollTo } from '../utils/helper'
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
    <SidebarNav toggle={toggleSidebar} open={open} left>
      <ul ref={ref} id="sidebarNav">
        {menuItems.map(({ year, months, count }, yearIndex) => (
          <li key={year}>
            <a onClick={(e) => click(e, year, yearIndex)} href={`#${year}`}>
              <strong>{year}</strong> <span className="label">({count})</span>
            </a>
            <ul>
              {months.map((month) => {
                const className = `${year}-${month}`
                return (
                  <li key={month}>
                    <a onClick={(e) => click(e, className, yearIndex)} href={`#${className}`}>
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

const Page = React.memo(({ data, location }) => {
  const allPosts = useMemo(() => data.gigsByDate.group.slice().reverse(), []) //because for some reason it returns it ascending order

  // Turn the posts sorted by years into two things:
  //    - A list of years and unique months for each year
  //    - A list of posts wrapped by year and month
  //    - A dict of yera and month by slug
  // Do this in one reduce for performance (albeit slightly worse readability)
  const sortPosts = useCallback((posts) => {
    return posts.reduce(
      (obj, group, index) => {
        const previousYear = index - 1 >= 0 && posts[index - 1].fieldValue.substring(0, 4)
        const previousMonth = index - 1 >= 0 && posts[index - 1].fieldValue.substring(4)

        const year = group.fieldValue.substring(0, 4)
        const month = group.fieldValue.substring(4)

        const monthName = monthNames[parseInt(month)]

        // Add year and month for each item by slug to postsBySlug.
        // This is solely so we can go back from a gig page and scroll to the right place.
        group.edges.forEach(({ node }) => (obj.postsBySlug[node.fields.slug] = { year: year, month: month }))

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
      { menuItems: [], posts: [], postsBySlug: {} }
    )
  }, [])

  const { menuItems: allMenuItems, posts: allPostsSorted, postsBySlug: postsBySlug } = useMemo(() => sortPosts(allPosts), []) //sort all of them and cache it

  const [displayedMenuItems, setDisplayedMenuItems] = useState(allMenuItems)
  const [postsSorted, setPostsSorted] = useState(allPostsSorted)
  const [pageUpTo, setPageUpTo] = useState(1)
  const [scrollToAnchor, setScrollToAnchor] = useState(null)
  const [gumshoe, setGumshoe] = useState(null)

  useEffect(() => {
    // If we came from a previous gig then load up and scroll to it
    if (typeof window !== `undefined` && window.previousPath) {
      const previousGigSlug = new URL(window.previousPath).pathname
      const gigDateData = postsBySlug[previousGigSlug]
      if (gigDateData) menuItemClick(previousGigSlug, parseInt(gigDateData['year']))
    }
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

  useEffect(() => scrollTo(null, scrollToAnchor, 57), [scrollToAnchor])

  useEffect(() => {
    if (typeof window !== `undefined`) window.scrollTo(0, 0)
  }, [postsSorted])

  useEffect(() => {
    if (gumshoe && postsSorted.length > 0) {
      gumshoe.setup()
      gumshoe.detect()
    }
  }, [postsSorted, pageUpTo])

  const filter = useCallback((searchInput) => {
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

  const menuItemClick = useCallback(
    (anchor, yearIndex) => {
      setPageUpTo(yearIndex + 1 > pageUpTo ? yearIndex + 1 : pageUpTo)
      setScrollToAnchor(anchor)
    },
    [pageUpTo]
  )

  const loadMore = useCallback((index) => setPageUpTo(index + 1), [])

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
        {/* <FutureGigsWrapper>
          <FutureGigs>
            <div className="title">CONGRATULATIONS</div>
            <div className="body">
              <p>
                <blink>YOU HAVE WON A GIG!</blink>
              </p>
              <p>
                COLLECT YOUR PRIZE NOW FROM: <br />
                <strong className="coolText">
                  <a href="https://www.r1.co.nz/gig-guide" target="_blank">
                    RAD TIMES GIG GUIDE at Radio One 91FM
                  </a>
                </strong>
              </p>
              <small>* redeem at venue of choice. door charge applies</small>
              <div className="buttons">
                <a href="https://www.r1.co.nz/gig-guide" target="_blank">
                  OK
                </a>
              </div>
            </div>
          </FutureGigs>
        </FutureGigsWrapper> */}
        <InfiniteScroll
          className="infinite-scroll"
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
                          <GigTile id={node.fields.slug} key={node.fields.slug} height="40vh" node={node} />
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

  .infinite-scroll {
    margin-top: ${(props) => `${props.theme.headerHeightMobile})`};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    .infinite-scroll {
      margin-top: ${(props) => `${props.theme.headerHeight})`};
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }
`

const FutureGigsWrapper = styled.div`
  border: 2px solid black;
  height: 350px;
  left: 0;
  position: fixed;
  top: ${(props) => props.theme.headerHeightMobile};
  width: 100%;
  background: teal;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    top: ${(props) => props.theme.headerHeight};
  }
`

const FutureGigs = styled.div`
  position: relative;
  margin: 1em;
  padding: 3px;
  max-width: ${(props) => props.theme.contentContainerWidth};
  box-shadow: inset -1px -1px #00138c, inset 1px 1px #0831d9, inset -2px -2px #001ea0, inset 2px 2px #166aee, inset -3px -3px #003bda, inset 3px 3px #0855dd;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0 0 3px;
  -webkit-font-smoothing: antialiased;
  background: #ece9d8;

  blink {
    animation: 0.5s linear infinite condemned_blink_effect;
  }

  @keyframes condemned_blink_effect {
    0% {
      visibility: hidden;
    }
    50% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }

  .title {
    color: white;
    font-family: Trebuchet MS;
    background: linear-gradient(180deg, #0997ff, #0053ee 8%, #0050ee 40%, #06f 88%, #06f 93%, #005bff 95%, #003dd7 96%, #003dd7);
    padding: 3px 5px 3px 3px;
    border-top: 1px solid #0831d9;
    border-left: 1px solid #0831d9;
    border-right: 1px solid #001ea0;
    border-top-left-radius: 8px;
    border-top-right-radius: 7px;
    font-size: 13px;
    text-shadow: 1px 1px #0f1089;
  }

  .body {
    color: black;
    padding: 8px;
    text-align: center;

    small {
      font-size: 60%;
      position: absolute;
      left: 10px;
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      margin-left: auto;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      min-height: 23px;
      min-width: 75px;
      padding: 0 12px;
      font-family: 'Pixelated MS Sans Serif', Arial;
      -webkit-font-smoothing: antialiased;
      font-size: 11px;
      box-sizing: border-box;
      border: 1px solid #003c74;
      background: linear-gradient(180deg, #fff, #ecebe5 86%, #d8d0c4);
      box-shadow: none;
      border-radius: 3px;
    }

    a:active {
      box-shadow: none;
      background: linear-gradient(180deg, #cdcac3, #e3e3db 8%, #e5e5de 94%, #f2f2f1);
    }

    a:focus {
      box-shadow: none;
      background: linear-gradient(180deg, #cdcac3, #e3e3db 8%, #e5e5de 94%, #f2f2f1);
    }
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

export default Page
