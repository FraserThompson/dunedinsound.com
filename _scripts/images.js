const sharp = require("sharp")
const glob = require("glob")
const mkdirp = require("mkdirp")

const medium_width = 800
const medium_quality = 60
const medium_suffix = " (Medium)"

const large_width = 1800
const large_quality = 85
const large_suffix = ""

glob("_originals/img/**/*.{JPG,jpg}", function (er, files) {

    files.forEach(function(file) {

        let output_path = 'assets/img/' + file.split("_originals/img/")[1].split(".")[0]
        let output_dir = output_path.substring(0, output_path.lastIndexOf("/") + 1);

        mkdirp.sync(output_dir)

        sharp(file)
            .resize(medium_width)
            .jpeg({quality: medium_quality})
            .toFile(output_path + medium_suffix + ".jpg")

        sharp(file)
            .resize(large_width)
            .jpeg({quality: large_quality})
            .toFile(output_path + large_suffix + ".jpg")
    })

})
