(function () {
    'use strict';

    describe('BuildCreateController', function () {

        it('should initialize list of pipelines', function () {
            // given
            var scope = {};

            var pipelinesResponse = [
                {}
            ];

            //and - mock $location
            var mockLocation = { };

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
            var mockBuildService = { };

            // and - mock form validation helper
            var mockFormValidationErrorHelper = {};

            // when
            var controller = new ns.controllers.BuildCreateController(scope, mockLocation, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // then
            expect(controller.$location).toBe(mockLocation);
            expect(controller.services.pipelineService).toBe(mockPipelineService);
            expect(controller.services.buildService).toBe(mockBuildService);
            expect(controller.services.formValidationErrorHelper).toBe(mockFormValidationErrorHelper);

            // then - pipelines loaded
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelines).toBe(pipelinesResponse);
        });

        it('should redirect to list page on create when success', function () {
            // given
            var scope = {
                build: {}
            };

            // and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
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
                save: jasmine.createSpy('save')
            };
            mockBuildService.save.and.returnValue({
                then: function (callback) {
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
            var controller = new ns.controllers.BuildCreateController(scope, mockLocation, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // when
            controller._create();

            // then
            expect(mockBuildService.save).toHaveBeenCalledWith(scope.build);
            expect(mockLocation.path).toHaveBeenCalledWith('/build/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).not.toHaveBeenCalled();

        });

        it('should update errors when validation error', function () {
            // given
            var scope = {
                build: {}
            };

            var testError = 'testError';

            // and - mock $location
            var mockLocation = {
                path: jasmine.createSpy('path')
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
                save: jasmine.createSpy('save')
            };
            mockBuildService.save.and.returnValue({
                then: function (callback) {
                    return {
                        catch: function (callback) {
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
            var controller = new ns.controllers.BuildCreateController(scope, mockLocation, mockPipelineService, mockBuildService, mockFormValidationErrorHelper);

            // when
            controller._create();

            // then
            expect(mockBuildService.save).toHaveBeenCalledWith(scope.build);
            expect(mockLocation.path).not.toHaveBeenCalledWith('/build/list');
            expect(mockFormValidationErrorHelper.handleValidationErrors).toHaveBeenCalledWith(testError, scope);
        });

    });

})();
