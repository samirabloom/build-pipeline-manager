(function ()
{
    'use strict';

    describe('BuildEditController', function ()
    {

        var ListItemBuilder = ns.builders.ListItemBuilder;

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
                load: jasmine.createSpy('load')
            };

            //and
            var mockFindPromise = {
                then: function (callback)
                    {
                        return callback(build);
                    }
            };

            mockBuildService.load.and.returnValue(mockFindPromise);

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
            new ns.controllers.BuildEditController(scope, mockBuildService, routeParams, mockFormValidationErrorHelper, mockLocation);

            //then
            expect(mockBuildService.load).toHaveBeenCalled();
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
            var controller = new ns.controllers.BuildEditController(scope, mockBuildService, routeParams, mockFormValidationErrorHelper, mockLocation);

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
            var controller = new ns.controllers.BuildEditController(scope, mockBuildService, routeParams, mockFormValidationErrorHelper, mockLocation);

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
