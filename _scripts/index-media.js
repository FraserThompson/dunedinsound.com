
const fs = require('fs'), 
glob = require('glob'),
YAML = require('yamljs');

glob('assets/**/**/*.{jpg,JPG,mp3}', {}, function(err, files){
    var existingYml = fs.readFileSync("_data/media.yml").toString();

    // this demarcates auto-generated values
    // from manually added values for things like
    // externally hosted images
    var a = existingYml.split("#!#!#!#!#");
    existingYml = a[0].trim();

    var data = { 'gigs': {}, 'artists': {}, 'audio': {} };
    files.forEach(function(file){
        var path_components = file.split('/')
        var gig = path_components[2];
        var band = path_components[3];

        // Gig images
        if (file.indexOf('cover') == -1 && file.indexOf("(Medium)") !== -1) {

        if (!(band in data['artists'])) {
            data['artists'][band] = {'small': [], 'medium': []};
        }

        if (!(gig in data['gigs'])) {
            data['gigs'][gig] = {};
        }

        if (!(band in data['gigs'][gig])) {
            data['gigs'][gig][band] = {};
        }

        data['artists'][band]['medium'].push(file);

        data['gigs'][gig][band]['images'] = data['gigs'][gig][band]['images'] || []
        data['gigs'][gig][band]['images'].push(file);
        data['gigs'][gig][band]['count'] = data['gigs'][gig][band]['count'] + 1 || 1;
        }

        // Artist images
        if (file.indexOf("(Small)") !== -1) {

        if (!(band in data['artists'])) {
            data['artists'][band] = {'small': [], 'medium': []};
        }

        data['artists'][band]['small'].push(file);
        }
    });

    var yamlString = YAML.stringify(data);
    var yamlHeading = "\n\n\n#!#!#!#!# Do not edit below this line.\n";
    yamlHeading += "# Generated automatically using `grunt imageinfo` on " + new Date() + "\n\n";
    
    fs.writeFileSync("_data/media.yml", existingYml + yamlHeading + yamlString);
    console.log('done');
});