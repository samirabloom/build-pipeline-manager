(function () {
    'use strict';

    var app = angular.module('build_manager', ['ngRoute']);

    app.config(['$httpProvider', '$locationProvider', '$provide', '$routeProvider', function ($httpProvider, $locationProvider, $provide, $routeProvider) {
        // necessary in order to keep fullscreen while navigating
        $locationProvider.html5Mode(false);
        $routeProvider
            .when('/', { templateUrl: 'views/landing.html' })
            .when('/build/list', {templateUrl: 'views/build/listBuilds.html', controller: 'BuildListController'})
            .when('/build/create', {templateUrl: 'views/build/createBuild.html', controller: 'BuildCreateController'})
            .when('/build/edit/:buildId', {templateUrl: 'views/build/editBuild.html', controller: 'BuildEditController'})
            .when('/build/view/:buildId', { templateUrl: 'views/build/viewBuild.html', controller: 'BuildViewController' })
            .when('/pipeline/list', {templateUrl: 'views/pipeline/listPipelines.html', controller: 'PipelineListController'})
            .when('/pipeline/create', {templateUrl: 'views/pipeline/createPipeline.html', controller: 'PipelineCreateController'})
            .when('/pipeline/edit/:pipelineId', {templateUrl: 'views/pipeline/editPipeline.html', controller: 'PipelineEditController'})
            .when('/pipeline/view/:pipelineId', { templateUrl: 'views/pipeline/viewPipeline.html', controller: 'PipelineViewController' });

        $httpProvider.defaults.headers.common = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        $httpProvider.interceptors.push('httpInterceptor');

        $httpProvider.defaults.xsrfCookieName = 'GS-XSRF-TOKEN';
    }]);

    // factories
    app.factory('httpInterceptor', co.factories.HttpInterceptorFactory);
    app.factory('formValidationErrorHelper', co.factories.FormValidationErrorHelperFactory);

    // services
    app.factory('buildService', co.factories.BuildServiceFactory);
    app.factory('pipelineService', co.factories.PipelineServiceFactory);

    // controllers
    app.controller('BuildListController', co.controllers.BuildListController);
    app.controller('BuildCreateController', co.controllers.BuildCreateController);
    app.controller('BuildEditController', co.controllers.BuildEditController);
    app.controller('BuildViewController', co.controllers.BuildViewController);
    app.controller('PipelineListController', co.controllers.PipelineListController);
    app.controller('PipelineCreateController', co.controllers.PipelineCreateController);
    app.controller('PipelineEditController', co.controllers.PipelineEditController);
    app.controller('PipelineViewController', co.controllers.PipelineViewController);

    // directives
    app.directive('checkBoxGroup', co.directives.CheckBoxGroupDirectiveFactory);
    app.directive('formError', co.directives.FormErrorDirectiveFactory);

    app.run(['$http', '$rootScope', '$timeout', function ($http, $rootScope, $timeout) {

        if (!co.waitForRenderAndDoSomething) {
            co.waitForRenderAndDoSomething = function () {
                delete(co.pageLoaded);
                if ($http.pendingRequests.length > 0) {
                    //console.log('waiting for the digest loop...');
                    $timeout(co.waitForRenderAndDoSomething); // Wait for all templates to be loaded
                } else {
                    //the code which needs to run after dom rendering
                    //console.log('Digest loop finished...');
                    co.pageLoaded = true;
                }
            };
        }

        $timeout(co.waitForRenderAndDoSomething);

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $timeout(co.waitForRenderAndDoSomething); // Waits for first digest cycle
        });

    }]);
})();