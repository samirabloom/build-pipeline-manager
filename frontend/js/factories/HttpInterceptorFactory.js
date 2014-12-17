(function (ns)
{
    'use strict';

    ns.factories.HttpInterceptorFactory = function ($q)
    {
        return {
            'responseError' : function(rejection)
            {
                // do something on error
                switch (rejection.status)
                {
                    case 0:
                        console.log('Error 0: Ooops... something went wrong with our system');
                        break;
                    case 400:
                        // do something with rejection.data and the appropriate validationErrorHandler
                        console.log('Error 400: validation error');
                        break;
                    case 401:
                        // redirect to the login page??
                        console.log('Error 401: Unauthorized error');
                        break;
                    case 500:
                        // redirect to the login page??
                        console.log('Error 500: Something went wrong');
                        break;
                    default:
                        console.log('Unknown error: Something went wrong');
                }
                return $q.reject(rejection);
            }
        };
    };

})(ns);

