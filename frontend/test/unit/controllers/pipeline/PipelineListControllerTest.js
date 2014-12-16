/*global loadJson:true,tv4:true */
(function () {
    'use strict';


    describe('PipelineListController', function () {

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

            var mockPipelineService = {
                loadAll: jasmine.createSpy('loadAll')
            };

            var mockPromise = {
                then: function (callback) {
                    return callback(accountSystemsListResponse);
                }
            };

            //and
            mockPipelineService.loadAll.and.returnValue(mockPromise);

            //when
            new ns.controllers.PipelineListController(scope, mockPipelineService);

            //then
            expect(mockPipelineService.loadAll).toHaveBeenCalled();
            expect(scope.pipelinesList).toBe(accountSystemsListResponse);
        });
    });
})();
