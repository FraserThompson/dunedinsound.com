# Dunedinsound.com

This is a jekyll site I made to present photos, audio, and video I've taken at local gigs. I've written documentation in case I forget how it works.

### Getting it going

It uses Jekyll for static site generation and node for various scripts so it requires some Ruby dependencies and some Node dependencies.

```
gem install
npm install
```

### Developing

```npm run serve``` will build the site to _site without images/audio and watch it locally.

```npm run dev``` will do the same but enable incremental build, live reload, and limit it to one post for faster development.

### Deploying

There are multiple deploy commands depending on the type of deploy.

```npm run deploy``` pushes it to S3.

```npm run code-deploy``` builds the site with Jekyll and then pushes it to S3. This is for when only code has changed.

```npm run gig-deploy``` builds the site with Jekyll, syncs assets from /assets/audio and /assets/img into the _site folder and then pushes it to S3. This is for when assets have changed too.

### Post object reference

* aspectratio: Defines the aspectratio of the images. Can be `threebytwo`, defaults to `threebyfour`.
* photo_credit: Credits someone for taking all the photos (optional)
* audio: If this is false it indicates that no audio was recored at the gig (default true)

### Processing Assets

To start you should run `npm run new` to generate the directory structure for a gig in the _originals folder.

#### Images
Images from a gig go in _originals/img/[gig name] and then in subdirectories for each artist. There needs to be a gig cover named cover.jpg in the gig directory and artist covers named band_cover.jpg in each artist directory.

Then run `npm run images` to process images. This resizes them and indexes them into a JSON file so the generator knows what's up, then copies them into the `_site` directory.

#### Audio

Audio goes in _originals/audio and then subdirectories for each artist. They need to be WAV files or MP3 files which are named like this: Gig Name - Band Name.wav.

Then run `npm run audio` to process the audio. This will generate waveforms and copy it to the appropriate folder then sync to the `_site` directory.

Once pushed the contents of the _original folder can be deleted.

#### More explanation

Because Jekyll serve gets really slow when copying multiple gigabytes of assets when building/serving I've had to roll my own solution.

The `/assets/img` and `/assets/audio` directories are excluded from Jekyll. Instead I have a grunt task which generates a YAML file containing all the image paths. This is then imported and can be accessed under `site.data.images` within Jekyll. This way I can easily add images without having to manually enter each filename, but I don't have to include the images as part of Jekyll or mess around with slow for loops to find them.

For deployment, the large assets are synced manually from `/assets/img` and `/assets/audio` to `_site`.

Previously I was letting Jekyll take care of the assets and iterating `site.static_files` in a for loop to find the images the page needed (eg. for each image in static files display the ones where the post title is in the path). This wasn't great because it meant my build times were like 30 seconds. With this new solution I can just run `npm run images` whenever images change and my layouts will access the object they need in YAML structure instead of having to iterate over the complete set multiple times.

TODO: Make this more efficient (it's getting a bit cumbersome as time goes on)

#### What's the Dockerfile for?

It's a container which is used to process audio assets and generate waveforms.

### NPM tasks

* deploy: Runs s3_website push to push the current `_site` directory to S3.
* code-deploy: Builds jekyll then deploys, no asset stuff
* gig-deploy: Builds jekyll, does asset stuff, then deploys
* production-build: Resizes images, syncs assets, builds with jekyll but doesn't deploy to S3
* images: Resizes images and generates the media info for them
* audio: Launches the vagrant VM, runs convert.sh to trim silence and export mp3's and waveforms, then copies the results into the assets folder.
* dev: Runs jekyll serve with the right params for intensive devving
* serve: Runs jekyll serve
* generate: Generates a gig skeleton in the `_originals` folder