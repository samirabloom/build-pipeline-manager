(function (co)
{
    'use strict';
    
    function BuildViewController($scope, buildService, $routeParams)
    {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.buildService = buildService;

        this.buildId = $routeParams.buildId;

        this._initialize();
    }

    BuildViewController['$inject'] = ['$scope', 'buildService', '$routeParams'];

    BuildViewController.prototype = {

        _initialize: function ()
        {
            this.$scope.errors = {};

            this.$scope.build = {};

            var self = this;

            this.services.buildService.load(this.buildId)
                .then(
                    function(data) 
                    {
                        self.$scope.build = data;
                    }
                );

        }

    };

    co.controllers.BuildViewController = BuildViewController;

})(co);
