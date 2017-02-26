#!/bin/bash
for file in /vagrant/_originals/audio/**/*.wav
do
    filename=$(basename "$file")
    IFS='.'; arrIN=($file); unset IFS;
    IFS='.'; fasdf=(${filename%.*}); unset IFS;
    IFS='-'; components=($fasdf); unset IFS; # ${components[1]} is band, ${components[0]} is gig 
    sox "$file" "${arrIN[0]}"-silence.wav reverse silence 1 0.1 0.1% reverse
    lame -V2 --noreplaygain --tt "${components[1]}" --ta "${components[1]}" --tl "${components[0]}" --ty 2016 --tc dunedinsound.com "${arrIN[0]}"-silence.wav "${arrIN[0]}".mp3
    RUBYOPT=-Ku json-waveform "${arrIN[0]}"-silence.wav > "${arrIN[0]}".mp3.json
done