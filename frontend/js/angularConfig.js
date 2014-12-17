(function () {
    'use strict';

    var app = angular.module('build_manager', ['ngRoute']);

    app.config(['$httpProvider', '$locationProvider', '$provide', '$routeProvider', function ($httpProvider, $locationProvider, $provide, $routeProvider) {
        // necessary in order to keep fullscreen while navigating
        $locationProvider.html5Mode(false);
        $routeProvider
            .when('/build/list', {templateUrl: 'views/build/listBuilds.html', controller: 'BuildListController'})
            .when('/build/create', {templateUrl: 'views/build/createBuild.html', controller: 'BuildCreateController'})
            .when('/build/edit/:buildId', {templateUrl: 'views/build/editBuild.html', controller: 'BuildEditController'})
            .when('/build/view/:buildId', { templateUrl: 'views/build/viewBuild.html', controller: 'BuildViewController' })
            .when('/pipeline/list', {templateUrl: 'views/pipeline/listPipelines.html', controller: 'PipelineListController'})
            .when('/pipeline/create', {templateUrl: 'views/pipeline/createPipeline.html', controller: 'PipelineCreateController'})
            .when('/pipeline/edit/:pipelineId', {templateUrl: 'views/pipeline/editPipeline.html', controller: 'PipelineEditController'})
            .when('/pipeline/view/:pipelineId', { templateUrl: 'views/pipeline/viewPipeline.html', controller: 'PipelineViewController' })
            .otherwise({redirectTo: '/build/list'});

        $httpProvider.defaults.headers.common = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        $httpProvider.interceptors.push('httpInterceptor');

        $httpProvider.defaults.xsrfCookieName = 'GS-XSRF-TOKEN';
    }]);

    // factories
    app.factory('httpInterceptor', ns.factories.HttpInterceptorFactory);
    app.factory('formValidationErrorHelper', ns.factories.FormValidationErrorHelperFactory);

    // services
    app.factory('buildService', ns.factories.BuildServiceFactory);
    app.factory('pipelineService', ns.factories.PipelineServiceFactory);

    // controllers
    app.controller('MenuController', ns.controllers.MenuController);
    app.controller('BuildListController', ns.controllers.BuildListController);
    app.controller('BuildCreateController', ns.controllers.BuildCreateController);
    app.controller('BuildEditController', ns.controllers.BuildEditController);
    app.controller('BuildViewController', ns.controllers.BuildViewController);
    app.controller('PipelineListController', ns.controllers.PipelineListController);
    app.controller('PipelineCreateController', ns.controllers.PipelineCreateController);
    app.controller('PipelineEditController', ns.controllers.PipelineEditController);
    app.controller('PipelineViewController', ns.controllers.PipelineViewController);

    // directives
    app.directive('sortable', ns.directives.SortableDirectiveFactory);
    app.directive('formError', ns.directives.FormErrorDirectiveFactory);

    // filters
    app.filter('titleCase', ns.filters.TitleCaseFilterFactory);

    app.run(['$http', '$rootScope', '$timeout', function ($http, $rootScope, $timeout) {

        if (!ns.waitForRenderAndDoSomething) {
            ns.waitForRenderAndDoSomething = function () {
                delete(ns.pageLoaded);
                if ($http.pendingRequests.length > 0) {
                    //console.log('waiting for the digest loop...');
                    $timeout(ns.waitForRenderAndDoSomething); // Wait for all templates to be loaded
                } else {
                    //the code which needs to run after dom rendering
                    //console.log('Digest loop finished...');
                    ns.pageLoaded = true;
                }
            };
        }

        $timeout(ns.waitForRenderAndDoSomething);

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $timeout(ns.waitForRenderAndDoSomething); // Waits for first digest cycle
        });

    }]);
})();