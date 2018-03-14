const sharp = require("sharp"),
glob = require("glob"),
mkdirp = require("mkdirp"),
fs = require('fs'),
path = require('path'),
copy = require('copy'),
commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'tiny', alias: 't', type: Boolean, defaultValue: true},
    { name: 'large', alias: 'l', type: Boolean, defaultValue: true},
    { name: 'medium', alias: 'm', type: Boolean, defaultValue: true}
]

const options = commandLineArgs(optionDefinitions)

const medium_width = 800
const medium_quality = 70
const medium_suffix = " (Medium)"

const large_width = 1800
const large_quality = 85
const large_suffix = ""

const tiny_width = 90
const tiny_quality = 20
const tiny_suffix = " (Tiny)"

console.log("PROCESSING IMAGES...")

glob("_originals/img/**/*.{JPG,jpg}", function (er, files) {

    console.log("\t Iterating files...")

    var gig_names = [];

    files.forEach(function(file) {

        let path_components = file.split("/");
        let gig_name = path_components[path_components.length - 3];
        gig_names.indexOf(gig_name) === -1 ? gig_names.push(gig_name) : null;

        let output_path = 'assets/img/' + file.split("_originals/img/")[1].split(".")[0] // get output path without extension
        let output_dir = output_path.substring(0, output_path.lastIndexOf("/") + 1); // get dir to create

        mkdirp.sync(output_dir)

        let medium_output = output_path + medium_suffix + ".jpg";
        let large_output = output_path + large_suffix + ".jpg";
        let tiny_output = output_path + tiny_suffix + ".jpg";

        if (options.tiny) {
            sharp(file)
                .resize(tiny_width)
                .jpeg({quality: tiny_quality})
                .toFile(tiny_output)
        }

        if (options.medium) {
            sharp(file)
                .resize(medium_width)
                .jpeg({quality: medium_quality})
                .toFile(medium_output)
        }

        if (options.large) {
            sharp(file)
                .resize(large_width)
                .jpeg({quality: large_quality})
                .toFile(large_output)
        }

    });

    console.log("\t Copying files to _site...")

    gig_names.forEach(function(gig_name) {

        let from_path = "assets/img/" + gig_name + "/**/*";
        let to_path = "_site/assets/img/" + gig_name;

        console.log("\t\t Copying from " + from_path + " to " + to_path);

        copy(from_path, to_path, function(err, file) {
            if (err) console.err("Error copying file: " + err);
            console.log("\t\t Done with " + gig_name)
        }.bind(this));

    });

});
