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

### Processing Assets

#### Images
Images from a gig go in _originals/img/[gig name] and then in subdirectories for each artist. There needs to be a gig cover named cover.jpg in the gig directory and artist covers named band_cover.jpg in each artist directory.

Then run `grunt images` to process images.

#### Audio

Audio goes in _originals/audio and then subdirectories for each artist. They need to be WAV files which are named like this: Gig Name - Band Name.wav.

Then run `grunt audio` to process the audio.

Once pushed the contents of the _original folder can be deleted.

#### More explanation

Because Jekyll serve gets really slow when copying multiple gigabytes of assets when building/serving I've had to roll my own solution.

The /assets/img and /assets/audio directories are excluded from Jekyll. Instead I have a grunt task which generates a YAML file containing all the image paths. This is then imported and can be accessed under site.data.images within Jekyll. This way I can easily add images without having to manually enter each filename, but I don't have to include the images as part of Jekyll or mess around with slow for loops to find them.

For deployment, the large assets are synced manually from /assets/img and /assets/audio to _site. For development assets are loaded from the path specified by asset_url in _config.yml instead of being served locally. This means images won't be visible when devinng unless they've already been pushed to live, but I think that's okay.

Previously I was letting Jekyll take care of the assets and iterating site.static_files in a for loop to find the images the page needed (eg. for each image in static files display the ones where the post title is in the path). This wasn't great because it meant my build times were like 30 seconds. With this new solution I can just run grunt imageinfo whenever images change and my layouts will access the object they need in YAML structure instead of having to iterate over the complete set multiple times.

### Grunt tasks

* deploy: Runs s3_website push to push the current _site directory to S3.
* code-deploy: Builds jekyll then deploys, no asset stuff
* production-build: Resizes images, syncs assets, builds with jekyll but doesn't deploy to S3
* images: Resizes images and generates the media info for them
* audio: Launches the vagrant VM, runs convert.sh to trim silence and export mp3's and waveforms, then copies the results into the assets folder.

### Provisioning a VM which can generate waveforms

The included Vagrantfile uses Hyper-V so you'll have to be running Windows and have it enabled. You'll also need to make a public network interface in the Hyper-V config and choose to use it when Vagrant asks at `vagrant up`.

Gotcha: When it prompts you for SMB password/user don't type them for like 10 minutes or it'll give you some error about locks. Apparently it takes longer to get ready.

Then run these inside the VM:

```
sudo apt-get update
sudo apt-get install cifs-utils ruby-dev lame sox libsndfile1-dev
sudo gem install json-waveform -- --with-cflags=-Wno-error=format-security
sudo mount -t cifs -o username=Fraser,uid=$USER,gid=$USER //FRASER-FRASER/dev2 ~/sync
```