// Karma configuration

module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'js/lib/angular/angular.js',
            'js/lib/angular/angular-route.js',

            'js/lib/angular/angular-mocks.js',
            'js/lib/tv4/tv4.js',

            'js/init.js',
            'js/config.js',
            { pattern: 'js/controllers/**/*.js' },
            { pattern: 'js/directives/**/*.js' },
            { pattern: 'js/factories/**/*.js' },
            { pattern: 'js/polyfills/**/*.js' },
            { pattern: 'js/services/**/*.js' },
            'js/angularConfig.js',

//            { pattern: 'json/**/*.json', included: false, served: true },

            { pattern: 'test/unit/**/*.js' }
        ],

        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-ng-scenario',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ],

        preprocessors: {
            'js/init.js': 'coverage',
            'js/controllers/**/*.js': 'coverage',
            'js/services/*.js': 'coverage',
            'js/factories/*.js': 'coverage',
            'js/directives/*.js': 'coverage'
        },

        // test results reporter to use
        // **/test_out/test-results.xml
        reporters: ['progress', 'junit', 'coverage'],

        junitReporter: {
            outputFile: 'test_out/test-results.xml',
            suite: 'e2e'
        },

        coverageReporter: {
            type: 'cobertura',
            dir: 'test_out/',
            file: 'coverage.xml'
        },

        loggers: [{type: 'console'}],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['ChromeWithJetBrainsExtension'],

        customLaunchers: {
            ChromeWithJetBrainsExtension: {
                base: 'Chrome',
                flags: ['--load-extension=browser_configuration/chrome/extensions/hmhgeddbohgjknpmjagkdomcpobmllji/2.0.7_0']
            }
        },

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        autoWatch: false,

        singleRun: false,

        // legal values 'OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'
        logLevel: 'WARN',

        hostname: 'localhost'
    });
};