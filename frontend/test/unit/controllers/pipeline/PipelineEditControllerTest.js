(function ()
{
    'use strict';

    describe('PipelineEditController', function ()
    {

        var ListItemPipelineer = co.builders.ListItemPipelineer;

        var pipeline = {
            name : 'name'
        };

        var routeParams = {
            pipelineId : 'pipelineId'
        };

        var mockPipelineService;
        var mockLocation;
        var mockFormValidationErrorHelper;

        beforeEach(function()
        {

            mockPipelineService = {
                update: jasmine.createSpy('update'),
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

            //and
            mockLocation = {
                path : jasmine.createSpy('path')
            };

            //and
            mockFormValidationErrorHelper = {
                handleValidationErrors : jasmine.createSpy('handleValidationErrors')
            };

        });

        it('on successCallback should update scope with given data', function ()
        {
            //given
            var scope = {};

            //when
            new co.controllers.PipelineEditController(scope, mockPipelineService, routeParams, mockFormValidationErrorHelper, mockLocation);

            //then
            expect(mockPipelineService.load).toHaveBeenCalled();
            expect(scope.pipeline).toBe(pipeline);
        });
    

        it('should redirect to list page on update when success', function ()
        {
            //given
            var scope = {
                pipeline : 'pipeline'
            };

            //and
            var mockUpdatePromise = {
                then: function (callback)
                    {
                        callback();
                        return {
                            catch : function(){}
                        };
                    }
            };

            mockPipelineService.update.and.returnValue(mockUpdatePromise);

            //when
            var controller = new co.controllers.PipelineEditController(scope, mockPipelineService, routeParams, mockFormValidationErrorHelper, mockLocation);

            controller._update();

            //then
            expect(mockPipelineService.update).toHaveBeenCalledWith(scope.pipeline);

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
            var mockUpdatePromise = {
                then: function (callback)
                    {
                        return {
                            catch : function(callback){
                                return callback(testError);
                            }
                        };
                    }
            };

            mockPipelineService.update.and.returnValue(mockUpdatePromise);

            //when
            var controller = new co.controllers.PipelineEditController(scope, mockPipelineService, routeParams, mockFormValidationErrorHelper, mockLocation);

            controller._update();

            //then
            expect(mockPipelineService.update).toHaveBeenCalledWith(scope.pipeline);

            //and
            expect(mockLocation.path).not.toHaveBeenCalledWith('/pipeline/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);

        });

    });

})();
