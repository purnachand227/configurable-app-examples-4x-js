module.exports = function (grunt) {

  function loadPostCssPlugin(name) {
    var plugin;

    try {
      plugin = require(name);
      return plugin;
    }
    catch (error) {
      plugin = Function.prototype;  // no-op
      console.log(error.message + ' used by task postcss');
    }

    return plugin;
  }

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.initConfig({
    sass: {
      options: {
        outputStyle: "nested"
      },
      dist: {
        files: [{
          expand: true,
          src: ["**/*.scss", "!node_modules/**"],
          ext: ".css"
        }]
      }
    },
    postcss: {
      options: {
        processors: [
          loadPostCssPlugin('autoprefixer')(),
          loadPostCssPlugin('postcss-normalize-charset')()
        ]
      },
      dist: {
        src: ["**/*.css", "!node_modules/**"]
      }
    },
    watch: {
      styles: {
        files: ['**/*.scss'],
        tasks: ['styles']
      }
    },
    tslint: {
      options: {
        configuration: 'tslint.json',
        fix: false
      },
      files: {
        src: ['application/**/*.ts']
      }
    }
  });

  grunt.registerTask('styles', 'compile & autoprefix CSS', ['sass', 'postcss']);
  grunt.registerTask("default", ["watch"]);
  grunt.registerTask('lint:ts', ['tslint']);
};
