module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

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
        }
    });

    grunt.loadTasks('build');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('lint', ['csslint', 'jshint']);

    // task to run all the tests, but without starting server.js
    grunt.registerTask('test:all', ['karma:chrome', 'protractor:acceptance']);

    // tasks to run on jenkins
    grunt.registerTask('jenkins', ['lint', 'karma:phantom']);

    // default
    //grunt.registerTask('default', ['lint', 'karma:chrome', 'start_node_and_run_tasks:run_tests']);
    grunt.registerTask('default', ['lint', 'karma:phantom']);
};
