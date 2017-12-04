module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/bootstrap-datetime.min.js': ['src/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};
