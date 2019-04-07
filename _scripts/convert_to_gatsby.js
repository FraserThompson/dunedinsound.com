/*
    Will be used to convert the existing structure to one which works with the new gatsby version.
*/


const fs = require('fs-extra'),
  glob = require('glob'),
  path = require('path'),
  YAML = require('yamljs');

function machine_name(string, space_character) {
  space_character = space_character || "_";
  return string.toLowerCase().replace(/[!,.']/g, '').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}

function doGigs() {
  glob('_posts/*.markdown', {}, (err, files) => {
    files.slice(-15).forEach(file => {
      const parsedPath = path.parse(file)
      const newDir = "./_test_output/gigs/" + parsedPath.name.replace(".markdown", "")

      if (fs.existsSync(newDir)) return

      fs.mkdirSync(newDir);

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
          const newObject = { name: artist }

          if (parsed.media[artist].vid) newObject['vid'] = parsed.media[artist].vid
          if (parsed.media[artist].mp3) {
            const mp3Name = parsed.title + " - " + artist + ".mp3"
            fs.copySync('./assets/audio/' + machine_name(artist) + "/" + mp3Name, newDir + "/" + machine_name(artist) + "/" + mp3Name)
            fs.copySync('./assets/audio/' + machine_name(artist) + "/" + mp3Name + ".json", newDir + "/" + machine_name(artist) + "/" + mp3Name + ".json")
          }

          newMedia.push(newObject);
        }
      } else if (parsed.categories) {
        for (artist in parsed.categories) {
          const newObject = { name: artist }
          newMedia.push(newObject);
        }
      }

      parsed.artists = newMedia;
      parsed.cover = "./cover.jpg";

      delete parsed.media;
      delete parsed.image;

      fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");

      // copy images
      fs.copySync('./assets/img/' + parsed.title, newDir, { filter: (src, dest) => !(src.includes("(Medium)") || src.includes("(Small") || src.includes("(Tiny")) })
      fs.copySync('./assets/img/' + parsed.title, newDir, { filter: (src, dest) => !(src.includes("(Medium)") || src.includes("(Small") || src.includes("(Tiny")) })

    });

  });
}

function doArtists() {
  glob('_pages/artists/*.md', {}, (err, files) => {
    files.forEach(file => {
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
  glob('_pages/venues/*.md', {}, (err, files) => {
    files.forEach(file => {
      const loadedFile = fs.readFileSync(file);
      const frontmatter = loadedFile.toString().split("---");

      const parsed = YAML.parse(frontmatter[1]);
      const machine_title = machine_name(parsed.title, "_");

      delete parsed.permalink;
      delete parsed.layout;
      delete parsed.parent;

      parsed.cover = "./cover.jpg";

      const newDir = "./_test_output/venues/" + machine_title
      fs.mkdirSync(newDir);
      fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(parsed, 2) + "---\n");

      // copy images
      const imageDir = './assets/img/Venues/' + machine_title
      fs.existsSync(imageDir) && fs.copySync(imageDir, newDir, { filter: (src, dest) => !(src.includes("(Medium)") || src.includes("(Tiny")) })
    });

  });
}

function doBlogs() {
  glob('_blog_posts/*.markdown', {}, (err, files) => {
    files.forEach(file => {
      const parsedPath = path.parse(file)
      const filename = parsedPath.name.replace(".markdown", "")
      const newDir = "./_test_output/blog/" + filename

      if (fs.existsSync(newDir)) return

      fs.mkdirSync(newDir);

      const loadedFile = fs.readFileSync(file);
      const split = loadedFile.toString().split("---");
      const content = split[2].replace("<!-- more -->", "");

      const frontmatter = YAML.parse(split[1]);
      delete frontmatter.filename;

      if (frontmatter.image) {
        delete frontmatter.image;
        frontmatter.cover = "./cover.jpg"
      }

      fs.writeFileSync(newDir + "/index.md", "---\n" + YAML.stringify(frontmatter, 2) + "---\n" + content);

      // copy images
      const imageDir = './assets/img/blog/' + filename
      fs.existsSync(imageDir) && fs.copySync(imageDir, newDir, { filter: (src, dest) => !(src.includes("(Medium)") || src.includes("(Small") || src.includes("(Tiny")) })

    });
  });
}

//doGigs();
//doArtists();
doVenues();
//doBlogs();