/*
    Indexes all of the media and spits out a YML for Jekyll to use
*/

const fs = require('fs'), 
glob = require('glob'),
YAML = require('yamljs');

console.log("INDEXING MEDIA...")

glob('assets/**/**/*.{jpg,JPG}', {}, function(err, files){
    var existingYml = fs.readFileSync("_data/media.yml").toString();

    // this demarcates auto-generated values
    // from manually added values for things like
    // externally hosted images
    var a = existingYml.split("#!#!#!#!#");
    existingYml = a[0].trim();

    var data = { 'gigs': {}, 'artists': {}, 'audio': {} };

    console.log("\t Iterating files and generating index...")

    files.forEach(function(file){
        var path_components = file.split('/')
        var gig = path_components[2];
        var band = path_components[3];

        // Gig images
        if (file.indexOf('cover') == -1 && file.indexOf("(Medium)") !== -1) {

            // initialize objects if they don't exist
            if (!(band in data['artists'])) data['artists'][band] = {'small': [], 'medium': []};
            if (!(gig in data['gigs'])) data['gigs'][gig] = {};
            if (!(band in data['gigs'][gig])) data['gigs'][gig][band] = {};

            // add photo to list of artists photos
            data['artists'][band]['medium'].push(file);

            // add photo to list of photos for the gig
            data['gigs'][gig][band]['images'] = data['gigs'][gig][band]['images'] || []
            data['gigs'][gig][band]['images'].push(file);

            // update the count
            data['gigs'][gig][band]['count'] = data['gigs'][gig][band]['count'] + 1 || 1;

        }

        // Artist images
        if (file.indexOf("(Small)") !== -1) {
            if (!(band in data['artists'])) data['artists'][band] = {'small': [], 'medium': []};
            data['artists'][band]['small'].push(file);
        }
    });

    console.log("\t Writing YAML...")

    var yamlString = YAML.stringify(data);
    var yamlHeading = "\n\n\n#!#!#!#!# Do not edit below this line.\n";
    yamlHeading += "# Generated automatically using `grunt index_images` on " + new Date() + "\n\n";
    
    fs.writeFileSync("_data/media.yml", existingYml + yamlHeading + yamlString);
    console.log('\t Done');
});