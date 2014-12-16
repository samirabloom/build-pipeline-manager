(function (module) {
    "use strict";

    var buildOne = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "pipelineId": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "number": 1,
        "status": "PASSED",
        "stage": "BUILD",
        "message": "build completed",
        "createdDate": "2014-12-14T18:52:02.043Z",
        "updatedDate": "2014-12-14T18:52:02.043Z"
    };

    var buildTwo = {
        "id": "ffffffff-ffff-42f5-a13e-9deac7dd590e",
        "pipelineId": "ffffffff-ffff-42f5-a13e-9deac7dd590e",
        "number": 3,
        "status": "IN_PROGRESS",
        "stage": "AUTO_QA",
        "message": "auto qa being deployed",
        "createdDate": "2014-12-14T18:52:02.043Z",
        "updatedDate": "2014-12-14T18:52:02.043Z"
    };

    var pipelineOne = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "name": "pipeline one",
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

    var pipelineTwo = {
        "id": "ffffffff-ffff-42f5-a13e-9deac7dd590e",
        "name": "pipeline two",
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
            view: buildOne,
            edit: buildTwo,
            list: [
                buildOne,
                buildTwo,
                buildOne,
                buildTwo
            ]
        },
        pipeline: {
            view: pipelineOne,
            edit: pipelineOne,
            list: [
                pipelineOne,
                pipelineTwo
            ]
        }
    };

})(module);