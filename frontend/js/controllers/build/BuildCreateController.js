(function (ns) {
    'use strict';

    function BuildCreateController($scope, $location, pipelineService, buildService, formValidationErrorHelper) {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.buildService = buildService;
        this.services.pipelineService = pipelineService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this._initialize();
    }

    BuildCreateController['$inject'] = ['$scope', '$location', 'pipelineService', 'buildService', 'formValidationErrorHelper'];

    BuildCreateController.prototype = {

        _create: function () {
            var self = this;

            this.services.buildService.save(this.$scope.build)
                .then(function (result) {
                    self.$location.path('/build/list');
                })
                .catch(function (error) {
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function () {
            this.$scope.build = {};

            this.$scope.errors = {};

            var self = this;

            this.services.pipelineService.loadAll()
                .then(function (data) {
                    self.$scope.pipelines = data;
                });

            this.$scope.create = this._create.bind(this);
        }

    };

    ns.controllers.BuildCreateController = BuildCreateController;

})(ns);
