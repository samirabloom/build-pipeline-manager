(function ()
{
    'use strict';

    describe('FormValidationErrorHelperTest', function ()
    {   

        it('should not set errors property in scope when status code is not 400', function ()
        {
            //given
            var formValidationErrorHelper = co.factories.FormValidationErrorHelperFactory();

            //and
            var scope = {};

            //and
            var error = {
                status : 500,
                data : {
                    error : {
                        fields : 'errorFields'
                    }
                }
            };

            //and
            var expectedScope = {};

            //when
            formValidationErrorHelper.handleValidationErrors(error, scope);

            //then
            expect(scope).toEqual(expectedScope);
        });


        it('should set errors property in scope when status code is 400', function ()
        {
            //given
            var formValidationErrorHelper = co.factories.FormValidationErrorHelperFactory();

            //and
            var scope = {};

            //and
            var error = {
                status : 400,
                data : {
                    error : {
                        fields : 'errorFields'
                    }
                }
            };

            //when
            formValidationErrorHelper.handleValidationErrors(error, scope);

            //then
            expect(scope.errors).toEqual(error.data.error.fields);
        });

    });
})();
