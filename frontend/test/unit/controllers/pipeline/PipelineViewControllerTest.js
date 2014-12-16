(function ()
{
    'use strict';

    describe('PipelineViewController', function ()
    {

        var ListItemPipelineer = ns.builders.ListItemPipelineer;

        var pipeline = {
            name : 'name'
        };

        var routeParams = {
            pipelineId : 'pipelineId'
        };

        var mockPipelineService;

        beforeEach(function()
        {

            mockPipelineService = {
                load: jasmine.createSpy('load')
            };

            //and
            var mockFindPromise = {
                then: function (callback)
                    {
                        return callback(pipeline);
                    }
            };

            mockPipelineService.load.and.returnValue(mockFindPromise);
        });

        it('on successCallback should update scope with given data', function ()
        {
            //given
            var scope = {};

            //when
            new ns.controllers.PipelineViewController(scope, mockPipelineService, routeParams);

            //then
            expect(mockPipelineService.load).toHaveBeenCalled();
            expect(scope.pipeline).toBe(pipeline);
        });

    });

})();
