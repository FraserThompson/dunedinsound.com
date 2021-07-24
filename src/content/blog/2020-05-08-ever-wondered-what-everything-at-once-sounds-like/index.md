---
title: 'Ever wanted to play your entire music library at once? Well now you can!'
date: 2020-05-08T07:00:00.000Z
tags:
  - Article
author: Fraser Thompson
background_position: center
background_size: contain
description: Recently, with no gigs to go to, I decided I wanted to hear what every gig recorded so far playing simultaneously would sound like. Read on if you're interested in doing something similar.
cover: ./cover.jpg
---

Recently, with no gigs to go to, I decided I wanted to hear what every gig recorded so far playing simultaneously would sound like. You can hear that for yourself [on Bandcamp](https://dunedinsound.bandcamp.com).

<center><iframe style="border: 0; width: 350px; height: 470px;" src="https://bandcamp.com/EmbeddedPlayer/album=1934608119/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="http://dunedinsound.bandcamp.com/album/now-thats-what-i-call-every-dunedinsound-recording-playing-at-the-same-time">NOW THATS WHAT I CALL EVERY DUNEDINSOUND RECORDING PLAYING AT THE SAME TIME by Dunedinsound</a></iframe></center>

If, for some reason, you're interested in doing something similar then read on.

### Importing hundreds of MP3 files into Audacity is painful

My first instinct was to use Audacity, but Audacity wants to generate a waveform and do some sort of conversion for each MP3 you import. This would have meant many hours spent importing the files. Also I found that even once the files are imported, Audacity would sometimes fail to export. I briefly tried Ableton Live too but it collapsed under the weight of 200 audio files.

### Friendship ended with GUI, commandline is my new best friend

There exists a [cross-platform commandline tool called SoX](http://sox.sourceforge.net/sox.html) which can manipulate audio in many different ways. I already use this to trim audio which goes up on the site. It turns out SoX can mix together multiple audio files with the `-m` commandline argument. But can it handle mixing hundreds of files? And how will I feed it those files?

### PowerShell to the rescue

I needed to get a list of each MP3 file, filtered by the year it was modified, and feed this as an argument to SoX. That was easy with the following PowerShell script:

```
$FindDate=Get-Date -Year 2015
$SourcePath="G:\dev\dunedinsound-gatsby\src\content\gigs\**\*.mp3"

$Files = Get-Childitem -Path $SourcePath -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime.Year -eq $FindDate.Year } | Resolve-Path -Relative | foreach-object { "$_" }

sox --norm -m $Files -e floating-point output.wav
```

PowerShell is a little weird for someone used to BASH and it feels almost satirically Windowsey but you get the hang of it pretty quick. To run this script, use notepad to make a file with the extension `.ps1` and then open it. Modify the `$SourcePath` variable to the location of the files you want to combine.

The `--norm` argument normalizes the files to similar volumes, and the `-e floating-point` indicates that I want a 32-bit floating point WAV output. I ran this script close to my files so the relative paths were as small as possible, because otherwise it gave some "arguments too long" error.

This would have worked, except that I at some point switched from 48khz to 44.41khz for my audio files, and SoX refused to combine audio files with different samplerates. So I had to do an additional step where I checked the samplerate of the file, and converted them to be the same. You probably won't need to do this, but here's what that script looks like:

```
$FindDate=Get-Date -Year 2015
$SourcePath="G:\dev\dunedinsound-gatsby\src\content\gigs\**\*.mp3"
$TempDirectory="E:\Scratch\"
$intendedSampleRate="48000"
$badSampleRate="44100"

$Files = Get-Childitem -Path $SourcePath -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime.Year -eq $FindDate.Year } | Resolve-Path -Relative | foreach-object {
    $sampleRate = sox --i -r "$_"
    if ($sampleRate -eq $badSampleRate) {
        $filename = Split-Path $_ -leaf
        if (!(Test-Path "$TempDirectory$filename.wav")) {
            sox "$_" "$TempDirectory$filename.wav" rate $intendedSampleRate
        }
        "$TempDirectory$filename.wav";
    } else {
        "$_";
    }
}

sox --norm -m $Files -e floating-point output.wav
```

(I also used a temporary directory on a different drive for my intermediate files coz my SSD was too small)

For each year of files it took roughly a few hours on a Ryzen 8 core. Most of that time was spent converting sample rates. The load seemed to be spread quite evenly across all cores, but none were fully utilized which meant I could continue to use my PC for other stuff.

Making the album art was a whole other challenge. If anyone's curious, the most least virusey software I found for stitching 5000 images into a mosiac was [AndreaMosiac](http://www.andreaplanet.com/andreamosaic/) which has a charmingly 90s website and GUI but worked well. I generated a gradient in GIMP as the source image for AndreaMosiac, then imported the resulting mosiac into GIMP and spherized it. The text was made in Paint 3D which comes with Windows 10 (lol), and reflections were added with the Lighting Effects filter and the collage layer set as an environment map in GIMP.

So there you go.
