(function ()
{
    'use strict';

    describe('HttpInterceptorAngularTest', function ()
    {

        var $httpBackend;
        var testBuildService;
        var httpInterceptorSpy;
        var consoleSpy;

        beforeEach(function ()
        {
            var $injector = angular.injector(['build_manager', 'ngMock']);
            $httpBackend = $injector.get('$httpBackend');
            testBuildService = $injector.get('buildService');

            httpInterceptorSpy = $injector.get('httpInterceptor');
            spyOn(httpInterceptorSpy, 'responseError').and.callThrough();

            consoleSpy = console;
            spyOn(consoleSpy, 'error');
        });

        afterEach(function ()
        {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('on request with 0 response code should get error', function ()
        {
            // given
            $httpBackend.expectGET(Config.webServer + '/build').respond(0, 'bad request');

            // when
            testBuildService.loadAll();
            $httpBackend.flush();

            // then
            expect(httpInterceptorSpy.responseError).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 0: Ooops... something went wrong with our system');

        });

        it('on request with 400 response code should get validation error', function ()
        {
            // given
            $httpBackend.expectGET(Config.webServer + '/build').respond(400, 'bad request');

            // when
            testBuildService.loadAll();
            $httpBackend.flush();

            // then
            expect(httpInterceptorSpy.responseError).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 400: validation error');
        });

        it('on request with 401 response code should get unauthorized error', function ()
        {
            // given
            $httpBackend.expectGET(Config.webServer + '/build').respond(401, 'bad request');

            // when
            testBuildService.loadAll();
            $httpBackend.flush();

            // then
            expect(httpInterceptorSpy.responseError).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 401: Unauthorized error');

        });

        it('on request with 500 response code should get generic error', function ()
        {
            // given
            $httpBackend.expectGET(Config.webServer + '/build').respond(500, 'bad request');

            // when
            testBuildService.loadAll();
            $httpBackend.flush();

            // then
            expect(httpInterceptorSpy.responseError).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalledWith('Error 500: Something went wrong');

        });

        it('on request with not expected response code should get error error', function ()
        {
            // given
            $httpBackend.expectGET(Config.webServer + '/build').respond(666, 'bad request');

            // when
            testBuildService.loadAll();
            $httpBackend.flush();

            // then
            expect(httpInterceptorSpy.responseError).toHaveBeenCalled();
            expect(consoleSpy.error).toHaveBeenCalledWith('Unknown error: Something went wrong');

        });

    });

})();
