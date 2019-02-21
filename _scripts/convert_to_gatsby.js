/*
    Will be used to convert the existing structure to one which works with the new gatsby version.
*/


const fs = require('fs'), 
glob = require('glob'),
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
            
            console.log(parsed);
        
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
        
            const newDir = "./_test_output/artists/" + machineArtist
            fs.mkdirSync(newDir);
            fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");
        });

    });
}

doGigs();