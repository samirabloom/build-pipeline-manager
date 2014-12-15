(function (co)
{
    'use strict';
    
    function BuildCreateController($scope, buildService, formValidationErrorHelper, $location)
    {
        this.$scope = $scope;
        this.$location = $location;
        this.services = {} || this.services;
        this.services.buildService = buildService;
        this.services.formValidationErrorHelper = formValidationErrorHelper;

        this._initialize();
    }

    BuildCreateController['$inject'] = ['$scope', 'buildService', 'formValidationErrorHelper', '$location'];

    BuildCreateController.prototype = {

        _create : function() {
            var self = this;
            
            this.services.buildService.save(this.$scope.build)
                .then(function(result){
                    self.$location.path('/build/list');
                })
                .catch(function(error){
                    self.services.formValidationErrorHelper.handleValidationErrors(error, self.$scope);
                });
        },

        _initialize: function ()
        {
            //intialise the build object for the checkboxes
            this.$scope.build = {};

            this.$scope.errors = {};

            this.$scope.create = this._create.bind(this);
        }
        
    };

    co.controllers.BuildCreateController = BuildCreateController;

})(co);
