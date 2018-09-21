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

I thought it might be a good time to write a little rundown of the tech that makes dunedinsound.com tick. I've tried to make it understandable for anyone, but even if it's not hopefully it's at least interesting.

**Beginnings**

When I first started, my goal was to make a simple directory of local gigs and artists. I had this idea that a document recording a certain event becomes more valuable over time, so I intended this directory to exist for many years, decades even.

So when considering the tech to run it on these were my requirements:

1. It must be cheap to host so I can keep it up for ages without running out of money
2. It must be fast (this is more to do with my personal hatred of slow, badly optimized websites)

Typically for this sort of content platform you'd settle on a CMS such as Wordpress, but to me this made no sense. Wordpress and other CMS's require a server to be running code which generates a page every time someone visits. This server would cost money to run and would require ongoing maintenance to ensure it's secure. For a website which only changes once a week this seemed unnecessary.

Instead I opted to make a static site. Static sites don't require any dynamic processing, so they're cheaper to host, faster for the user, and require less maintenance over time. To provide some of the layout and content management functionality of a CMS I chose to use a tool called a static site generator, which basically just takes in your content and spits out static HTML files. The one I chose was Jekyll because it integrated nicely with free GitHub Pages hosting and seemed to be the most popular at the time.

The flipside to making a static site is I've had to write a lot of my own custom code to wrangle Jekyll into something which suits my requirements. Also where a CMS like Wordpress would offer a nice interface anyone could use, Jekyll is not really user friendly at all. But that's okay because it's just me who needs to know how to use it (for now).

When I put my first gigs up the site looked like this:


My next design iteration was this:


And since then the basic design has solidified and it's just been progressive enhancements and new features. 

**Process**

However there's a lot more to dunedinsound.com than just what you see. After every gig I have to:

1. Sort tens of gigabytes of 4k video, photos from my camera(s) and audio from my portable audio recorder into buckets for each artist
2. Process RAW photos, resize them and index them
3. Sync the binaural audio with the video manually
4. Render out videos and put them on YouTube
5. Process and render out full set audio files for each artist and generate waveform files for the frontend player
6. Add the gig and artist metadata to markdown files for Jekyll to consume
7. Upload it all to the internet

I also try to do this the day after a gig because otherwise it would weigh on me until it's done.

Obviously it's quite a lot to do, so over the years I've developed ways to remove most of the menial labour and make this process as painless as possible. I've got a batch script which creates the initial Markdown file for a gig and fills it with metadata. This also makes the directory structure for the gig.

After rendering out the RAW images I sort these into the directory structure and run some simple Node scripts which resize them all into Large, Medium, and Tiny (which are used for the lazy-loading blur-in effect). This also indexes the images into a big YAML file which my layouts use to show all the images in a gallery.

Once I've mastered the audio I follow a similar process of sorting them into the directory structure and running a Node script which spins up a Docker container which converts them to the right format and spits out a JSON waveform for my frontend player.

Then after checking it all looks okay I can deploy it to S3. Currently this takes way too long so I'm looking to improve it.

Previously I spent a lot of time writing all the markdown files and making directory structures manually, so it's nice ot automate things. I still spend most of the time editing the video and there's not much I can do about this. Syncing audio and video is always time consuming and would be easier if I had an audio recorder + camera which supported timecodes.

**Frontend**

I use a lot of third party libraries for simple stuff like lazy loading images and search filtering, but I chose not to use any sort of framework. For a project I'm not working on fulltime its important that the time spent being confused after returning to the codebase after a long time away is as small as possible, and with big complicated frameworks I always find I have to refamiliarize myself each time I look at it.

Most of the custom JavaScript is written for the player on the gig page, and as of early this year it's all in nice ES6 modules.

**What's next**

I kind of want to move away from Jekyll, for a number of reasons.
