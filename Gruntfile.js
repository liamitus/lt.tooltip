module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'pub/',
                    src: 'sass/*',
                    dest: 'pub/css',
                    flatten: true,
                    ext: '.css'
                }]     
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'pub/js/build.min.js': [
                        'pub/js/index.js',
                        'pub/js/services/*',
                        'pub/js/filters/*',
                        'pub/js/directives/*',
                        'pub/js/controllers/*'
                    ]
                }
            }
        },
        watch: {
            src: {
                files: [
                    'pub/js/*',
                    'pub/js/directives/*',
                    'pub/js/services/*',
                    'pub/js/filters/*',
                    'pub/js/controllers/*',
                    'pub/sass/*',
                    'pub/partials/*',
                    'pub/index.html'
                ],
                tasks: ['uglify', 'sass'],
                options: {
                    livereload: true 
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['uglify', 'sass']);
}
