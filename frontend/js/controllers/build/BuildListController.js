(function (co)
{
    'use strict';

    /**
     * Handles functionality to list the accoutn systems
     *
     * @param $scope
     * @constructor
     */
    function BuildListController($scope, buildService)
    {
        this.$scope = $scope;
        this.services = {} || this.services;
        this.services.buildService = buildService;

        this._initialize();
    }

    BuildListController['$inject'] = ['$scope', 'buildService'];

    BuildListController.prototype = {
        
        _initialize: function ()
        {
            var self = this;
            
            this.services.buildService.loadAll()
                .then(
                    function (data) 
                    {
                        self.$scope.buildsList = data.builds;
                    }
                );
        }
    };

    co.controllers.BuildListController = BuildListController;

})(co);
