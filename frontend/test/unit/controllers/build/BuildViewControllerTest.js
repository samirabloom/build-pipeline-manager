(function ()
{
    'use strict';

    describe('BuildViewController', function ()
    {

        var ListItemBuilder = ns.builders.ListItemBuilder;

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
        });

        it('on successCallback should update scope with given data', function ()
        {
            //given
            var scope = {};

            //when
            new ns.controllers.BuildViewController(scope, mockBuildService, routeParams);

            //then
            expect(mockBuildService.load).toHaveBeenCalled();
            expect(scope.build).toBe(build);
        });

    });

})();
