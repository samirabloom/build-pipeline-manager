(function () {
    'use strict';

    describe('BuildListController', function () {

        it('should initialize list of pipelines and list of builds', function () {
            // given
            var scope = {};

            var buildsResponse = [
                {}
            ];
            var pipelinesResponse = [
                {}
            ];

            // and - mock build service
            var mockBuildService = {
                loadAll: jasmine.createSpy('loadAll')
            };
            mockBuildService.loadAll.and.returnValue({
                then: function (callback) {
                    return callback(buildsResponse);
                }
            });

            // and - mock pipeline service
            var mockPipelineService = {
                loadAll: jasmine.createSpy('loadAll')
            };
            mockPipelineService.loadAll.and.returnValue({
                then: function (callback) {
                    return callback(pipelinesResponse);
                }
            });

            // when
            var controller = new ns.controllers.BuildListController(scope, mockPipelineService, mockBuildService);

            // then
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.buildService).toBe(mockBuildService);

            // and
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelines).toBe(pipelinesResponse);

            // and
            expect(mockBuildService.loadAll).toHaveBeenCalled();
            expect(scope.builds).toBe(buildsResponse);
        });
    });
})();
