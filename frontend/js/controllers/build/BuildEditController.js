(function (co)
{
    'use strict';
    
    function BuildEditController($scope, buildService, formValidationErrorHelper, $location, $routeParams)
    {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.buildService = buildService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this.buildId = $routeParams.buildId;

        this._initialize();
    }

    BuildEditController['$inject'] = ['$scope', 'buildService', 'formValidationErrorHelper', '$location', '$routeParams'];

    BuildEditController.prototype = {

        _update : function() {
            var self = this;
            
            this.services.buildService.update(this.$scope.build)
                .then(function(result){
                    self.$location.path('/build/list');
                })
                .catch(function(error){
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function ()
        {
            this.$scope.errors = {};

            this.$scope.build = {
                supportedCurrencies : []
            };

            this.$scope.update = this._update.bind(this);

            var self = this;
            
        }
        
        
    };

    co.controllers.BuildEditController = BuildEditController;

})(co);
