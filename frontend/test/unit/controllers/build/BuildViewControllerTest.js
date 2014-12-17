(function ()
{
    'use strict';

    describe('BuildViewController', function ()
    {

        it('should initialize list of pipelines and build', function () {
            // given
            var scope = {};

            var pipelinesResponse = [
                {}
            ];
            var buildResponse = [
                {}
            ];

            // and - mock route parameters
            var mockRouteParams = {
                buildId: "buildId"
            };

            // and - mock pipeline service
            var mockPipelineService = {
                loadAll: jasmine.createSpy('loadAll')
            };
            mockPipelineService.loadAll.and.returnValue({
                then: function (callback) {
                    return callback(pipelinesResponse);
                }
            });

            // and - mock build service
            var mockBuildService = {
                load: jasmine.createSpy('load')
            };
            mockBuildService.load.and.returnValue({
                then: function (callback) {
                    return callback(buildResponse);
                }
            });

            // when
            var controller = new ns.controllers.BuildViewController(scope, mockRouteParams, mockPipelineService, mockBuildService);

            // then
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.buildService).toBe(mockBuildService);
            expect(controller.buildId).toBe(mockRouteParams.buildId);

            // and
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelines).toBe(pipelinesResponse);

            // and
            expect(mockBuildService.load).toHaveBeenCalled();
            expect(scope.build).toBe(buildResponse);
        });

    });

})();
