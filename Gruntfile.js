/**
 * Created by Gavin on 14-03-11.
 */
module.exports = function (grunt) {
  'use strict';
  var sourceSrc = 'WebContent',
    targetSrc = 'dist';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      clean: [targetSrc]
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: sourceSrc + '/views',
            src: '**/*.html',
            dest: targetSrc + '/views'
          },
          {
            expand: true,
            cwd: sourceSrc ,
            src: '*.html',
            dest: targetSrc
          }
        ]
      }
    },
    cssmin: {
      minify: {
        options: {
          report: 'gzip'
        },
        files: [
          {
            expand: true,
            cwd: sourceSrc + '/css',
            src: '**/*.css',
            dest: targetSrc + '/css'
          }
        ]
      },
      combine: {
        files: [
          {'dist/css/phone.css': ['css/base.css', 'css/phone.css']},
          {'dist/css/tablet.css': ['css/base.css', 'css/tablet.css']}
        ]
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        },
        mangle: {
          except: ['require']
        },
        report: 'gzip'
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: sourceSrc + '/js',
            src: '**/*.js',
            dest: targetSrc + '/js'
          }
        ]
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: sourceSrc + '/images/',
            src: ['**/*.{png,jpg,gif}'],
            dest: targetSrc + '/images/'
          }
        ]
      }
    },
    jst: {
      build: {
        files: [
          {
            expand: true,
            cwd: sourceSrc + '/tpl',
            src: ['**/*.tpl'],
            dest: sourceSrc + '/tpl',
            ext: '.js'
          }
        ]
      },
      options: {
        amd: true,
        namespace: false,
        prettify: true
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  // 默认任务
  grunt.registerTask('build', ['clean', 'htmlmin', 'cssmin:minify', 'uglify', 'jst', 'imagemin']);
};