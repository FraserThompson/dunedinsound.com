var grunt = require('grunt');

module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Project configuration.
  grunt.initConfig({
    uncss: {
      dist: {
        options: {
          htmlroot: '_site',
          ignore: [ '.open>.dropdown-menu', '.open>a'],
          ignoreSheets: [/fonts.googleapis/]
        },
        files: {
          '_sass/vendor/bootstrap.uncss.scss': ['_site/*.html', '_site/gigs/**/index.html', '_site/artists/**/index.html', '_site/venues/**/index.html', '_site/about/index.html', '_site/blog/**/index.html']
        }
      }
    },
    responsive_images: {
      images: {
        options: {
          engine: "gm",
          concurrency: "3",
          customIn: ['-interlace', 'line', '-sampling-factor', '4:2:0'],
          sizes: [{
            name: "medium",
            quality: 60,
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
          src: ['**/*.{JPG,jpg}'],
          cwd: '_originals/img',
          dest: 'assets/img'
        }]
      },
      gig_cover: {
        options: {
          engine: "gm",
          concurrency: "3",
          customIn: ['-interlace', 'line', '-sampling-factor', '4:2:0'],
          sizes: [{
            name: "medium",
            quality: 80,
            rename: false,
            width: 1024
          },
          {
            name: "small",
            suffix: " (Small)",
            quality: 60,
            rename: false,
            width: 600
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
          customIn: ['-interlace', 'line', '-sampling-factor', '4:2:0'],
          sizes: [{
            name: "small",
            suffix: " (Small)",
            quality: 60,
            rename: false,
            width: 600
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
      images: {
        command: 'node _scripts/images.js',
        stdout: true,
        stderr: true
      },
      s3_push: {
        command: 's3_website push',
        stdout: true,
        stderr: true
      },
      docker_audio: {
        command: 'docker-compose up --build',
        stdout: true,
        stderr: true,
        options: {
          maxBuffer: 1024 * 1024 * 64
        }
      },
      dev: {
        command: 'jekyll serve --limit 3',
        stdout: true,
        stderr: true
      },
      generate: {
        command: 'node _scripts/generate_gig.js',
        stdout: true,
        stdin: true,
        stderr: true
      },
      index_media: {
        command: 'node _scripts/index-media.js',
        stdout: true,
        stdin: true,
        stderr: true
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

  grunt.registerTask('images', ['exec:images', 'exec:index_media', 'sync']);
  grunt.registerTask('index_media', ['exec:index_media']);
  grunt.registerTask('audio', ['exec:docker_audio', 'copy:audio', 'sync']);
  grunt.registerTask('production-build', ['jekyll', 'sync']);
  grunt.registerTask('code-deploy', ['jekyll', 'exec:s3_push']);
  grunt.registerTask('build-deploy', ['jekyll', 'sync', 'exec:s3_push']);
  grunt.registerTask('deploy', ['exec:s3_push']);
  grunt.registerTask('dev', ['exec:dev']);
  grunt.registerTask('generate', ['exec:generate']);
};