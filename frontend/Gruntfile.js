module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        clean:
        {
            test: ['test_out']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            user_defaults: [
                'Gruntfile.js',
                'test/**/*.js',
                'js/**/*.js',
                '!test/*.js',
                '!test/acceptance/protractor.conf.js',
                '!test/browser_configuration/**/*.js',
                '!test/lib/**/*.js',
                '!test/lib/**/*.js',
                '!js/lib/**/*.js',
                '!js/core/*.js',
                '!js/build/*.js'
            ]
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: ['css/main.css']
            }
        },
        karma: {
            options: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            },
            phantom: {
                browsers: ['PhantomJS']
            },
            chrome: {
                browsers: ['Chrome']
            },
            firefox: {
                browsers: ['Firefox']
            }
        },
        protractor: {
            options: {
                keepAlive: false,
                noColor: false
            },
            acceptance: {
                options: {
                    configFile: "test/acceptance/protractor.conf.js"
                }
            }
        },
        start_node_and_run_tasks: {
            run_tests: {
                options: {
                    tasks: ['protractor:acceptance']
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: [
                            'css/**',
                            'icon/**',
                            'js/**',
                            'views/**',
                            'index.html'
                        ],
                        dest: '../target/classes'
                    }
                ]
            }
        }
    });

    grunt.loadTasks('build');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('lint', ['csslint', 'jshint']);
    grunt.registerTask('test:all', ['karma:chrome', 'protractor:acceptance']);

    // default
    grunt.registerTask('default', ['clean', 'lint', 'karma:phantom', 'copy:dist']);
};
