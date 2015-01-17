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
                }]     
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'demo/js/build.min.js': [
                        'demo/js/index.js',
                        'demo/js/services/*',
                        'demo/js/filters/*',
                        'demo/js/directives/*',
                        'demo/js/controllers/*'
                    ]
                }
            }
        },
        watch: {
            src: {
                files: [
                    'demo/js/*',
                    'demo/js/directives/*',
                    'demo/js/services/*',
                    'demo/js/filters/*',
                    'demo/js/controllers/*',
                    'demo/sass/*',
                    'demo/partials/*',
                    'demo/index.html'
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
