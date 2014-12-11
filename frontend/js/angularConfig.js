(function () {
    'use strict';

    var app = angular.module('console', ['ngRoute']);

    app.config(['$httpProvider', '$locationProvider', '$provide', '$routeProvider', function ($httpProvider, $locationProvider, $provide, $routeProvider) {
        // necessary in order to keep fullscreen while navigating
        $locationProvider.html5Mode(false);
        $routeProvider.when(
            '/build/list',
            {
                templateUrl: 'views/build/listBuilds.html',
                controller: 'BuildListController'
            }
        ).when(
            '/build/create',
            {
                templateUrl: 'views/build/createBuild.html',
                controller: 'BuildCreateController'
            }
        ).when(
            '/build/edit/:buildId',
            {
                templateUrl: 'views/build/editBuild.html',
                controller: 'BuildEditController'
            }
        ).when(
            '/build/view/:buildId',
            {
                templateUrl: 'views/build/viewBuild.html',
                controller: 'BuildViewController'
            }
        ).when(
            '/',
            {
                templateUrl: 'views/landing.html'
            }
        );

        $httpProvider.defaults.headers.common = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        $httpProvider.interceptors.push('httpInterceptor');

        $httpProvider.defaults.xsrfCookieName = 'GS-XSRF-TOKEN';
    }]);

    //factories
    app.factory('httpInterceptor', co.factories.HttpInterceptorFactory);
    app.factory('formValidationErrorHelper', co.factories.FormValidationErrorHelperFactory);

    app.factory('buildService', co.factories.BuildServiceFactory);

    //controllers
    app.controller('SlotsGameConfigurationListController', co.controllers.SlotsGameConfigurationListController);
    app.controller('BuildListController', co.controllers.BuildListController);
    app.controller('BuildCreateController', co.controllers.BuildCreateController);
    app.controller('BuildEditController', co.controllers.BuildEditController);
    app.controller('BuildViewController', co.controllers.BuildViewController);

    //directives
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