/*
    Copies the audio from _originals into assets and _site
*/

const copy = require('copy');

let from_path = "**/*";
let to_path_assets = "../../assets/audio";
let to_path_sites = "../../_site/assets/audio";

console.log("Copying audio files _site and assets...");

copy(from_path, to_path_assets, { cwd: '_originals/audio' }, function(err, file) {
    if (err) console.err("Error copying file: " + err);
});

copy(from_path, to_path_sites, { cwd: '_originals/audio' }, function(err, file) {
    if (err) console.err("Error copying file: " + err);
});