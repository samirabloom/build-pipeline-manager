(function (module) {
    "use strict";

    var viewBuildResponse = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "number": 1,
        "status": "PASSED",
        "stage": "BUILD",
        "message": "build completed",
        "createdDate": "2014-12-14T18:52:02.043Z",
        "updatedDate": "2014-12-14T18:52:02.043Z"
    };

    var editBuildResponse = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "number": 3,
        "status": "IN_PROGRESS",
        "stage": "AUTO_QA",
        "message": "auto qa being deployed",
        "createdDate": "2014-12-14T18:52:02.043Z",
        "updatedDate": "2014-12-14T18:52:02.043Z"
    };

    var viewPipelineResponse = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "name": "test pipeline",
        "stages": [
            {
                "name": "BUILD"
            },
            {
                "name": "DEVELOPMENT"
            },
            {
                "name": "AUTO_QA"
            },
            {
                "name": "MANUAL_QA"
            },
            {
                "name": "UAT"
            },
            {
                "name": "PRODUCTION"
            }
        ]
    };


    module.exports = {
        build: {
            view: viewBuildResponse,
            edit: editBuildResponse,
            list: [
                viewBuildResponse,
                editBuildResponse,
                viewBuildResponse,
                editBuildResponse
            ]
        },
        pipeline: {
            view: viewPipelineResponse,
            edit: viewPipelineResponse,
            list: [
                viewPipelineResponse,
                viewPipelineResponse
            ]
        }
    };

})(module);