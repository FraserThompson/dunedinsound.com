---
title: 'Welcome to the future'
date: 2019-04-28T21:00:00.000Z
tags:
  - Tech
author: Fraser Thompson
background_position: center
background_size: contain
description: You might have noticed things are looking a little different. Find out why.
cover: ./cover.jpg
---

You might have noticed things are looking a little different.

That's because the site has been completely rebuilt from the ground up using superior, more modern technologies which will make it easier to maintain and improve going forward.

Aside from this there's also been a few bonus features implemented along the way:

- <span class="rainbowBackground">Bold</span> new colour scheme
- See all <a href="/venues/">venues on a map!</a>
- Artist gigs sorted by year (handy for pages like <a href="/artists/the_rothmans/">this one</a> with like 50 gigs)
- Improved audio player user experience
- Better quality images: Access to all images at their original resolution.
- Improved mobile user experience

It's the culmination of many months of sporadic work. If you want to know more about the process and reasoning in _excruciating_ detail then read on (if not start using the rest of the site and let me know what you think).

## Why even bother?

The site first started as literally a plain list of gigs and the design has been improved iteratively since then. This method of working is great because the hardest part of any project is starting out and if you start small (ie. you don't try to include too many things in your initial release) it makes getting over that initial hump way easier. But you'll inherently end up with a lot of technical debt. Because you didn't know what the future of the project would look like, the decisions you made early in the process will come back to bite you.

That was the issue with the old version of dunedinsound.com. It was made using a static site generator called [Jekyll](https://jekyllrb.com/) because that was the standard at the time (and it had tight integration with GitHub pages) but it slowly became apparent that Jekyll wasn't really suitable. I felt like I was fighting against and "hacking" it to make it do what I want, it eventually got to the point where it felt like a fragile mish-mash of hacks I was afraid to touch.

So I made the decision to switch from Jekyll to something else, and what I chose was [GatsbyJS](https://www.gatsbyjs.org/).

## Why Gatsby?

I wanted to stick with a static site generator because I think it makes sense for a site which is updated only a couple of times a week.

Gatsby uses ReactJS and JavaScript which are technologies I'm interested in getting better at (unlike Ruby and liquid templating). Also, because there can sometimes be weeks or months between looking at the code it's important I can pick it up again quickly without having to re-learn stuff. I use React and JavaScript in my day job so I'm already familiar with those, whereas I never used Jekyll outside of the old site.

I'd also heard good things about Gatsby's build and clientside performance.

## So how did it go?

I get the feeling my site is quite unique amongst static sites. Typically people use static site generators for portfolio pages or blogs, not for huge media heavy web apps. So most of my issue with Gatsby came from the back that I have 35gb of content and thousands of files. So I ran into some issues.

One of the goals was to use less custom code so I have less to maintain. Previously I had a Node script I ran manually which iterated over my photos and generated copies in various sizes. Then it would index **all** of the content in one big JSON file which I parsed and used to display a gigs media on a gigs page.

Instead, Gatsby has plugins `gatsby-image` and `gatsby-transformer-sharp` which handle all of this for me. Additionally, `gatsby-source-filesystem` lets me query my filesystem as if its a database, meaning I don't need to generate a big index JSON.

This is all nice in theory but I kind of felt like nobody had really kicked the tires on it before. GatsbyJS definitely feels like a static site generator for developers, which is nice because I'm a developer so it feels like I'm working with it rather than against it.

### Kicking the tires 😩...

One of the first issues I had was an `EMFILE Too many open files` error. I created an issue in their GitHub repository and was advised to use the `graceful-fs` module. This fixed the issue mostly, although I had to run the build command a few times initially to get it to complete. From scratch it took around 10 minutes to build, which is definitely a long time. I expect most of this time is spent converting images. But luckily I only had to do that once.

My build time now that it's done most of the heavy lifing is around 280 seconds. Still not ideal, but when running in development it builds iteratively, so I can make changes without having to wait another 280 seconds.

In order to make Gatsby be what I wanted it to, I had to add a lot of custom fields in `gatsby-node.js`. For example in order to query all the media from a gig I had to add a field to all files for the Gig directory they were in. Luckily this wasn't too painful, I never felt like I was fighting against it.

When I went to deploy I decided to use `gatsby-plugin-s3` to deploy the whole thing to an S3 bucket, but that felt even less production ready. Apparently nobody had ever used it to deploy a big site, so all of my big 50mb MP3s caused it to exhaust all memory and crash. Also, the diffing mechanism which checked whether a file had changed didn't work for files over 5mb. I had to do a bit of work to make it work properly, but as a user of open source projects I definitely don't mind contributing to their development so it's okay.

### React makes development fun 🎉!! But how does it perform...

The most awesome thing to be honest has just been using ReactJS. Creating the new venues page for example would have required lots of custom code and thinking on the old site since I wasn't using any frameworks at all. With React it took me less than an hour.

The flipside of using a framework rather than my light vanilla JS is a larger JS bundle. Clientside performance is super important and I care heaps about it, but also if I'm sacrificing ease of development for clientside performance then that negatively impacts everyone because it'll be slower to add new features. So making things easier for me isn't purely selfish.

Clientside performance also didn't end up being degraded too much but it's definitely worse. All of my JS adds up to around 500kb minified, which is much larger than it was before, and switching between pages feels much slower. I still want to do more performance optimization though, I think I can make it roughly feel like it did before. Also Gatsby requires clients to download around 400kb of JSON files for some reason. But when it comes down to it I should really stop fretting about mere hundreds of kilobytes... It's a site about sharing media, it's going to be pretty heavy no matter what.

### Future 😎 sailors on an ocean of discovery ⛵⛵⛵

I had a lot of fun using newer technologies like CSS grid and saying 𝓪𝓾 𝓻𝓮𝓿𝓸𝓲𝓻 to supporting ancient browsers. Gone are the days of hefty CSS frameworks like Bootstrap, most of which you end up overriding to the point that you're basically just using the grid. Also gone are the days of JavaScript libraries like Masonry, smooth scrolling, etc. Browser APIs have it covered.

If you're using Internet Explorer 11 you'll be looking at a garbled mess and that's on you. As the owner of a device it's up to you to ensure it's using up to date software, if you don't know how to do that then you risk much more than websites looking broken or weird, you risk having your credit card details or your files stolen.

## ☀☀☀ Towards a brighter tomorrow ☀☀☀

Now that I've gotten this site upgrade out of the way I can explore other avenues.
