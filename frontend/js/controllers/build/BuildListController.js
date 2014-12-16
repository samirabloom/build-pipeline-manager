(function (ns)
{
    'use strict';

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
                        self.$scope.buildsList = data;
                    }
                );
        }
    };

    ns.controllers.BuildListController = BuildListController;

})(ns);
