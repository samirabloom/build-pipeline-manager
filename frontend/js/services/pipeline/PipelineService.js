(function(co) {
    'use strict';

    function PipelineService($http)
    {
        this.$http = $http;
    }

    PipelineService['$inject'] = ['$http'];

    PipelineService.prototype =
    {        
        loadAll : function()
        {
            var self = this;
            return this.$http
                .get(Config.webServer + '/pipeline')
                .then(self._onSuccessHandler);
        },

        load : function(pipelineId) {
            var self = this;
            return this.$http
                .get(Config.webServer + '/pipeline/' + pipelineId)
                .then(self._onSuccessHandler);
        },

        save : function(pipeline) {
            var self = this;
            return this.$http
                .post(Config.webServer + '/pipeline', pipeline)
                .then(function(result){
                    return true;
                });
        },

        update : function(pipeline) {
            var pipelineId = pipeline.id;
            delete pipeline.id;
            return this.$http
                .put(Config.webServer + '/pipeline/' + pipelineId, pipeline)
                .then(function(result){
                    return true;
                });
        },

        _onSuccessHandler : function(result) {
            return result.data;
        }
    };

    co.factories.PipelineServiceFactory = function($http) {
        return new PipelineService($http);
    };

})(co);

