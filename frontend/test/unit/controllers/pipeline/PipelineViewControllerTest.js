(function ()
{
    'use strict';

    describe('PipelineViewController', function ()
    {

        it('should initialize pipeline', function () {
            // given
            var scope = {};

            var pipelineResponse = {};

            // and - mock route parameters
            var mockRouteParams = {
                pipelineId: "pipelineId"
            };

            // and - mock pipeline service
            var mockPipelineService = {
                load: jasmine.createSpy('load')
            };
            mockPipelineService.load.and.returnValue({
                then: function (callback) {
                    return callback(pipelineResponse);
                }
            });

            // when
            var controller = new ns.controllers.PipelineViewController(scope, mockRouteParams, mockPipelineService);

            // then
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.pipelineId).toBe(mockRouteParams.pipelineId);

            // and
            expect(mockPipelineService.load).toHaveBeenCalled();
            expect(scope.pipeline).toBe(pipelineResponse);
        });

    });

})();
