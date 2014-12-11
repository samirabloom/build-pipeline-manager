(function(co) {
    'use strict';

    function BuildService($http)
    {
        this.$http = $http;
    }

    BuildService['$inject'] = ['$http'];

    BuildService.prototype =
    {        
        loadAll : function()
        {
            var self = this;
            return this.$http
                .get(Config.webServer + '/build')
                .then(self._onSuccessHandler);
        },

        save : function(build) {
            var self = this;
            return this.$http
                .put(Config.webServer + '/build', build)
                .then(function(result){
                    return true;
                });
        },

        update : function(build) {
            var self = this;
            return this.$http
                .post(Config.webServer + '/build', build)
                .then(function(result){
                    return true;
                });
        },

        find : function(buildId) {
            var self = this;
            return this.$http
                .get(Config.webServer + '/build/' + buildId)
                .then(self._onSuccessHandler);
        },

        _onSuccessHandler : function(result) {
            return result.data;
        }
    };

    co.factories.BuildServiceFactory = function($http) {
        return new BuildService($http);
    };

})(co);

