/*
    GENERATE GIG.JS


    A NEW ERA IN PRODUCTIVITY

    LESS MIND NUMBING MONOTONY THE DAY AFTER A GIG

    HAIL OUR COMPUTER OVERLORDS


    Usage: node generate_gig.js [date] [gig title] [venue title] [artist1] [artist2] [artist3] ...
*/

var fs = require('fs');

/*
    Turns an artist name into a machine artist name using the method we've settled on.
    Params: String (artist name)
*/
function machine_name(string) {
    return string.replace(/[!,.']/g,'').replace(' ', '_').replace('$', 'z');
}

/*
    Creates the directories in the _originals folder for images and audio to go into.
    Params: Gig title, array of artists
*/
function create_file_skeleton(gig, artists) {
    var gigImagePath = './_originals/img/' + gig;
    var gigAudioPath = './_originals/audio/';

    if (!fs.existsSync(gigImagePath)) fs.mkdirSync(gigImagePath);

    artists.forEach (function (artist) {
        var artistImgPath = gigImagePath + "/" + machine_name(artist);
        var artistAudioPath = gigAudioPath + machine_name(artist); 

        if (!fs.existsSync(artistImgPath)) fs.mkdirSync(artistImgPath);

        if (!fs.existsSync(artistAudioPath)) fs.mkdirSync(artistAudioPath);

    });
}

/*
    Creates a template YAML file populated with all the artists and venue.
    Params: Date, Gig title, venue name, array of artists.
*/
function create_yaml(date, gig, venue, artists) {
    var date = date + " 08:30:00 Z";

    var template = `---
title: "${gig}"
date: ${date}
categories:
    ${artists.map((artist, i) => `
        - ${machine_name(artist)}
    `.trim()).join('\n\t')}
parent: Gigs
venue: ${venue}
media:
    ${artists.map((artist, i) => `
        ${artist}:
            mp3:
                -   title: Full Set
            vid:
                -   link: 
    `.trim()).join('\n\t')}
---
`

    var filename = date.split(" ")[0] + "-" + gig.replace(' ', '-') + ".markdown";

    fs.writeFile("./_posts/" + filename, template, function(err) {
        if(err) return console.log(err);
    
        console.log("Created directory structure and YAML for " + gig + " at " + venue);
    }); 
}

// calls the functions with command line params
create_file_skeleton(process.argv[3], process.argv.slice(5));
create_yaml(process.argv[2], process.argv[3], process.argv[4], process.argv.slice(5));