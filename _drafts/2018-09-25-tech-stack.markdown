---
title: "Tech stack rundown"
date: 2018-09-01 09:00:00 +12
tags:
    - tech
    - article
image: /assets/img/blog/2018-09-01-lee-nicolson-lightning-wave-pedals/cover.jpg
author: Fraser Thompson
filename: 2018-09-01-lee-nicholson-lightning-wave-pedals.markdown
background_position: center
background_size: cover
description: blah blah blah
---

I thought it might be a good time to write a little rundown of the tech that makes dunedinsound.com tick. I've tried to make it understandable for anyone as well as offering enough detail to satisfy people who are into this kind of thing.

**Initial Design**

When I first started, my goal was to make a simple directory of local gigs and artists. I had this idea that a document recording a certain event becomes more valuable over time, so I intended this directory to exist for many years, decades even.

So when considering the tech to run it on these were my requirements:

1. It must be cheap to host so I can keep it up for ages without running out of money
2. It must be easy and not painful to use
3. It must be fast (this is more to do with my personal hatred of slow, badly optimized websites)

Typically for this sort of content platform you'd settle on a CMS such as Wordpress, but to me this made no sense. Wordpress and other CMS's require a server to be running code which generates a page every time someone visits. This server would cost money to run and would require ongoing maintenance to ensure it's secure. For a website which only changes once a week this seemed unnecessary.

Instead I opted to make a static site. Static sites don't require any dynamic processing, so they're cheaper to host, faster for the user, and require less maintenance over time. To provide some of the layout and content management functionality of a CMS I chose to use a tool called a static site generator, which basically just takes in the content you want on your site and spits out HTML files. The one I chose was Jekyll because it integrated nicely with free GitHub Pages hosting and seemed to be the most popular at the time.

The flipside to making a static site is having to wrangle Jekyll into something which suits my requirements. Also where a CMS like Wordpress would offer a nice interface anyone could use, Jekyll is not really user friendly at all. But that's okay because it's just me who needs to know how to use it (for now).

When I put my first gigs up, the site was basically a text only list of artist and gigs. My next iteration was making it pretty, adding the big image focused "home" page and tile layouts.

And since then the basic design has solidified and it's just been progressive enhancements and new features. 

**Frontend**

I use a handful of third party libraries for simple stuff like lazy loading images and search filtering, but I chose not to use any sort of larger framework. Why? Because for a project I'm not working on fulltime its important that the time spent being confused after returning to the codebase is as small as possible, and with big complicated frameworks I always find I have to refamiliarise myself each time I look at it, more than I do with my own code.

Most of my JavaScript is written for the player on the gig page. I basically made ES6 "Objects" to represent user interface elements which contain their behavior and state. That's the idea anyway.

The CSS started as Bootstrap but at this point there's very little Bootstrap left in it, so I've used UnCSS to strip out all of Bootstrap's unused CSS. If I were to refactor I would probably just use a simple grid instead of a CSS framework.

The result of all this is very tiny assets. My CSS file is 19kb gzipped and my main JS bundle is 49kb, with a separate bundle for the gig page which is 18kb. This is pretty insane to be honest, but I kind of wonder how much it matters given that there will still be multiple megabytes worth of images to download. Still though, it's cool.

**Process (ensuring I don't lose my sanity)**

However there's a lot more to dunedinsound.com than just what you see. After every gig I have to:

1. Sort tens of gigabytes of 4k video and photos from my camera(s), and audio from my portable audio recorder
2. Process RAW photos, resize them and index them
3. Sync the audio with the video manually
4. Render out videos and put them on YouTube
5. Process and render out full set audio files for each artist and generate waveform data for the player
6. Add the gig and artist metadata to markdown files for Jekyll to consume and turn into a webpage
7. Upload it all to the internet

I also try to do this the day after a gig because otherwise it would weigh on me until it's done.

Obviously it's quite a lot to do, so over the years I've developed automated ways to remove most of the menial labour and make this process as painless as possible. 
 
- I've got a batch script which creates the initial Markdown file for a gig and fills it with metadata. This also makes the directory structure for the artist images and audio files, and artist pages if I haven't got one yet
- I've got an node script which take my processed JPGs and resize them into Large, Medium, and Tiny (which are used for the lazy-loading blur-in effect)
- I've got a node script and a Docker container which takes my audio files, tags them, converts them to MP3 if necessary, and generates a waveform

Previously I spent a lot of time writing all the markdown files and making directory structures manually, so it's nice to automate things. I still spend significant amounts of time doing human tasks like editing photos, videos, and mastering audio. Syncing audio and video is always time consuming and would be easier if I had an audio recorder + camera which supported timecodes.

After checking it all looks okay I can deploy the generated site and media to my S3 bucket in AWS.

**What's next**

I kind of want to move away from Jekyll.

Because of the iterative way I grew this, I made a bunch of bad decisions in the past which have led to a lot of technical debt. Jekyll is fairly inflexible, and I constantly feel like I'm fighting it to make it do what I want.

I have my eye on GatsbyJS, which is another static site generator. It uses JavaScript and React, which are technologies I'm interested in getting better at, as opposed to Ruby which Jekyll uses.