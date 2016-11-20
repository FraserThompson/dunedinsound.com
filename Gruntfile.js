var grunt = require('grunt')
  , fs = require('fs')
  , glob = require('glob')
  , YAML = require('yamljs');

module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sync');

  // Project configuration.
  grunt.initConfig({
    responsive_images: {
      images: {
        options: {
          engine: "gm",
          concurrency: "3",
          sizes: [{
            name: "medium",
            quality: 80,
            rename: false,
            suffix: " (Medium)",
            width: 1024
          },{
            name: "large",
            quality: 90,
            rename: false,
            width: 2048
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.JPG'],
          cwd: '_originals/',
          dest: 'assets/img'
        }]
      },
      gig_cover: {
        options: {
          engine: "gm",
          concurrency: "3",
          sizes: [{
            name: "medium",
            quality: 80,
            rename: false,
            width: 1024
          }]
        },
        files: [{
          expand: true,
          src: ['**/cover.jpg'],
          cwd: '_originals/',
          dest: 'assets/img'
        }]
      },
      band_covers: {
        options: {
          engine: "gm",
          concurrency: "3",
          sizes: [{
            name: "small",
            suffix: " (Small)",
            quality: 80,
            rename: false,
            width: 512
          }]
        },
        files: [{
          expand: true,
          src: ['**/band_cover.jpg'],
          cwd: '_originals/',
          dest: 'assets/img'
        }]
      }
    },
    jekyll: {
      dist: {
        options: {
          config: '_config.yml',
          raw: "asset_url: ''\n"
        }
      }
    },
    exec: {
      s3_push: {
        command: 's3_website push',
        stdout: true,
        stderr: true
      }
    },
    sync: {
      main: {
        files: [
          { src: ['assets/img/**'], dest: '_site' }, 
          { src: ['assets/audio/**'], dest: '_site'}
        ]
      }
    }
  });

  grunt.registerTask('imageinfo', function(){
    var done = this.async();
    glob('assets/img/**/*.{jpg,JPG}', {}, function(err, files){
      var existingYml = fs.readFileSync("_data/images.yml").toString();

      // this demarcates auto-generated values
      // from manually added values for things like
      // externally hosted images
      var a = existingYml.split("#!#!#!#!#");
      existingYml = a[0].trim();

      var data = { 'gigs': {}, 'artists': {} };
      files.forEach(function(file){
        var path_components = file.split('/')
        var gig = path_components[2];
        var band = path_components[3];

        // Gig images
        if (file.indexOf("(Medium)") !== -1) {

          if (!(gig in data['gigs'])) {
            data['gigs'][gig] = {};
          }

          if (!(band in data['gigs'][gig])) {
            data['gigs'][gig][band] = {};
          }

          data['gigs'][gig][band]['images'] = data['gigs'][gig][band]['images'] || []
          data['gigs'][gig][band]['images'].push(file);
          data['gigs'][gig][band]['count'] = data['gigs'][gig][band]['count'] + 1 || 1;
        }

        // Artist images
        if (file.indexOf("(Small)") !== -1) {

          if (!(band in data['artists'])) {
            data['artists'][band] = [];
          }

          data['artists'][band].push(file);
        }

      });

      var yamlString = YAML.stringify(data);
      var yamlHeading = "\n\n\n#!#!#!#!# Do not edit below this line.\n";
      yamlHeading += "# Generated automatically using `grunt imageinfo` on " + new Date() + "\n\n";
      
      fs.writeFileSync("_data/images.yml", existingYml + yamlHeading + yamlString);
      console.log('done');
      done();
    });
  });

  grunt.registerTask('images', ['responsive_images', 'imageinfo']);
  grunt.registerTask('production_build', ['responsive_images', 'imageinfo', 'jekyll', 'copy']);
  grunt.registerTask('deploy', ['responsive_images', 'imageinfo', 'jekyll', 'sync', 'exec']);

};