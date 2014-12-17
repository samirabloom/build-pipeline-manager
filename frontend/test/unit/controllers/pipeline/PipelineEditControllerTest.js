(function ()
{
    'use strict';

    describe('PipelineEditController', function ()
    {
        it('should initialize list of services and pipeline', function ()
        {
            // given
            var scope = {};

            var pipelineResponse = {};

            // and - mock $location
            var mockLocation = { };

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

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {};

            // when
            var controller = new ns.controllers.PipelineEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockFormValidationErrorHelper);

            // then
            expect(controller.$location).toBe(mockLocation);
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.formValidationErrorHelper).toBe(mockFormValidationErrorHelper);
            expect(controller.pipelineId).toBe(mockRouteParams.pipelineId);

            // then
            expect(mockPipelineService.load).toHaveBeenCalled();
            expect(scope.pipeline).toBe(pipelineResponse);
        });

        it('should redirect to list page on update when success', function ()
        {
            // given
            var scope = {
                pipeline: {}
            };

            var pipelineResponse = {};

            //and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
            };

            // and - mock route parameters
            var mockRouteParams = {
                pipelineId: "pipelineId"
            };

            // and - mock pipeline service
            var mockPipelineService = {
                load: jasmine.createSpy('load'),
                update: jasmine.createSpy('update')
            };
            mockPipelineService.load.and.returnValue({
                then: function (callback) {
                    return callback(pipelineResponse);
                }
            });
            mockPipelineService.update.and.returnValue({
                then: function (callback)
                {
                    callback();
                    return {
                        catch : function(){}
                    };
                }
            });

            // and - form validation helper
            var mockFormValidationErrorHelper = {
                handleValidationErrors: jasmine.createSpy('handleValidationErrors')
            };

            // and - the controller
            var controller = new ns.controllers.PipelineEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockFormValidationErrorHelper);

            // when
            controller._update();

            // then
            expect(mockPipelineService.update).toHaveBeenCalledWith(scope.pipeline);
            expect(mockLocation.path).toHaveBeenCalledWith('/pipeline/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();
        });

        it('should update errors when validation error', function ()
        {
            // given
            var scope = {
                pipeline: {}
            };

            var pipelineResponse = { };

            var testError = 'testError';

            // and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
            };

            // and - mock route parameters
            var mockRouteParams = {
                buildId: "buildId"
            };

            // and - mock pipeline service
            var mockPipelineService = {
                load: jasmine.createSpy('load'),
                update: jasmine.createSpy('update')
            };
            mockPipelineService.load.and.returnValue({
                then: function (callback) {
                    return callback(pipelineResponse);
                }
            });
            mockPipelineService.update.and.returnValue({
                then: function (callback)
                    {
                        return {
                            catch : function(callback){
                                return callback(testError);
                            }
                        };
                    }
            });

            // and - form validation helper
            var mockFormValidationErrorHelper = {
                handleValidationErrors: jasmine.createSpy('handleValidationErrors')
            };

            // and - the controller
            var controller = new ns.controllers.PipelineEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockFormValidationErrorHelper);

            // when
            controller._update();

            // then
            expect(mockPipelineService.update).toHaveBeenCalledWith(scope.pipeline);
            expect(mockLocation.path).not.toHaveBeenCalledWith('/pipeline/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);
        });

    });

})();
