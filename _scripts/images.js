const sharp = require("sharp"),
glob = require("glob"),
mkdirp = require("mkdirp"),
fs = require('fs'),
path = require('path');

const medium_width = 800
const medium_quality = 70
const medium_suffix = " (Medium)"

const large_width = 1800
const large_quality = 85
const large_suffix = ""

const tiny_width = 90
const tiny_quality = 20
const tiny_suffix = " (Tiny)"

glob("_originals/img/**/*.{JPG,jpg}", function (er, files) {

    files.forEach(function(file) {

        let output_path = 'assets/img/' + file.split("_originals/img/")[1].split(".")[0] // get output path without extension
        let output_dir = output_path.substring(0, output_path.lastIndexOf("/") + 1); // get dir to create
        mkdirp.sync(output_dir)

        let medium_output = output_path + medium_suffix + ".jpg";
        let large_output = output_path + large_suffix + ".jpg";
        let tiny_output = output_path + tiny_suffix + ".jpg";

        sharp(file)
            .resize(tiny_width)
            .jpeg({quality: tiny_quality})
            .toFile(tiny_output)

        sharp(file)
            .resize(medium_width)
            .jpeg({quality: medium_quality})
            .toFile(medium_output)

        sharp(file)
            .resize(large_width)
            .jpeg({quality: large_quality})
            .toFile(large_output)

    })
})
