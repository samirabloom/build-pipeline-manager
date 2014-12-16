(function (ns) {
    'use strict';

    function BuildListController($scope, pipelineService, buildService) {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;
        this.services.buildService = buildService;

        this._initialize();
    }

    BuildListController['$inject'] = ['$scope', 'pipelineService', 'buildService'];

    BuildListController.prototype = {

        _filterByPipeline: function (value, index) {
            console.log(value);
        },

        _initialize: function () {
            var self = this;

            this.services.buildService.loadAll()
                .then(function (data) {
                    self.$scope.builds = data;
                });
            this.services.pipelineService.loadAll()
                .then(function (data) {
                    self.$scope.pipelines = data;
                });

            this.$scope.filterByPipeline = this._filterByPipeline.bind(this);
        }
    };

    ns.controllers.BuildListController = BuildListController;

})(ns);
