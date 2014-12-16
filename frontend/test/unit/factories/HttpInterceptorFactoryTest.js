(function ()
{
    'use strict';

    describe('HttpInterceptorFactory', function ()
    {

        var mockQ;
        var testHttpInterceptor;
        var consoleSpy;

        beforeEach(function ()
        {
            mockQ = {
                reject: jasmine.createSpy('$q.reject')
            };
            mockQ.reject.and.returnValue('');

            consoleSpy = console;
            spyOn(consoleSpy, 'error');

            testHttpInterceptor = ns.factories.HttpInterceptorFactory(mockQ);
        });

        it('on responseError with response code 0 should reject response', function ()
        {
            //given
            var testRejection = {
                status: 0
            };

            //when
            testHttpInterceptor.responseError(testRejection);

            //then
            expect(mockQ.reject).toHaveBeenCalledWith(testRejection);
            //and
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 0: Ooops... something went wrong with our system');
        });

        it('on responseError with response code 400 should reject response', function ()
        {
            //given
            var testRejection = {
                status: 400
            };

            //when
            testHttpInterceptor.responseError(testRejection);

            //then
            expect(mockQ.reject).toHaveBeenCalledWith(testRejection);
            //and
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 400: validation error');
        });

        it('on responseError with response code 401 should reject response', function ()
        {
            //given
            var testRejection = {
                status: 401
            };

            //when
            testHttpInterceptor.responseError(testRejection);

            //then
            expect(mockQ.reject).toHaveBeenCalledWith(testRejection);
            //and
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 401: Unauthorized error');
        });

        it('on responseError with response code 500 should reject response', function ()
    {
        //given
        var testRejection = {
            status: 500
        };

        //when
        testHttpInterceptor.responseError(testRejection);

        //then
        expect(mockQ.reject).toHaveBeenCalledWith(testRejection);
        //and
        expect(consoleSpy.error).toHaveBeenCalledWith('Error 500: Something went wrong');
    });

        it('on responseError with unexpected response code should reject response', function ()
        {
            //given
            var testRejection = {
                status: 666
            };

            //when
            testHttpInterceptor.responseError(testRejection);

            //then
            expect(mockQ.reject).toHaveBeenCalledWith(testRejection);
            //and
            expect(consoleSpy.error).toHaveBeenCalledWith('Unknown error: Something went wrong');
        });

    });

})();

