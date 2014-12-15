(function ()
{
    'use strict';

    describe('PipelineCreateController', function ()
    {

        var ListItemPipelineer = co.builders.ListItemPipelineer;

        var mockPipelineService;
        var mockLocation;
        var mockFormValidationErrorHelper;

        beforeEach(function()
        {

            mockPipelineService = {
                save: jasmine.createSpy('save')
            };

            //and
            mockLocation = {
                path : jasmine.createSpy('path')
            };

            //and
            mockFormValidationErrorHelper = {
                handleValidationErrors : jasmine.createSpy('handleValidationErrors')
            };

        });
    

        it('should redirect to list page on create when success', function ()
        {
            //given
            var scope = {
                pipeline : 'pipeline'
            };

            //and
            var mockSavePromise = {
                then: function (callback)
                    {
                        callback();
                        return {
                            catch : function(){}
                        };
                    }
            };

            mockPipelineService.save.and.returnValue(mockSavePromise);

            //when
            var controller = new co.controllers.PipelineCreateController(scope, mockPipelineService, mockFormValidationErrorHelper, mockLocation);

            controller._create();

            //then
            expect(mockPipelineService.save).toHaveBeenCalledWith(scope.pipeline);

            //and
            expect(mockLocation.path).toHaveBeenCalledWith('/pipeline/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();

        });

        it('should update errors when validation error', function ()
        {
            //given
            var scope = {
                pipeline : 'pipeline'
            };

            var testError = 'testError';

            //and
            var mockSavePromise = {
                then: function (callback)
                    {
                        return {
                            catch : function(callback){
                                return callback(testError);
                            }
                        };
                    }
            };

            mockPipelineService.save.and.returnValue(mockSavePromise);

            //when
            var controller = new co.controllers.PipelineCreateController(scope, mockPipelineService, mockFormValidationErrorHelper, mockLocation);

            controller._create();

            //then
            expect(mockPipelineService.save).toHaveBeenCalledWith(scope.pipeline);

            //and
            expect(mockLocation.path).not.toHaveBeenCalledWith('/pipeline/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);

        });

    });

})();
