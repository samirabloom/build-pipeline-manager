(function ()
{
    'use strict';

    describe('BuildCreateController', function ()
    {

        var ListItemBuilder = ns.builders.ListItemBuilder;

        var mockBuildService;
        var mockLocation;
        var mockFormValidationErrorHelper;

        beforeEach(function()
        {

            mockBuildService = {
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
                build : 'build'
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

            mockBuildService.save.and.returnValue(mockSavePromise);

            //when
            var controller = new ns.controllers.BuildCreateController(scope, mockBuildService, mockFormValidationErrorHelper, mockLocation);

            controller._create();

            //then
            expect(mockBuildService.save).toHaveBeenCalledWith(scope.build);

            //and
            expect(mockLocation.path).toHaveBeenCalledWith('/build/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();

        });

        it('should update errors when validation error', function ()
        {
            //given
            var scope = {
                build : 'build'
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

            mockBuildService.save.and.returnValue(mockSavePromise);

            //when
            var controller = new ns.controllers.BuildCreateController(scope, mockBuildService, mockFormValidationErrorHelper, mockLocation);

            controller._create();

            //then
            expect(mockBuildService.save).toHaveBeenCalledWith(scope.build);

            //and
            expect(mockLocation.path).not.toHaveBeenCalledWith('/build/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);

        });

    });

})();
