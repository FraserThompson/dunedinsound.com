/*
    GENERATE GIG.JS


    A NEW ERA IN PRODUCTIVITY

    LESS MIND NUMBING MONOTONY THE DAY AFTER A GIG

    HAIL OUR COMPUTER OVERLORDS


    Usage: node generate_gig.js
*/

var fs = require('fs');
var rl = require("readline");

/*
    Turns an artist or gig name into a machine artist or gig name using the method we've settled on.
    Params: String (artist name), character to replace spaces with (defaults to _)
*/
function machine_name(string, space_character) {
    space_character = space_character || "_";
    return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}

function create_artist_page(artist) {

    var artistTemplate = `---
title: ${artist}
permalink: "/artists/${machine_name(artist)}/"
layout: band
parent: Artists
---
`
    fs.writeFileSync('./_pages/artists/' + machine_name(artist) + '.md', artistTemplate);
    console.log("Created artist page for " + artist);
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
        var artistPagePath = './_pages/artists/' + machine_name(artist) + '.md';

        if (!fs.existsSync(artistImgPath)) fs.mkdirSync(artistImgPath);

        if (!fs.existsSync(artistAudioPath)) fs.mkdirSync(artistAudioPath);

        if (!fs.existsSync(artistPagePath)) create_artist_page(artist);

    });
}

/*
    Creates a template YAML file populated with all the artists and venue.
    Params: Date, Gig title, venue name, array of artists
*/
function create_gig_yaml(date, gig, venue, artists) {
    var date = date + " 08:30:00 Z";

    var gigTemplate = `---
title: "${gig}"
date: ${date}
categories:
    ${artists.map((artist, i) => `
        - ${machine_name(artist)}
    `.trim()).join('\n    ')}
parent: Gigs
better_placeholders: true
venue: ${venue}
media:
    ${artists.map((artist, i) => `
        ${artist}:
            mp3:
                -   title: Full Set
            vid:
                -   link: 
    `.trim()).join('\n    ')}
---
`

    var filename = date.split(" ")[0] + "-" + machine_name(gig, '-') + ".markdown";

    fs.writeFileSync("./_posts/" + filename, gigTemplate);
    console.log("Created directory structure and YAML for " + gig + " at " + venue);
}

function main() {
    var d = new Date();
    var prompts = rl.createInterface(process.stdin, process.stdout);
    var default_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate() - 1);

    console.log("Hello Fraser! Let me help you with that.");
    console.log("------------- GIG METADATA -------------");

    prompts.question("Date (default: " + default_date + "):", function (date) {
        if (!date) date = default_date;
        
        prompts.question("Title: ", function (gig) {
            if (!gig) console.log("You didn't enter anything...");
            
            prompts.question("Venue: ", function (venue) {
                if (!venue) console.log("You didn't enter anything...");

                prompts.question("Artists (comma separated): ", function (artists) {
                    artists = artists.split(",");
                    create_file_skeleton(gig, artists);
                    create_gig_yaml(date, gig, venue, artists)
                    process.exit();
                });
            });
        });
    });
}

main();