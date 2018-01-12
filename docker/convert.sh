#!/bin/bash
shopt -s nullglob
ls /root/audio
for file in /root/audio/**/*.{wav,mp3}
do
    cd "$(dirname "$file")"
    extension="${file##*.}"

    # Seperate title from extension
    filename=$(basename "$file" .$extension)
    # Split gig from band, ${components[1]} is band, ${components[0]} is gig 
    IFS=' - '; components=($filename); unset IFS;

    echo "Working on $filename"

    if [ ${extension} == "wav" ]
    then
        # Trim silence from end
        echo "Trimming silence..."
        sox "$file" "$filename"-silence.wav reverse silence 1 0.1 0.1% reverse
        # Convert to mp3
        echo "Converting to mp3..."
        lame -V2 --noreplaygain --tt "${components[1]}" --ta "${components[1]}" --tl "${components[0]}" --ty 2016 --tc dunedinsound.com "$filename"-silence.wav "$filename".mp3
        # Generate waveform
        echo "Generating waveform..."
        RUBYOPT=-Ku json-waveform "$filename"-silence.wav > "$filename".mp3.json
    else
        # Convert to wav
        sox "$filename".mp3 temp.wav
        # Generate waveform
        echo "Generating waveform..."
        RUBYOPT=-Ku json-waveform temp.wav > "$filename".mp3.json
        # Remove wav file
        rm temp.wav
    fi
done