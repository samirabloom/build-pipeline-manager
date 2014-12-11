(function ()
{
    'use strict';

    describe('BuildService', function ()
    {
        var mockHttp;
        var mockPromise;
        var testBuildServiceTest;
        var expectedConfig;

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

            testBuildServiceTest = co.factories.BuildServiceFactory(mockHttp);
        });

        it('on loadAll should call $http.get', function ()
        {
            //given
            mockHttp.get.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //when
            var returnedResult = testBuildServiceTest.loadAll();

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/angular/build');

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on save should call $http.put', function ()
        {
            //given
            mockHttp.put.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildToSave = {};

            //when
            var returnedResult = testBuildServiceTest.save(buildToSave);

            //then
            expect(mockHttp.put).toHaveBeenCalledWith(Config.webServer + '/angular/build', buildToSave);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on update should call $http.post', function ()
        {
            //given
            mockHttp.post.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildToUpdate = {};

            //when
            var returnedResult = testBuildServiceTest.update(buildToUpdate);

            //then
            expect(mockHttp.post).toHaveBeenCalledWith(Config.webServer + '/angular/build', buildToUpdate);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });

        it('on find should call $http.get', function ()
        {
            //given
            mockHttp.get.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //and
            var buildId = 'ACCOUNT-SYSTEM-ID';

            //when
            var returnedResult = testBuildServiceTest.find(buildId);

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/angular/build/' + buildId);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });
    });
})();
