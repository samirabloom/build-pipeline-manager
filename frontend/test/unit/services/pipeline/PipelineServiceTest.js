(function ()
{
    'use strict';

    describe('PipelineService', function ()
    {
        var mockHttp;
        var mockPromise;
        var testPipelineServiceTest;
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

            testPipelineServiceTest = co.factories.PipelineServiceFactory(mockHttp);
        });

        it('on loadAll should call $http.get', function ()
        {
            //given
            mockHttp.get.and.returnValue(mockPromise);
            
            //and
            var expectedResult = {"key": "value"};
            mockPromise.then.and.returnValue(expectedResult);

            //when
            var returnedResult = testPipelineServiceTest.loadAll();

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/pipeline');

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
            var pipelineId = 'ACCOUNT-SYSTEM-ID';

            //when
            var returnedResult = testPipelineServiceTest.load(pipelineId);

            //then
            expect(mockHttp.get).toHaveBeenCalledWith(Config.webServer + '/pipeline/' + pipelineId);

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
            var pipelineToSave = {};

            //when
            var returnedResult = testPipelineServiceTest.save(pipelineToSave);

            //then
            expect(mockHttp.post).toHaveBeenCalledWith(Config.webServer + '/pipeline', pipelineToSave);

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
            var pipelineToUpdate = { id: "pipeline_id" };

            //when
            var returnedResult = testPipelineServiceTest.update(pipelineToUpdate);

            //then
            expect(mockHttp.put).toHaveBeenCalledWith(Config.webServer + '/pipeline/pipeline_id', pipelineToUpdate);

            //and
            expect(expectedResult).toEqual(returnedResult);
        });
    });
})();
