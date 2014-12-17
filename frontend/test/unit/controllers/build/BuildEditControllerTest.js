(function () {
    'use strict';

    describe('BuildEditController', function () {

        it('should initialize list of pipelines', function () {
            // given
            var scope = {};

            var buildResponse = {};

            var pipelinesResponse = [
                {}
            ];

            // and - mock $location
            var mockLocation = { };

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

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {};

            // when
            var controller = new ns.controllers.BuildEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // then
            expect(controller.$location).toBe(mockLocation);
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.buildService).toBe(mockBuildService);
            expect(controller.services.formValidationErrorHelper).toBe(mockFormValidationErrorHelper);
            expect(controller.buildId).toBe(mockRouteParams.buildId);

            // then - pipelines loaded
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelines).toBe(pipelinesResponse);

            // then - pipelines loaded
            expect(mockBuildService.load).toHaveBeenCalled();
            expect(scope.build).toBe(buildResponse);
        });

        it('should redirect to list page on create when success', function () {
            // given
            var scope = {
                build: {}
            };

            var buildResponse = {};

            //and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
            };

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
                    return callback([
                        {}
                    ]);
                }
            });

            // and - mock build service
            var mockBuildService = {
                load: jasmine.createSpy('load'),
                update: jasmine.createSpy('update')
            };
            mockBuildService.load.and.returnValue({
                then: function (callback) {
                    return callback(buildResponse);
                }
            });
            mockBuildService.update.and.returnValue({
                then: function (callback) {
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
            var controller = new ns.controllers.BuildEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // when
            controller._update();

            // then
            expect(mockBuildService.update).toHaveBeenCalledWith(scope.build);
            expect(mockLocation.path).toHaveBeenCalledWith('/build/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();
        });

        it('should update errors when validation error', function () {
            // given
            var scope = {
                build: {}
            };

            var buildResponse = { };

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
                loadAll: jasmine.createSpy('loadAll')
            };
            mockPipelineService.loadAll.and.returnValue({
                then: function (callback) {
                    return callback([
                        {}
                    ]);
                }
            });

            // and - mock build service
            var mockBuildService = {
                load: jasmine.createSpy('load'),
                update: jasmine.createSpy('update')
            };
            mockBuildService.load.and.returnValue({
                then: function (callback) {
                    return callback(buildResponse);
                }
            });
            mockBuildService.update.and.returnValue({
                then: function (callback) {
                    return {
                        catch: function (callback) {
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
            var controller = new ns.controllers.BuildEditController(scope, mockLocation, mockRouteParams, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // when
            controller._update();

            // then
            expect(mockBuildService.update).toHaveBeenCalledWith(scope.build);
            expect(mockLocation.path).not.toHaveBeenCalledWith('/build/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);
        });

    });

})();
