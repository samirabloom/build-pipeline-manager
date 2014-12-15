(function (co)
{
    'use strict';

    /**
     * Handles functionality to list the accoutn systems
     *
     * @param $scope
     * @constructor
     */
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

    co.controllers.PipelineListController = PipelineListController;

})(co);
