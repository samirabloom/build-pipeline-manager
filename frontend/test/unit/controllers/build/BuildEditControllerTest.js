(function ()
{
    'use strict';

    describe('BuildEditController', function ()
    {

        var ListItemBuilder = co.builders.ListItemBuilder;

        var build = {
            name : 'name'
        };

        var routeParams = {
            buildId : 'buildId'
        };

        var mockBuildService;
        var mockLocation;
        var mockFormValidationErrorHelper;

        beforeEach(function()
        {

            mockBuildService = {
                update: jasmine.createSpy('update'),
                find: jasmine.createSpy('find')
            };

            //and
            var mockFindPromise = {
                then: function (callback)
                    {
                        return callback(build);
                    }
            };

            mockBuildService.find.and.returnValue(mockFindPromise);

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
            new co.controllers.BuildEditController(scope, mockBuildService, mockFormValidationErrorHelper, mockLocation, routeParams);

            //then
            expect(mockBuildService.find).toHaveBeenCalled();
            expect(scope.build).toBe(build);
        });
    

        it('should redirect to list page on update when success', function ()
        {
            //given
            var scope = {
                build : 'build'
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

            mockBuildService.update.and.returnValue(mockUpdatePromise);

            //when
            var controller = new co.controllers.BuildEditController(scope, mockBuildService, mockFormValidationErrorHelper, mockLocation, routeParams);

            controller._update();

            //then
            expect(mockBuildService.update).toHaveBeenCalledWith(scope.build);

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

            mockBuildService.update.and.returnValue(mockUpdatePromise);

            //when
            var controller = new co.controllers.BuildEditController(scope, mockBuildService, mockFormValidationErrorHelper, mockLocation, routeParams);

            controller._update();

            //then
            expect(mockBuildService.update).toHaveBeenCalledWith(scope.build);

            //and
            expect(mockLocation.path).not.toHaveBeenCalledWith('/build/list');

            //and
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);

        });

    });

})();
