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
        var artist = path_components[3];

        // initialize objects if they don't exist
        if (!(artist in data['artists'])) data['artists'][artist] = {'small': [], 'medium': []};
        if (!(gig in data['gigs'])) data['gigs'][gig] = {};
        if (!(artist in data['gigs'][gig])) data['gigs'][gig][artist] = {};

        // Gig images
        if (file.indexOf('cover') == -1 && file.indexOf("(Medium)") !== -1) {

            // add photo to list of artists photos
            data['artists'][artist]['medium'].push(file);

            // add photo to list of photos for the gig
            data['gigs'][gig][artist]['images'] = data['gigs'][gig][artist]['images'] || []
            data['gigs'][gig][artist]['images'].push(file);

            // update the count
            data['gigs'][gig][artist]['count'] = data['gigs'][gig][artist]['count'] + 1 || 1;

        // Thumbnails
        } else if (file.indexOf("(Tiny)") !== -1) {

            // Put album cover in gig array
            if (file.indexOf('cover') !== -1) {
                data['gigs'][gig]['thumbnails'] = data['gigs'][gig]['thumbnails'] || {}
                
                var image = fs.readFileSync(file);
                data['gigs'][gig]['thumbnails'][file] = new Buffer(image).toString('base64');

            // Put artist images in artist array
            } else {

                data['gigs'][gig][artist]['thumbnails'] = data['gigs'][gig][artist]['thumbnails'] || {}

                var image = fs.readFileSync(file);
                data['gigs'][gig][artist]['thumbnails'][file] = new Buffer(image).toString('base64');

            }

        // Artist images
        } else if (file.indexOf("(Small)") !== -1) {
            if (!(artist in data['artists'])) data['artists'][artist] = {'small': [], 'medium': []};
            data['artists'][artist]['small'].push(file);
        }
    });

    console.log("\t Writing YAML...")

    var yamlString = YAML.stringify(data);
    var yamlHeading = "\n\n\n#!#!#!#!# Do not edit below this line.\n";
    yamlHeading += "# Generated automatically using `grunt index_images` on " + new Date() + "\n\n";
    
    fs.writeFileSync("_data/media.yml", existingYml + yamlHeading + yamlString);
    console.log('\t Done');
});