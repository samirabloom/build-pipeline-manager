/*global loadJson:true,tv4:true */
(function () {
    'use strict';


    describe('BuildListController', function () {

         /*it('should work', function()
         {
         var objects = [
         {}
         ];

         var schema = loadJson("schema/list-response.json");
         var result = tv4.validateResult(objects, schema);
         console.log(result);

         expect(result.valid).toBe(false);
         });*/

        it('on successCallback should update scope with given data', function () {
            //given
            var scope = {};

            var accountSystemsListResponse = [
                {'testData': 'testData1'},
                {'testData': 'testData2'}
            ];

            var mockBuildService = {
                loadAll: jasmine.createSpy('loadAll')
            };

            var mockPromise = {
                then: function (callback) {
                    return callback(accountSystemsListResponse);
                }
            };

            //and
            mockBuildService.loadAll.and.returnValue(mockPromise);

            //when
            new ns.controllers.BuildListController(scope, mockBuildService);

            //then
            expect(mockBuildService.loadAll).toHaveBeenCalled();
            expect(scope.builds).toBe(accountSystemsListResponse);
        });
    });
})();
