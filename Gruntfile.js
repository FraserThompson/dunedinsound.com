var grunt = require('grunt')
  , fs = require('fs')
  , glob = require('glob')
  , YAML = require('yamljs');

module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('simple_copy', 'Copy files simply.', function() {
    var done = this.async();

    glob(grunt.config('simple_copy.src'), {}, function(err, matches) {
      if (err){
        grunt.log.write('Error! ' + err);
      } else {
        matches.forEach(function(file) {
          var fileName = file.split('/')[1];
          grunt.log.write('Copying: ' + file + ' to ' + grunt.config('simple_copy.dest'));
          fs.createReadStream(file).pipe(fs.createWriteStream(grunt.config('simple_copy.dest') + fileName));
        })
      }
      done();
    })

  });

  // Project configuration.
  grunt.initConfig({
    uncss: {
      dist: {
        options: {
          htmlroot: '_site',
          ignoreSheets : [/fonts.googleapis/, 'perfect-scrollbar.min.css', 'leaflet.css', 'main.css'],

        },
        files: {
          'assets/css/bootstrap_uncss.scss': ['_site/index.html', '_site/gigs/**/index.html', '_site/artists/**/index.html', '_site/venues/**/index.html', '_site/about/index.html']
        }
      }
    },
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
            width: 800
          },{
            name: "large",
            quality: 85,
            rename: false,
            width: 1600
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.JPG'],
          cwd: '_originals/img',
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
          cwd: '_originals/img',
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
            quality: 75,
            rename: false,
            width: 400
          }]
        },
        files: [{
          expand: true,
          src: ['**/band_cover.jpg'],
          cwd: '_originals/img',
          dest: 'assets/img'
        }]
      }
    },
    jekyll: {
      dist: {
        options: {
          config: '_config.yml',
          raw: "asset_url: ''\n" +
               "JEKYLL_ENV: 'production'\n"
        }
      }
    },
    exec: {
      s3_push: {
        command: 's3_website push',
        stdout: true,
        stderr: true
      },
      vagrant_up: {
        command: 'vagrant up --provider hyperv',
        stdout: true,
        stderr: true
      },
      vagrant_audio: {
        command: 'vagrant ssh -c /home/vagrant/sync/dunedinsound/convert.sh',
        stdout: true,
        stderr: true,
        options: {
          maxBuffer: 1024 * 1024 * 64
        }
      }
    },
    copy: {
      audio: {
        files: [
          {expand: true, cwd: '_originals/audio', src: ['**/*.{mp3,json}'], dest: 'assets/audio'},
        ]
      },
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

  grunt.registerTask('index-media', function(){
    var done = this.async();
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
        if (file.indexOf("(Medium)") !== -1) {

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
      done();
    });
  });

  grunt.registerTask('images', ['responsive_images', 'index-media']);
  grunt.registerTask('audio', ['exec:vagrant_up', 'exec:vagrant_audio', 'copy:audio']);
  grunt.registerTask('production-build', ['responsive_images', 'index-media', 'jekyll', 'sync']);
  grunt.registerTask('code-deploy', ['jekyll', 'exec:s3_push']);
  grunt.registerTask('deploy', ['exec:s3_push']);

};