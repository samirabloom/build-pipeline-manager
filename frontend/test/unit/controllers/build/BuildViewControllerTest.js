(function ()
{
    'use strict';

    describe('BuildViewController', function ()
    {

        var ListItemBuilder = co.builders.ListItemBuilder;

        var build = {
            name : 'name'
        };

        var routeParams = {
            buildId : 'buildId'
        };

        var mockBuildService;

        beforeEach(function()
        {

            mockBuildService = {
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
        });

        it('on successCallback should update scope with given data', function ()
        {
            //given
            var scope = {};

            //when
            new co.controllers.BuildViewController(scope, mockBuildService, routeParams);

            //then
            expect(mockBuildService.find).toHaveBeenCalled();
            expect(scope.build).toBe(build);
        });

    });

})();
