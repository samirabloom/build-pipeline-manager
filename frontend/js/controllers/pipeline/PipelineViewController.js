(function (ns)
{
    'use strict';
    
    function PipelineViewController($scope, pipelineService, $routeParams)
    {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;

        this.pipelineId = $routeParams.pipelineId;

        this._initialize();
    }

    PipelineViewController['$inject'] = ['$scope', 'pipelineService', '$routeParams'];

    PipelineViewController.prototype = {

        _initialize: function ()
        {
            this.$scope.errors = {};

            this.$scope.pipeline = {};

            var self = this;

            this.services.pipelineService.load(this.pipelineId)
                .then(
                    function(data) 
                    {
                        self.$scope.pipeline = data;
                    }
                );

        }

    };

    ns.controllers.PipelineViewController = PipelineViewController;

})(ns);
