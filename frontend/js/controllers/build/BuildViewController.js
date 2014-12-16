(function (ns)
{
    'use strict';
    
    function BuildViewController($scope, $routeParams, pipelineService, buildService)
    {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;
        this.services.buildService = buildService;

        this.buildId = $routeParams.buildId;

        this._initialize();
    }

    BuildViewController['$inject'] = ['$scope', '$routeParams', 'pipelineService', 'buildService'];

    BuildViewController.prototype = {

        _initialize: function ()
        {
            this.$scope.errors = {};

            this.$scope.build = {};

            var self = this;

            this.services.pipelineService.loadAll()
                .then(function (data) {
                    self.$scope.pipelines = data;
                    self.services.buildService.load(self.buildId)
                        .then(function (data) {
                            self.$scope.build = data;
                        });
                });
        }

    };

    ns.controllers.BuildViewController = BuildViewController;

})(ns);
