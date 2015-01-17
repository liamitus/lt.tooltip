module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'demo/',
                    src: 'sass/*',
                    dest: 'demo/css',
                    flatten: true,
                    ext: '.css'
                }, {
                    'src/css/lt.tooltip.css' :'src/sass/lt.tooltip.scss'
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'demo/js/sampleapp.min.js': 'demo/js/sampleapp.js',
                    'src/lt.tooltip.min.js':'src/lt.tooltip.js'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: ['bower_components/**'], 
                    dest: 'src/',
                }, {
                    expand: true,
                    src: ['bower_components/**', 'src/lt.tooltip.js', 'src/css/lt.tooltip.css', 'src/css/lt.tooltip.css.map'], 
                    dest: 'demo/',
                }]
            }
        },
        watch: {
            src: {
                files: [
                    'demo/js/sampleapp.js',
                    'demo/index.html',
                    'demo/sass/**',
                    'src/lt.tooltip.js'
                ],
                tasks: ['copy:build', 'uglify', 'sass'],
                options: {
                    livereload: true 
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: 'demo/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify', 'sass', 'copy:build']);
    grunt.registerTask('spawn', ['connect', 'watch']);
}
