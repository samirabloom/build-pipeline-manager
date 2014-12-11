(function (co)
{
    'use strict';

    /*function HttpInterceptor($q)
    {
        this.$q = $q;
    }

    HttpInterceptor['$inject'] = ['$q'];

    HttpInterceptor.prototype =
    {
        responseError : function (rejection)
        {
            // do something on error
            switch (rejection.status)
            {
                case 0:
                    console.error('Error 0: Ooops... something went wrong with our system');
                    break;
                case 400:
                    //do something with rejection.data and the appropriate validationErrorHandler
                    console.error('Error 400: validation error');
                    break;
                case 401:
                    //redirect to the login page??
                    console.error('Error 401: Unauthorized error');
                    break;
                case 500:
                    //redirect to the login page??
                    console.error('Error 500: Something went wrong');
                    break;
                default:
                    console.error('Unknown error: Something went wrong');
            }
            return this.$q.reject(rejection);
        }
    };

    co.factories.HttpInterceptorFactory = function($q) {
        return new HttpInterceptor($q);
    };*/
    co.factories.HttpInterceptorFactory = function ($q)
    {
        return {
            'responseError' : function(rejection)
            {
                // do something on error
                switch (rejection.status)
                {
                    case 0:
                        console.error('Error 0: Ooops... something went wrong with our system');
                        break;
                    case 400:
                        //do something with rejection.data and the appropriate validationErrorHandler
                        console.error('Error 400: validation error');
                        break;
                    case 401:
                        //redirect to the login page??
                        console.error('Error 401: Unauthorized error');
                        break;
                    case 500:
                        //redirect to the login page??
                        console.error('Error 500: Something went wrong');
                        break;
                    default:
                        console.error('Unknown error: Something went wrong');
                }
                return $q.reject(rejection);
            }
        };
    };

})(co);

