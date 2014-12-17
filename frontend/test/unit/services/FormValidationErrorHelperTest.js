(function () {
    'use strict';

    describe('FormValidationErrorHelperTest', function () {

        it('should parse error and set on scope if response is 400', function () {
            // given
            var response = {
                status: 400,
                data: [
                    {"path": "number", "type": "type", "message": "please enter a valid number"},
                    {"path": "number", "type": "minimum", "message": "please a value higher then 0"},
                    {"path": "stage", "type": "enum", "message": "please enter a stage from [\"BUILD\", \"DEVELOP\", \"AUTO_QA\", \"MANUAL_QA\", \"UAT\", \"PROD\"]"},
                    {"path": "status", "type": "enum", "message": "please enter a status from [\"IN_PROGRESS\" , \"PASSED\", \"FAILED\"]"},
                    {"type": "required", "message": "please enter all required fields [\"message\",\"number\",\"pipelineId\",\"stage\",\"status\"]"}
                ]
            };

            // and
            var expectedParsedErrors = {
                "number": [
                    {
                        "type": "type",
                        "message": "please enter a valid number"
                    },
                    {
                        "type": "minimum",
                        "message": "please a value higher then 0"
                    }
                ],
                "stage": [
                    {
                        "type": "enum",
                        "message": "please enter a stage from [\"BUILD\", \"DEVELOP\", \"AUTO_QA\", \"MANUAL_QA\", \"UAT\", \"PROD\"]"
                    }
                ],
                "status": [
                    {
                        "type": "enum",
                        "message": "please enter a status from [\"IN_PROGRESS\" , \"PASSED\", \"FAILED\"]"
                    }
                ],
                "root": [
                    {
                        "type": "required",
                        "message": "please enter all required fields [\"message\",\"number\",\"pipelineId\",\"stage\",\"status\"]"
                    }
                ]
            };

            // and
            var scope = {};

            // and
            var formValidationErrorHelper = ns.factories.FormValidationErrorHelperFactory();

            // when
            formValidationErrorHelper.handleValidationErrors(response, scope);

            // then
            expect(scope.errors.number).toEqual(expectedParsedErrors.number);
            expect(scope.errors.stage).toEqual(expectedParsedErrors.stage);
            expect(scope.errors.status).toEqual(expectedParsedErrors.status);
            expect(scope.errors.root).toEqual(expectedParsedErrors.root);
            expect(scope.errors).toEqual(expectedParsedErrors);
        });

        it('should not parse error if response is 400', function () {
            // given
            var response = {
                status: 200,
                data: [
                    {"path": "number", "type": "type", "message": "please enter a valid number"}
                ]
            };

            // and
            var expectedParsedErrors = {};

            // and
            var scope = {};

            // and
            var formValidationErrorHelper = ns.factories.FormValidationErrorHelperFactory();

            // when
            formValidationErrorHelper.handleValidationErrors(response, scope);

            // then
            expect(scope.errors).toEqual(expectedParsedErrors);
        });

    });
})();
