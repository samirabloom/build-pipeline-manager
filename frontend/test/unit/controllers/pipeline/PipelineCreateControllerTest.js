(function ()
{
    'use strict';

    describe('PipelineCreateController', function ()
    {
        it('should initialize list of services', function () {
            // given
            var scope = {};

            //and - mock $location
            var mockLocation = { };

            // and - mock pipeline service
            var mockPipelineService = { };

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {};

            // when
            var controller = new ns.controllers.PipelineCreateController(scope, mockLocation, mockPipelineService, mockFormValidationErrorHelper);

            // then
            expect(controller.$location).toBe(mockLocation);
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.formValidationErrorHelper).toBe(mockFormValidationErrorHelper);
        });

        it('should redirect to list page on create when success', function ()
        {
            // given
            var scope = {
                pipeline: {}
            };

            // and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
            };

            // and - mock pipeline service
            var mockPipelineService = {
                save: jasmine.createSpy('save')
            };
            mockPipelineService.save.and.returnValue({
                then: function (callback)
                {
                    callback();
                    return {
                        catch : function(){}
                    };
                }
            });

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {
                handleValidationErrors: jasmine.createSpy('handleValidationErrors')
            };

            // and - the controller
            var controller = new ns.controllers.PipelineCreateController(scope, mockLocation, mockPipelineService, mockFormValidationErrorHelper);

            // when
            controller._create();

            // then
            expect(mockPipelineService.save).toHaveBeenCalledWith(scope.pipeline);
            expect(mockLocation.path).toHaveBeenCalledWith('/pipeline/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();
        });

        it('should update errors when validation error', function ()
        {
            // given
            var scope = {
                pipeline: {}
            };

            var testError = 'testError';

            // and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
            };

            // and - mock pipeline service
            var mockPipelineService = {
                save: jasmine.createSpy('save')
            };
            mockPipelineService.save.and.returnValue({
                then: function (callback)
                {
                    return {
                        catch : function(callback){
                            return callback(testError);
                        }
                    };
                }
            });

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {
                handleValidationErrors: jasmine.createSpy('handleValidationErrors')
            };

            // and - the controller
            var controller = new ns.controllers.PipelineCreateController(scope, mockLocation, mockPipelineService, mockFormValidationErrorHelper);

            // when
            controller._create();

            // then
            expect(mockPipelineService.save).toHaveBeenCalledWith(scope.pipeline);
            expect(mockLocation.path).not.toHaveBeenCalledWith('/pipeline/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);
        });

    });

})();
