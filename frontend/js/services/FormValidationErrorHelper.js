(function (ns) {
    'use strict';

    function FormValidationErrorHelper() {
    }

    FormValidationErrorHelper.prototype =
    {
        handleValidationErrors: function (response, scope) {
            scope.errors = {};
            if (response.status === 400) {
                for (var i = 0, len = response.data.length; i < len; i++) {
                    var error = response.data[i];

                    var path = (error.path || "root");
                    if (!scope.errors[ path]) {
                        scope.errors[path] = [];
                    }
                    scope.errors[path].push(error);

                    delete error.path;
                }
            } else if (response.status === 500) {
                scope.errors["root"].push({
                    type: "server",
                    message: "there was a problems processing you request please try again later"
                });
            }
        }
    };

    ns.factories.FormValidationErrorHelperFactory = function ($http) {
        return new FormValidationErrorHelper();
    };

})(ns);

