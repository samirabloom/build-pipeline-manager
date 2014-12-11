exports.config = {
    allScriptsTimeout: 11000,

    specs: [        
        '**/*Spec.js'
    ],

    capabilities: {
        'browserName': 'chrome',
        'options': ["start-maximized"]
    },

    /*capabilities: {
        'browserName': 'phantomjs',
        'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs',        
        'platform': 'ANY',
        'phantomjs.cli.args':[
            '--debug=true', 
            '--logfile=logfile.log', 
            '--loglevel=DEBUG', 
            '--ignore-ssl-errors=true',
            '--web-security=false', 
            '--webdriver=http://localhost:8910',
            '--webdriver-selenium-grid-hub=http://localhost:4444',
            '--webdriver-logfile=webdriver.log', 
            '--webdriver-loglevel=DEBUG'
        ]
    },*/

    baseUrl: 'http://localhost:1234/',

    framework: 'jasmine',

    seleniumPort : 4444,
    seleniumServerJar: '../../node_modules/webdriver-manager/selenium/selenium-server-standalone-2.42.2.jar',

    chromeDriver: '../../node_modules/webdriver-manager/selenium/chromedriver',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    beforeLaunch: function() {
//        console.log('protractor', 'beforeLaunch');
    },

    onPrepare: function() {
//        console.log('protractor', 'onPrepare');
    },

    onComplete: function() {
//        console.log('protractor', 'onComplete');
    },

    onCleanUp: function(exitCode) {
//        console.log('protractor', 'onCleanUp');
    },

    afterLaunch: function() {
//        console.log('protractor', 'afterLaunch');
    }
};