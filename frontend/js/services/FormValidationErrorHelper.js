(function(co) {
    'use strict';

    function FormValidationErrorHelper(){}

    FormValidationErrorHelper.prototype =
    {
        handleValidationErrors : function(error, scope)
        {
            if (error.status === 400) {
                scope.errors = error.data.error.fields;
            }
        }
    };

    co.factories.FormValidationErrorHelperFactory = function($http) {
        return new FormValidationErrorHelper();
    };

})(co);
