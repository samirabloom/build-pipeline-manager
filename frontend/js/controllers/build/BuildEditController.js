(function (ns) {
    'use strict';

    function BuildEditController($scope, $location, $routeParams, pipelineService, buildService, formValidationErrorHelper) {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;
        this.services.buildService = buildService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this.buildId = $routeParams.buildId;

        this._initialize();
    }

    BuildEditController['$inject'] = ['$scope', '$location', '$routeParams', 'pipelineService', 'buildService', 'formValidationErrorHelper'];

    BuildEditController.prototype = {

        _update: function () {
            var self = this;

            this.services.buildService.update(this.$scope.build)
                .then(function (result) {
                    self.$location.path('/build/list');
                })
                .catch(function (error) {
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function () {
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

            this.$scope.update = this._update.bind(this);

        }

    };

    ns.controllers.BuildEditController = BuildEditController;

})(ns);
