(function (co)
{
    'use strict';
    
    function PipelineEditController($scope, pipelineService, $routeParams, formValidationErrorHelper, $location)
    {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this.pipelineId = $routeParams.pipelineId;

        this._initialize();
    }

    PipelineEditController['$inject'] = ['$scope', 'pipelineService', '$routeParams', 'formValidationErrorHelper', '$location'];

    PipelineEditController.prototype = {

        _addStage: function () {
            if (this.$scope.pipeline.stages && this.$scope.pipeline.stages.push) {
                this.$scope.pipeline.stages.push({});
            }
        },

        _update : function() {
            var self = this;
            
            this.services.pipelineService.update(this.$scope.pipeline)
                .then(function(result){
                    self.$location.path('/pipeline/list');
                })
                .catch(function(error){
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function ()
        {
            this.$scope.errors = {};

            this.$scope.pipeline = {
                stages: []
            };

            var self = this;

            this.services.pipelineService.load(this.pipelineId)
                .then(
                function(data)
                {
                    self.$scope.pipeline = data;
                }
            );

            this.$scope.update = this._update.bind(this);
            this.$scope.addStage = this._addStage.bind(this);
        }
        
    };

    co.controllers.PipelineEditController = PipelineEditController;

})(co);
