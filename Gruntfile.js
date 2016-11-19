module.exports = function(grunt) {

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
            suffix: "(Medium)",
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
            suffix: "(Small)",
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
    }
  });

  grunt.loadNpmTasks('grunt-responsive-images');

  grunt.registerTask('default', ['responsive_images']);

};