# Dunedinsound.com

This is a jekyll site I made to present photos, audio, and video I've taken at local gigs. I've written documentation in case I forget how it works.

### Getting it going

It uses Jekyll and Grunt, so requires some Ruby dependencies and some Node dependencies.

```
gem install
npm install
```

### Developing

```jekyll serve``` will build the site to _site without images/audio and watch it locally.

### Deploying

```grunt deploy``` minifies images in the _originals folder (if any), generates an image index to _data/images.yml, syncs assets from /assets/audio and /assets/img into the _site folder, and then pushes it to S3.

### Asset workflow

Because Jekyll serve gets really slow when copying multiple gigabytes of assets when building/serving I've had to roll my own solution.

The /assets/img and /assets/audio directories are excluded from Jekyll. Instead I have a grunt task which generates a YAML file containing all the image paths. This is then imported and can be accessed under site.data.images within Jekyll. This way I can easily add images without having to manually enter each filename, but I don't have to include the images as part of Jekyll or mess around with slow for loops to find them.

For deployment, the large assets are synced manually from /assets/img and /assets/audio to _site. For development assets are loaded from the path specified by asset_url in _config.yml instead of being served locally. This means images won't be visible when devinng unless they've already been pushed to live, but I think that's okay.

Previously I was letting Jekyll take care of the assets and iterating site.static_files in a for loop to find the images the page needed (eg. for each image in static files display the ones where the post title is in the path). This wasn't great because it meant my build times were like 30 seconds. With this new solution I can just run grunt imageinfo whenever images change and my layouts will access the object they need in YAML structure instead of having to iterate over the complete set multiple times.

### Deployment workflow

I'm using s3_website for deployment which makes things much easier. It can be deployed with ```s3_website push``` if there's an s3_website.yml which I haven't included in this repo.

I also have the responsive_images node module for minification of images. So if I put images in the _originals directory with the folder structure I want they will be compressed and sent to assets/img with some nice alternate file sizes.

### Grunt tasks

* deploy: Does a full deploy, resizes images, syncs new media, builds with jekyll
* code-deploy: Just builds jekyll then deploys, no asset stuff
* production-build: Resizes images, syncs assets, builds with jekyll but doesn't deploy to S3
* images: Resizes images and generates the media info for them
* audio: Launches the vagrant VM, runs convert.sh to trim silence and export mp3's and waveforms, then copies the results into the assets folder.