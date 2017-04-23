#!/bin/bash
for file in /home/vagrant/sync/dunedinsound/_originals/audio/**/*.wav
do
    cd "$(dirname "$file")"
    # Seperate title from extension
    filename=$(basename "$file" .wav)
    # Split gig from band, ${components[1]} is band, ${components[0]} is gig 
    IFS='-'; components=($filename); unset IFS;
    # Trim silence from end
    sox "$file" "$filename"-silence.wav reverse silence 1 0.1 0.1% reverse
    # Convert to mp3
    lame -V2 --noreplaygain --tt "${components[1]}" --ta "${components[1]}" --tl "${components[0]}" --ty 2016 --tc dunedinsound.com "$filename"-silence.wav "$filename".mp3
    # Generate waveform
    RUBYOPT=-Ku json-waveform "$filename"-silence.wav > "$filename".mp3.json
done