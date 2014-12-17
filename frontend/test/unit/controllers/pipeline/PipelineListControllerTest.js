(function () {
    'use strict';

    describe('PipelineListController', function () {

        it('should initialize list of pipelines', function () {
            // given
            var scope = {};

            var pipelinesResponse = [
                {}
            ];

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
            var controller = new ns.controllers.PipelineListController(scope, mockPipelineService);

            // then
            expect(controller.services.pipelineService).toBe(mockPipelineService);

            // and
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelines).toBe(pipelinesResponse);
        });
    });
})();
