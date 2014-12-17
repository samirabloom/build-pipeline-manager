(function (ns) {
    'use strict';

    function PipelineCreateController($scope, $location, pipelineService, formValidationErrorHelper) {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this._initialize();
    }

    PipelineCreateController['$inject'] = ['$scope', '$location', 'pipelineService', 'formValidationErrorHelper'];

    PipelineCreateController.prototype = {

        _addStage: function () {
            if (this.$scope.pipeline.stages && this.$scope.pipeline.stages.push) {
                this.$scope.pipeline.stages.push({});
            }
        },

        _create: function () {
            var self = this;

            this.services.pipelineService.save(this.$scope.pipeline)
                .then(function (result) {
                    self.$location.path('/pipeline/list');
                })
                .catch(function (error) {
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function () {
            this.$scope.pipeline = {
                stages: [{
                    name: ""
                }]
            };

            this.$scope.errors = {};

            this.$scope.create = this._create.bind(this);
            this.$scope.addStage = this._addStage.bind(this);
        }

    };

    ns.controllers.PipelineCreateController = PipelineCreateController;

})(ns);
