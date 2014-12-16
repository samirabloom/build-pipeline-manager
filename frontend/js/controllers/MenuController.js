(function (ns)
{
    'use strict';

    function MenuController($scope, $location)
    {
        this.$scope = $scope;
        this.$location = $location;

        this._initialize();
    }

    MenuController['$inject'] = ['$scope', '$location'];

    MenuController.prototype = {

        _isCurrentPage: function(uri) {
            return this.$location.path() === uri;
        },

        _initialize: function ()
        {
            this.$scope.isCurrentPage = this._isCurrentPage.bind(this);
        }
    };

    ns.controllers.MenuController = MenuController;

})(ns);
