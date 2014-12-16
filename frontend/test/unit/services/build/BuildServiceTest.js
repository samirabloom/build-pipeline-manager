(function ()
{
    'use strict';

    describe('BuildService', function ()
    {
        var mockHttp;
        var mockPromise;
        var buildService;

        beforeEach(function ()
        {
            mockHttp = {
                get: jasmine.createSpy('$http.get'),
                put: jasmine.createSpy('$http.put'),
                post: jasmine.createSpy('$http.post')
            };

            mockPromise = {
                then: jasmine.createSpy('promise.then')
            };

            buildService = ns.factories.BuildServiceFactory(mockHttp);
        });

        it('on loadAll should call $http.get', function ()
        {
            //given
            mockHttp.get.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //when
            var returnedResult = buildService.loadAll();

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/build');

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on load should call $http.get', function ()
        {
            //given
            mockHttp.get.and.returnValue(mockPromise);

            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildId = 'ACCOUNT-SYSTEM-ID';

            //when
            var returnedResult = buildService.load(buildId);

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/build/' + buildId);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on save should call $http.post', function ()
        {
            //given
            mockHttp.post.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildToSave = {};

            //when
            var returnedResult = buildService.save(buildToSave);

            //then
            expect(mockHttp.post).toHaveBeenCalledWith(Config.webServer + '/build', buildToSave);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on update should call $http.put', function ()
        {
            //given
            mockHttp.put.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildToUpdate = { id: "build_id"};

            //when
            var returnedResult = buildService.update(buildToUpdate);

            //then
            expect(mockHttp.put).toHaveBeenCalledWith(Config.webServer + '/build/build_id', buildToUpdate);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });
    });
})();
