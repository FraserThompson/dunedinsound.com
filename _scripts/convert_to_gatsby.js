/*
    Will be used to convert the existing structure to one which works with the new gatsby version.
*/


const fs = require('fs-extra'), 
glob = require('glob'),
path = require('path'),
YAML = require('yamljs');

function machine_name(string, space_character) {
    space_character = space_character || "_";
    return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}

function doGigs() {
    glob('_posts/*.markdown', {}, function(err, files){
        files.forEach(function(file){
            const loadedFile = fs.readFileSync(file);
            const frontmatter = loadedFile.toString().split("---");

            const parsed = YAML.parse(frontmatter[1]);
            parsed.venue = machine_name(parsed.venue, "_");

            delete parsed.better_placeholders
            delete parsed.parent
            delete parsed.categories

            const newMedia = []

            if (parsed.media) {
                for (artist in parsed.media) {
                    const machineArtist = machine_name(artist, "_");
                    const newObject = {name: machineArtist}

                    if (parsed.media[artist].vid) newObject['vid'] = parsed.media[artist].vid
                    
                    newMedia.push(newObject);
                }
            } else if (parsed.categories) {
                for (artist in parsed.categories) {
                    const newObject = {name: artist}
                    newMedia.push(newObject);
                }  
            }

            parsed.artists = newMedia;
            parsed.cover = "./cover.jpg";

            delete parsed.media;
            delete parsed.image;
        
            const newDir = "./_test_output/gigs/" +  parsed.title
            fs.mkdirSync(newDir);
            fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");
        });

    });
}

function doArtists() {
    glob('_pages/artists/*.md', {}, function(err, files){
        files.forEach(function(file){
            const loadedFile = fs.readFileSync(file);
            const frontmatter = loadedFile.toString().split("---");

            const parsed = YAML.parse(frontmatter[1]);
            const machineArtist = machine_name(parsed.title, "_");

            delete parsed.permalink;
            delete parsed.layout;
            delete parsed.parent;
        
            const newDir = "./_test_output/artists/" + machineArtist
            fs.mkdirSync(newDir);
            fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");
        });

    });
}

function doVenues() {
    glob('_pages/venues/*.md', {}, function(err, files){
        files.forEach(function(file){
            const loadedFile = fs.readFileSync(file);
            const frontmatter = loadedFile.toString().split("---");

            const parsed = YAML.parse(frontmatter[1]);
            const machineArtist = machine_name(parsed.title, "_");

            delete parsed.permalink;
            delete parsed.layout;
            delete parsed.parent;
        
            const newDir = "./_test_output/venues/" + machineArtist
            fs.mkdirSync(newDir);
            fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");
        });

    });
}

function doAudio() {
    glob('assets/audio/**/*.{mp3,json}', {}, function(err, files) {
        files.forEach(function(file){
            const parsedPath = path.parse(file)
            const name = parsedPath.name.replace(".mp3", "")
            const gigName = name.split(" - ")[0]
            const artistName = name.split(" - ")[1]
            const artistMachineName = artistName ? machine_name(artistName) : "undefined"
            const newPath = "_test_output/" + gigName + "/" + artistMachineName
            fs.mkdirpSync(newPath)
            console.log(file);
            fs.copySync(file, newPath + "/" + parsedPath.base)
        });
    })
}

//doGigs();
//doArtists();
//doVenues();
//doAudio();