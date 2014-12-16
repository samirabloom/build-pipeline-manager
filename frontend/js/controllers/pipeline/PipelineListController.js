(function (ns)
{
    'use strict';

    function PipelineListController($scope, pipelineService)
    {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.pipelineService = pipelineService;

        this._initialize();
    }

    PipelineListController['$inject'] = ['$scope', 'pipelineService'];

    PipelineListController.prototype = {
        
        _initialize: function ()
        {
            var self = this;
            
            this.services.pipelineService.loadAll()
                .then(
                    function (data) 
                    {
                        self.$scope.pipelinesList = data;
                    }
                );
        }
    };

    ns.controllers.PipelineListController = PipelineListController;

})(ns);
