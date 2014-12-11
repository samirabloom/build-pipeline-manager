# install karma

npm install karma --save-dev
npm install karma-jasmine karma-chrome-launcher --save-dev
npm install -g karma-cli

# run directly

karma start my.conf.js --log-level debug --single-run

# run in build

karma: {
    e2e: {
        configFile: 'test/karma.conf.js',
        browsers: ['Chrome'],
        hostname: 'localhost',
        frameworks: ['ng-scenario'],
        files: [
            'e2e/angular-extensions.js',
            'e2e/test-utils.js',
            'e2e/*/*-scenarios.js'
        ],
        reporters: ['progress', 'junit'], // don't run coverage
        junitReporter: {
            outputFile: 'test_out/e2e/test-results.xml',
            suite: e2e
        }
    }
}


grunt.loadNpmTasks('grunt-karma');

# also see: 
# https://github.com/yearofmoo-articles/AngularJS-Testing-Article
# http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html#karma